import io
import json
import time
import uuid
import random
import os
import re
import sys
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

from flux_scraper import UGUU_HEADERS, ASPECT_RATIOS

HF_SPACE = "https://ideogram-ai-ideogram4.hf.space"
GRADIO_API = f"{HF_SPACE}/gradio_api"

HEADERS = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "origin": HF_SPACE,
    "referer": f"{HF_SPACE}/?__theme=system",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
    "x-gradio-server": HF_SPACE + "/",
    "x-gradio-user": "app",
}


CACHE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "proxy_cache.json")


def get_free_proxies():
    proxies = []
    try:
        r = requests.get("https://free-proxy-list.net/", timeout=10)
        if r.status_code == 200:
            matches = re.findall(r"(\d+\.\d+\.\d+\.\d+):(\d+)", r.text)
            for ip, port in matches:
                proxies.append(f"http://{ip}:{port}")
    except Exception:
        pass
    return list(set(proxies))


def check_proxy(proxy, timeout=2.0):
    try:
        r = requests.get(
            "https://huggingface.co/api/spaces/ideogram-ai/ideogram4",
            proxies={"http": proxy, "https": proxy},
            timeout=timeout
        )
        if r.status_code == 200:
            return proxy
    except Exception:
        pass
    return None


def load_cached_proxies():
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, "r") as f:
                data = json.load(f)
                now = time.time()
                # 15 minutes cache lifetime
                valid_proxies = [
                    p["proxy"] for p in data 
                    if now - p["timestamp"] < 900
                ]
                return valid_proxies
        except Exception:
            pass
    return []


def save_working_proxies(proxies):
    try:
        now = time.time()
        existing = []
        if os.path.exists(CACHE_FILE):
            try:
                with open(CACHE_FILE, "r") as f:
                    existing = json.load(f)
            except Exception:
                pass
        
        # Merge, filter out old, and update timestamps
        proxy_map = {item["proxy"]: item["timestamp"] for item in existing if now - item["timestamp"] < 900}
        for p in proxies:
            proxy_map[p] = now
            
        new_data = [{"proxy": p, "timestamp": ts} for p, ts in proxy_map.items()]
        # Keep top 15 most recent
        new_data.sort(key=lambda x: x["timestamp"], reverse=True)
        new_data = new_data[:15]
        
        with open(CACHE_FILE, "w") as f:
            json.dump(new_data, f)
    except Exception:
        pass


def find_working_proxies(count=6, force_new=False):
    # 1. Try cached proxies first (highly responsive timeout: 1.2s)
    if not force_new:
        cached = load_cached_proxies()
        if cached:
            print(f"Checking {len(cached)} cached proxies...", file=sys.stderr)
            working_cached = []
            with ThreadPoolExecutor(max_workers=10) as executor:
                futures = {executor.submit(check_proxy, p, 1.2): p for p in cached}
                for fut in as_completed(futures):
                    res = fut.result()
                    if res:
                        working_cached.append(res)
                        if len(working_cached) >= count:
                            break
            if working_cached:
                return working_cached
            print("All cached proxies failed. Fetching new ones...", file=sys.stderr)

    # 2. Fallback to free proxy scraping
    candidates = get_free_proxies()
    if not candidates:
        return []
    random.shuffle(candidates)
    
    working = []
    with ThreadPoolExecutor(max_workers=30) as executor:
        futures = {executor.submit(check_proxy, p, 1.5): p for p in candidates[:100]}
        for fut in as_completed(futures):
            res = fut.result()
            if res:
                working.append(res)
                if len(working) >= 12:  # Find up to 12 working ones to populate the cache
                    break
    if working:
        save_working_proxies(working)
    return working[:count]


def _execute_generation(payload, proxy=None):
    prompt = payload.get("prompt") or payload.get("text") or ""
    if isinstance(prompt, list):
        prompt = prompt[0] if prompt else ""
    if not prompt:
        return {"success": False, "error": "Missing required parameter: prompt"}

    aspect = (payload.get("aspect_ratio") or payload.get("ratio") or "1:1").strip()
    width, height = ASPECT_RATIOS.get(aspect, (1024, 1024))

    try:
        if payload.get("width"):
            width = int(payload["width"])
        if payload.get("height"):
            height = int(payload["height"])
    except (ValueError, TypeError):
        pass

    seed = random.randint(0, 2**31)
    session_hash = uuid.uuid4().hex[:10]

    headers = HEADERS.copy()

    join_body = {
        "data": [prompt, "Turbo · 12 steps", "Ideogram (remote)", width, height, seed, True],
        "event_data": None,
        "fn_index": 2,
        "trigger_id": 6,
        "session_hash": session_hash,
    }

    proxies_dict = {"http": proxy, "https": proxy} if proxy else None

    try:
        join_r = requests.post(
            f"{GRADIO_API}/queue/join?__theme=system",
            json=join_body,
            headers=headers,
            proxies=proxies_dict,
            timeout=8,
        )

        if join_r.status_code != 200:
            return {"success": False, "error": f"Ideogram 4 queue join failed with status {join_r.status_code}"}
    except Exception as e:
        return {"success": False, "error": f"Join connection error: {e}"}

    image_url = None
    buffer = ""
    done = False

    try:
        with requests.get(
            f"{GRADIO_API}/queue/data?session_hash={session_hash}",
            headers={**headers, "accept": "text/event-stream"},
            proxies=proxies_dict,
            stream=True,
            timeout=50,
        ) as stream_r:
            for chunk in stream_r.iter_content(chunk_size=None):
                if not chunk or done:
                    continue
                buffer += chunk.decode("utf-8", errors="ignore")
                while "\n" in buffer:
                    line, buffer = buffer.split("\n", 1)
                    line = line.strip()
                    if not line.startswith("data:"):
                        continue
                    try:
                        msg = json.loads(line[5:].strip())
                        if msg.get("msg") == "process_completed":
                            output = msg.get("output", {})
                            
                            # Check for ZeroGPU quota or other errors
                            if not msg.get("success", True) or "error" in output:
                                error_msg = output.get("error") or "Unknown Hugging Face space error"
                                return {"success": False, "error": error_msg}

                            data = output.get("data", [])
                            if data and isinstance(data[0], dict):
                                image_url = data[0].get("url") or data[0].get("path")
                            done = True
                            break
                        elif msg.get("msg") == "close_stream":
                            done = True
                            break
                    except Exception:
                        pass
    except Exception as e:
        return {"success": False, "error": f"Stream connection error: {e}"}

    if not image_url:
        return {"success": False, "error": "No image returned from Ideogram 4"}

    return {
        "success": True,
        "image_url": image_url,
        "width": width,
        "height": height,
        "aspect_ratio": aspect
    }


def get_ideogram_image(payload):
    try:
        # 1. Try cached proxies first
        proxies = find_working_proxies(count=6, force_new=False)
        res = {"success": False, "error": "No working proxies found"}
        
        tried = set()
        for proxy in proxies:
            tried.add(proxy)
            print(f"Generating Ideogram 4 via proxy: {proxy} ...", file=sys.stderr)
            fallback_res = _execute_generation(payload, proxy=proxy)
            if fallback_res.get("success"):
                res = fallback_res
                break
        
        # 2. If cached proxies failed, fetch fresh proxies and try them
        if not res.get("success"):
            print("Cached proxies failed to generate. Fetching fresh proxies...", file=sys.stderr)
            fresh_proxies = find_working_proxies(count=6, force_new=True)
            for proxy in fresh_proxies:
                if proxy in tried:
                    continue
                print(f"Generating Ideogram 4 via fresh proxy: {proxy} ...", file=sys.stderr)
                fallback_res = _execute_generation(payload, proxy=proxy)
                if fallback_res.get("success"):
                    res = fallback_res
                    break
        
        # 3. As a last resort fallback, if no proxies worked, try direct connection
        if not res.get("success"):
            print("All proxies failed. Attempting direct connection as last resort...", file=sys.stderr)
            last_res = _execute_generation(payload)
            if last_res.get("success"):
                res = last_res
        
        if not res.get("success"):
            return res

        image_url = res["image_url"]
        width = res["width"]
        height = res["height"]
        aspect = res["aspect_ratio"]
        prompt = payload.get("prompt") or payload.get("text") or ""
        if isinstance(prompt, list):
            prompt = prompt[0] if prompt else ""

        # Download and upload to uguu
        img_r = requests.get(image_url, headers={"user-agent": HEADERS["user-agent"]}, timeout=30)
        img_r.raise_for_status()
        image_bytes = img_r.content

        try:
            filename = f"ideogram_{int(time.time())}.png"
            upload_r = requests.post(
                "https://uguu.se/upload.php",
                files={"files[]": (filename, io.BytesIO(image_bytes), "image/png")},
                headers=UGUU_HEADERS,
                timeout=45,
            )
            upload_r.raise_for_status()
            upload_data = upload_r.json()
            if upload_data.get("success") and upload_data.get("files"):
                final_url = upload_data["files"][0].get("url", "")
            else:
                raise Exception("Uguu upload failed")
        except Exception:
            final_url = image_url

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "image": final_url,
                "prompt": prompt,
                "width": width,
                "height": height,
                "aspect_ratio": aspect,
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Failed to run Ideogram 4 image generation: {e}"}
