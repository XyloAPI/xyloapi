import io
import json
import time
import uuid
import random
import requests

from flux_scraper import UGUU_HEADERS

HF_SPACE = "https://mrfakename-z-image-turbo.hf.space"
GRADIO_API = f"{HF_SPACE}/gradio_api"

# Aspect ratio presets → (width, height)
ASPECT_RATIOS = {
    "1:1":   (1024, 1024),
    "16:9":  (1344, 768),
    "9:16":  (768, 1344),
    "4:3":   (1152, 896),
    "3:4":   (896, 1152),
    "3:2":   (1216, 832),
    "2:3":   (832, 1216),
    "21:9":  (1536, 640),
}

HEADERS = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
}


def _execute_generation(prompt, width, height, proxy):
    steps = 9
    seed = random.randint(0, 2**31)
    session_hash = uuid.uuid4().hex[:11]
    proxies_dict = {"http": proxy, "https": proxy} if proxy else None

    join_body = {
        "data": [prompt, height, width, steps, seed, True],
        "event_data": None,
        "fn_index": 2,
        "trigger_id": 16,
        "session_hash": session_hash,
    }

    try:
        join_r = requests.post(
            f"{GRADIO_API}/queue/join",
            json=join_body,
            headers=HEADERS,
            proxies=proxies_dict,
            timeout=15,
        )

        if join_r.status_code != 200:
            return {"success": False, "error": f"Queue join failed with status {join_r.status_code}"}

        image_url = None
        buffer = ""
        done = False
        error_msg = None

        with requests.get(
            f"{GRADIO_API}/queue/data?session_hash={session_hash}",
            headers={**HEADERS, "accept": "text/event-stream"},
            stream=True,
            proxies=proxies_dict,
            timeout=180,
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
                            if not msg.get("success", True) or "error" in output:
                                error_msg = output.get("error") or "Unknown space error"
                            else:
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

        if not image_url:
            err = error_msg or "No image returned from Z-Image-Turbo"
            return {"success": False, "error": err}

        return {"success": True, "image_url": image_url}
    except Exception as e:
        return {"success": False, "error": str(e)}


def get_zimageturbo_image(payload):
    try:
        import sys
        try:
            from ideogram_scraper import find_working_proxies, load_cached_proxies, save_working_proxies, check_proxy
        except ImportError:
            find_working_proxies = None

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

        res = None
        proxy_used = None

        # Helper to try generation multiple times on a given proxy
        def try_generation(p_proxy, max_retries=3):
            for attempt in range(max_retries):
                r = _execute_generation(prompt, width, height, p_proxy)
                if r.get("success"):
                    return r

                err = r.get("error", "")
                if "quota" in err.lower() or "503" in err or "500" in err or "404" in err:
                    print(f"Proxy {p_proxy} failed (attempt {attempt+1}/{max_retries}): {err}. Retrying...", file=sys.stderr)
                    time.sleep(1)
                else:
                    return r
            return {"success": False, "error": f"Failed after {max_retries} retries"}

        if find_working_proxies:
            print("Trying cached proxies first...", file=sys.stderr)
            cached_proxies = load_cached_proxies()
            success_from_cache = False
            for p in cached_proxies:
                if check_proxy(p):
                    print(f"Using cached proxy: {p}", file=sys.stderr)
                    res = try_generation(p, max_retries=2)
                    if res.get("success"):
                        proxy_used = p
                        success_from_cache = True
                        break

            if not success_from_cache:
                print("Cached proxies failed. Scraping new proxies...", file=sys.stderr)
                new_proxies = find_working_proxies(count=2, force_new=True)
                for p in new_proxies:
                    if p not in cached_proxies:
                        cached_proxies.append(p)

                if new_proxies:
                    save_working_proxies(cached_proxies)
                    for p in new_proxies:
                        print(f"Trying new proxy: {p}", file=sys.stderr)
                        res = try_generation(p, max_retries=2)
                        if res.get("success"):
                            proxy_used = p
                            break

        if not res or not res.get("success"):
            print("Falling back to direct connection...", file=sys.stderr)
            res = try_generation(None, max_retries=3)

        if not res or not res.get("success"):
            return res

        image_url = res["image_url"]

        # Download image directly (no proxy to avoid IncompleteRead)
        img_r = requests.get(image_url, headers={"user-agent": HEADERS["user-agent"]}, timeout=30)
        img_r.raise_for_status()
        image_bytes = img_r.content

        try:
            filename = f"zimage_{int(time.time())}.png"
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
        return {"success": False, "error": f"Failed to run Z-Image-Turbo image generation: {e}"}
