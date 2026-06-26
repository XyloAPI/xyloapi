import io
import json
import time
import uuid
import random
import requests

from flux_scraper import UGUU_HEADERS

HF_SPACE = "https://baidu-ernie-image-turbo.hf.space"
GRADIO_API = f"{HF_SPACE}/gradio_api"

# Map aspect ratio to size string
RATIO_TO_SIZE = {
    "1:1":   "1024x1024",
    "16:9":  "1376x768",
    "9:16":  "768x1376",
    "4:3":   "1200x896",
    "3:4":   "896x1200",
    "3:2":   "1264x848",
    "2:3":   "848x1264",
}

HEADERS = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
}


def _execute_generation(prompt, size):
    seed = random.randint(0, 2**31)
    session_hash = uuid.uuid4().hex[:11]

    # fn_index=1 = generate_image
    # data: [prompt, size, seed, use_pe]
    join_body = {
        "data": [prompt, size, seed, True],
        "event_data": None,
        "fn_index": 1,
        "trigger_id": 6,
        "session_hash": session_hash,
    }

    try:
        join_r = requests.post(
            f"{GRADIO_API}/queue/join",
            json=join_body,
            headers=HEADERS,
            timeout=15,
        )

        if join_r.status_code != 200:
            return {"success": False, "error": f"ERNIE Image queue join failed with status {join_r.status_code}"}

        image_url = None
        buffer = ""
        done = False
        error_msg = None

        with requests.get(
            f"{GRADIO_API}/queue/data?session_hash={session_hash}",
            headers={**HEADERS, "accept": "text/event-stream"},
            stream=True,
            timeout=180,
        ) as stream_r:
            for chunk in stream_r.iter_content(chunk_size=None):
                if not chunk or done:
                    continue
                buffer += chunk.decode("utf-8", errors="ignore")
                # Process complete lines
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
            err = error_msg or "No image returned from ERNIE Image Turbo"
            return {"success": False, "error": err}

        return {"success": True, "image_url": image_url}
    except Exception as e:
        return {"success": False, "error": str(e)}


def get_ernieimage_image(payload):
    try:
        import sys
        prompt = payload.get("prompt") or payload.get("text") or ""
        if isinstance(prompt, list):
            prompt = prompt[0] if prompt else ""
        if not prompt:
            return {"success": False, "error": "Missing required parameter: prompt"}

        aspect = (payload.get("aspect_ratio") or payload.get("ratio") or "1:1").strip()
        size = RATIO_TO_SIZE.get(aspect, "1024x1024")

        # Retry loop for load-balanced broken replicas
        max_retries = 5
        res = {"success": False, "error": "Failed to query space"}
        for attempt in range(max_retries):
            res = _execute_generation(prompt, size)
            if res.get("success"):
                break
            
            error_msg = res.get("error", "")
            if "MissingDateHeader" in error_msg or "API 错误" in error_msg or "status 50" in error_msg:
                print(f"Temporary ERNIE replica failure (attempt {attempt + 1}/{max_retries}): {error_msg}. Retrying...", file=sys.stderr)
                time.sleep(0.5)
            else:
                break

        if not res.get("success"):
            return res

        image_url = res["image_url"]

        # Download and upload to uguu
        img_r = requests.get(image_url, headers={"user-agent": HEADERS["user-agent"]}, timeout=30)
        img_r.raise_for_status()
        image_bytes = img_r.content

        # Detect format from content or URL
        mime = "image/png"
        ext = "png"
        if image_url.endswith(".webp") or b"WEBP" in image_bytes[:12]:
            mime, ext = "image/webp", "webp"
        elif image_url.endswith(".jpg") or image_url.endswith(".jpeg"):
            mime, ext = "image/jpeg", "jpg"

        try:
            filename = f"ernie_{int(time.time())}.{ext}"
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

        w, h = size.split("x")
        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "image": final_url,
                "prompt": prompt,
                "width": int(w),
                "height": int(h),
                "aspect_ratio": aspect,
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Failed to run ERNIE Image Turbo generation: {e}"}
