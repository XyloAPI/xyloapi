import os
import io
import time
import base64
import requests

INVOKE_URL = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.2-klein-4b"
UGUU_URL = "https://uguu.se/upload.php"
UGUU_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

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


def _upload_to_uguu(b64_str: str) -> str:
    """Upload base64 image to uguu.se and return direct URL."""
    binary = base64.b64decode(b64_str)
    # Detect format
    if binary.startswith(b"\x89PNG\r\n\x1a\n"):
        mime, ext = "image/png", "png"
    else:
        mime, ext = "image/jpeg", "jpg"
    filename = f"flux_{int(time.time())}.{ext}"
    res = requests.post(
        UGUU_URL,
        files={"files[]": (filename, io.BytesIO(binary), mime)},
        headers=UGUU_HEADERS,
        timeout=45,
    )
    res.raise_for_status()
    data = res.json()
    if data.get("success") and data.get("files"):
        return data["files"][0].get("url", "")
    raise Exception("Uguu upload failed")


def get_flux_image(payload):
    try:
        api_key = os.environ.get("NVIDIA_TOKEN") or os.environ.get("NVIDIA_API_KEY") or ""
        if not api_key:
            return {"success": False, "error": "API key is not configured in the server environment (.env)"}

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

        steps = 4
        try:
            if payload.get("steps"):
                steps = int(payload["steps"])
        except (ValueError, TypeError):
            pass

        seed = 0
        try:
            if payload.get("seed") is not None:
                seed = int(payload["seed"])
        except (ValueError, TypeError):
            pass

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Accept": "application/json",
            "Content-Type": "application/json",
        }

        body = {
            "prompt": prompt,
            "width": width,
            "height": height,
            "seed": seed,
            "steps": steps,
        }

        r = requests.post(INVOKE_URL, headers=headers, json=body, timeout=120)

        if r.status_code != 200:
            try:
                err_data = r.json()
                error_msg = err_data.get("detail") or err_data.get("error") or "Failed to generate image"
            except Exception:
                error_msg = r.text.strip() or "Failed to generate image"
            return {"success": False, "error": f"Flux API returned status code {r.status_code}: {error_msg}"}

        data = r.json()

        b64 = None
        image_url = None

        if "data" in data and data["data"]:
            item = data["data"][0]
            b64 = item.get("b64_json")
            image_url = item.get("url")
        elif "artifacts" in data and data["artifacts"]:
            b64 = data["artifacts"][0].get("base64")

        # If we got base64, upload to uguu for a clean URL
        if b64:
            try:
                image_url = _upload_to_uguu(b64)
            except Exception:
                # Fallback: return as data URI if upload fails
                image_url = f"data:image/jpeg;base64,{b64}"

        if not image_url:
            return {"success": False, "error": "No image data returned from Flux API"}

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "image": image_url,
                "prompt": prompt,
                "width": width,
                "height": height,
                "aspect_ratio": aspect,
            }
        }
    except Exception:
        return {"success": False, "error": "Failed to run Flux image generation"}
