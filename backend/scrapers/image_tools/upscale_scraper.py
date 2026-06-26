import base64
import requests
import io
import json
import time
import os
from PIL import Image

# Import uguu uploader directly
try:
    from uguu_uploader import upload_uguu
except ImportError:
    import sys
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    from uguu_uploader import upload_uguu

def get_upscale_image(payload):
    image_data = payload.get("image") or payload.get("url") or payload.get("data") or ""
    if not image_data:
        return {"success": False, "error": "Missing required parameter: image or url"}

    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    })

    # 1. Fetch image bytes from URL or Base64
    try:
        is_url = image_data.startswith("http://") or image_data.startswith("https://")
        if is_url:
            r_img = session.get(image_data, timeout=15)
            if r_img.status_code != 200:
                return {"success": False, "error": f"Failed to download image from URL. Status code: {r_img.status_code}"}
            img_bytes = r_img.content
        else:
            if "," in image_data:
                image_data = image_data.split(",")[1]
            img_bytes = base64.b64decode(image_data)
    except Exception as e:
        return {"success": False, "error": f"Failed to retrieve image data: {str(e)}"}

    # 2. Convert to raw base64 string
    raw_b64 = base64.b64encode(img_bytes).decode("utf-8")

    # 3. Request VectorInk cloud function
    try:
        api_url = "https://us-central1-vector-ink.cloudfunctions.net/upscaleImage"
        req_headers = {
            "Content-Type": "application/json",
            "Origin": "https://vectorink.io",
            "Referer": "https://vectorink.io/",
        }
        req_payload = {
            "data": {
                "image": raw_b64
            }
        }
        r_upscale = session.post(api_url, headers=req_headers, json=req_payload, timeout=60)
        if r_upscale.status_code != 200:
            return {"success": False, "error": f"Upscale service returned status code {r_upscale.status_code}"}
        
        res_json = r_upscale.json()
        result_str = res_json.get("result", "")
        if not result_str:
            return {"success": False, "error": "Upscale service returned empty result"}
            
        result_data = json.loads(result_str)
        b64_image = result_data.get("image", {}).get("b64_json", "")
        if not b64_image:
            return {"success": False, "error": "Upscale service failed to generate image"}
            
    except Exception as e:
        return {"success": False, "error": f"Upscale transaction failed: {str(e)}"}

    # 4. Decode WebP and read dimensions
    try:
        webp_bytes = base64.b64decode(b64_image)
        img_webp = Image.open(io.BytesIO(webp_bytes))
        width, height = img_webp.size
    except Exception as e:
        width, height = None, None

    # 5. Re-upload transparent/upscaled result to Uguu.se
    uguu_upscaled_url = None
    try:
        upscaled_payload = {
            "image": "data:image/webp;base64," + b64_image
        }
        uguu_res = upload_uguu(upscaled_payload)
        if uguu_res.get("success"):
            uguu_upscaled_url = uguu_res.get("data", {}).get("link")
    except:
        pass

    if not uguu_upscaled_url:
        return {"success": False, "error": "Failed to upload upscaled image to CDN"}

    # 6. Re-upload original image to Uguu.se
    uguu_original_url = None
    try:
        original_b64 = "data:image/jpeg;base64," + base64.b64encode(img_bytes).decode('utf-8')
        original_res = upload_uguu({"image": original_b64})
        if original_res.get("success"):
            uguu_original_url = original_res.get("data", {}).get("link")
    except:
        pass

    original_url = uguu_original_url
    if not original_url and is_url:
        original_url = image_data

    return {
        "success": True,
        "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "data": {
            "url": uguu_upscaled_url,
            "original": original_url,
            "width": width,
            "height": height,
        }
    }
