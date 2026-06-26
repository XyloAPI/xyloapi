import io
import json
import time
import uuid
import random
import string
import requests

from flux_scraper import UGUU_HEADERS

HF_SPACE = "https://vauth-somnium.hf.space"
GRADIO_API = f"{HF_SPACE}/gradio_api"

# Only 1:1 and 9:16 are supported
VALID_RATIOS = {"1:1", "9:16"}

# Map common aliases → supported ratio
RATIO_MAP = {
    "1:1": "1:1",
    "9:16": "9:16",
    "16:9": "1:1",   # fallback
    "4:3": "1:1",
    "3:4": "9:16",
    "3:2": "1:1",
    "2:3": "9:16",
}

VALID_STYLES = [
    "Futurepunk V4", "Character V4", "Cinematic V4", "Steampunk V4",
    "Fujifilm V4", "Van Gogh V4", "Exprealism V4", "Zdzislaw V4",
    "Neonic V4", "Complex System V4", "Stick Logo V4", "Golden Hour v4",
    "Realistic v4", "Realistic v3", "Dreamland v3", "Surrealism v3",
    "Cartoon v3", "Expressionism v3", "Impressionism v3", "Pastel v3",
    "Sepia v3", "Diorama v3", "Papercut v3", "Flat v3", "Graffiti v3",
    "Clay v3", "Robots v3", "Crochet v3", "Dreamland v2", "Mechanical v3.1",
    "Mechanical v3.0", "Ukiyo-e v3", "Tattoo v3", "Colored Tattoo v3",
    "Botany v3", "Starry v3", "Retro Pop v3", "Logo v3", "Sticker v3",
    "HDR v3", "Sketch v3", "Cartoonist v3", "Ink v3", "Whimsical v3",
    "Festive v3", "Anime v3", "Comic v3", "Dark Fantasy v3", "Horror v3",
    "Baroque v3", "Anime v2.1", "Monster v3", "Realistic v2", "Figure v3",
    "Abstract v2", "Simple Design v2", "Anime v2", "Retro Sci-Fi v2",
    "Spectral", "Figure", "Realistic", "Comic", "Anime", "HDR",
    "Steampunk v2", "Nightly v2", "3D v4", "Abyssal Void v4",
]

DEFAULT_STYLE = "Realistic v4"


def _gen_zerogpu_uuid():
    seg1 = ''.join(random.choices(string.ascii_letters + string.digits, k=3))
    seg2 = ''.join(random.choices(string.ascii_letters + string.digits + "-_", k=16))
    return f"{seg1}-{seg2}"


def _execute_generation(prompt, style, ratio, proxy=None):
    session_hash = uuid.uuid4().hex[:11]
    zerogpu_uuid = _gen_zerogpu_uuid()
    proxies_dict = {"http": proxy, "https": proxy} if proxy else None

    headers = {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "origin": HF_SPACE,
        "referer": f"{HF_SPACE}/?__theme=system",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
        "x-gradio-server": f"{HF_SPACE}/",
        "x-gradio-user": "app",
        "x-zerogpu-uuid": zerogpu_uuid,
    }

    join_body = {
        "data": [prompt, style, None, ratio],
        "fn_index": 0,
        "trigger_id": 6,
        "session_hash": session_hash,
    }

    try:
        join_r = requests.post(
            f"{GRADIO_API}/queue/join?__theme=system",
            json=join_body,
            headers=headers,
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
            headers={**headers, "accept": "text/event-stream"},
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
            err = error_msg or "No image returned from Somnium"
            return {"success": False, "error": err}

        return {"success": True, "image_url": image_url}
    except Exception as e:
        return {"success": False, "error": str(e)}


def get_somnium_image(payload):
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

        # Resolve style
        style = payload.get("style") or payload.get("model") or DEFAULT_STYLE
        if style not in VALID_STYLES:
            style = DEFAULT_STYLE

        # Resolve ratio (only 1:1 and 9:16 supported)
        aspect = (payload.get("aspect_ratio") or payload.get("ratio") or "1:1").strip()
        ratio = RATIO_MAP.get(aspect, "1:1")

        res = None
        proxy_used = None

        # Helper: try generation with retries on a given proxy
        def try_generation(p_proxy, max_retries=3):
            for attempt in range(max_retries):
                r = _execute_generation(prompt, style, ratio, p_proxy)
                if r.get("success"):
                    return r
                err = r.get("error", "")
                if "quota" in err.lower() or "503" in err or "500" in err:
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
        img_r = requests.get(image_url, headers={"user-agent": "Mozilla/5.0"}, timeout=30)
        img_r.raise_for_status()
        image_bytes = img_r.content

        # Detect format
        mime = "image/jpeg"
        ext = "jpg"
        if image_url.endswith(".webp") or b"WEBP" in image_bytes[:12]:
            mime, ext = "image/webp", "webp"
        elif image_url.endswith(".png") or image_bytes[:4] == b"\x89PNG":
            mime, ext = "image/png", "png"

        try:
            filename = f"somnium_{int(time.time())}.{ext}"
            upload_r = requests.post(
                "https://uguu.se/upload.php",
                files={"files[]": (filename, io.BytesIO(image_bytes), mime)},
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
                "style": style,
                "aspect_ratio": ratio,
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Failed to run Somnium image generation: {e}"}
