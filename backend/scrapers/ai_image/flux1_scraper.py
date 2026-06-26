import flux_scraper

INVOKE_URL_FLUX1 = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-schnell"


def get_flux1_image(payload):
    # Temporarily override the URL by patching, or just duplicate the logic cleanly
    import os
    import io
    import time
    import base64
    import requests

    api_key = os.environ.get("NVIDIA_TOKEN") or os.environ.get("NVIDIA_API_KEY") or ""
    if not api_key:
        return {"success": False, "error": "API key is not configured in the server environment (.env)"}

    prompt = payload.get("prompt") or payload.get("text") or ""
    if isinstance(prompt, list):
        prompt = prompt[0] if prompt else ""
    if not prompt:
        return {"success": False, "error": "Missing required parameter: prompt"}

    aspect = (payload.get("aspect_ratio") or payload.get("ratio") or "1:1").strip()
    width, height = flux_scraper.ASPECT_RATIOS.get(aspect, (1024, 1024))

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

    body = {"prompt": prompt, "width": width, "height": height, "seed": seed, "steps": steps}

    try:
        r = requests.post(INVOKE_URL_FLUX1, headers=headers, json=body, timeout=120)

        if r.status_code != 200:
            try:
                err_data = r.json()
                error_msg = err_data.get("detail") or err_data.get("error") or "Failed to generate image"
            except Exception:
                error_msg = r.text.strip() or "Failed to generate image"
            return {"success": False, "error": f"Flux 1 API returned status code {r.status_code}: {error_msg}"}

        data = r.json()
        b64 = None
        image_url = None

        if "data" in data and data["data"]:
            item = data["data"][0]
            b64 = item.get("b64_json")
            image_url = item.get("url")
        elif "artifacts" in data and data["artifacts"]:
            b64 = data["artifacts"][0].get("base64")

        if b64:
            try:
                image_url = flux_scraper._upload_to_uguu(b64)
            except Exception:
                image_url = f"data:image/jpeg;base64,{b64}"

        if not image_url:
            return {"success": False, "error": "No image data returned from Flux 1 API"}

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
        return {"success": False, "error": "Failed to run Flux 1 image generation"}
