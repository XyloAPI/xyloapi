import base64
import requests
import io
import time
import os
from PIL import Image

try:
    from uguu_uploader import upload_uguu
except ImportError:
    import sys
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    from uguu_uploader import upload_uguu

def get_flipped_image(payload):
    image_data = payload.get("image") or payload.get("url") or payload.get("data") or ""
    if not image_data:
        return {"success": False, "error": "Missing required parameter: image or url"}

    direction = payload.get("direction") or payload.get("mode") or "horizontal"
    direction = str(direction).lower().strip()

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

    # 2. Flip image using Pillow transpose
    try:
        img = Image.open(io.BytesIO(img_bytes))
        width, height = img.size

        if direction == "vertical":
            flipped_img = img.transpose(Image.FLIP_TOP_BOTTOM)
        else:
            flipped_img = img.transpose(Image.FLIP_LEFT_RIGHT)
            
        out_buf = io.BytesIO()
        fmt = img.format if img.format else "JPEG"
        if fmt == "PNG" or img.mode == "RGBA":
            fmt = "PNG"
            mime_prefix = "data:image/png;base64,"
        else:
            fmt = "JPEG"
            mime_prefix = "data:image/jpeg;base64,"

        flipped_img.save(out_buf, format=fmt, quality=90)
        flipped_bytes = out_buf.getvalue()
    except Exception as e:
        return {"success": False, "error": f"Failed to flip image: {str(e)}"}

    # 3. Upload flipped image to Uguu.se
    uguu_flipped_url = None
    try:
        flipped_b64 = mime_prefix + base64.b64encode(flipped_bytes).decode('utf-8')
        uguu_res = upload_uguu({"image": flipped_b64})
        if uguu_res.get("success"):
            uguu_flipped_url = uguu_res.get("data", {}).get("link")
    except:
        pass

    if not uguu_flipped_url:
        return {"success": False, "error": "Failed to upload flipped image to CDN"}

    # 4. Upload original image to Uguu.se
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
            "url": uguu_flipped_url,
            "original": original_url,
            "width": width,
            "height": height,
        }
    }
