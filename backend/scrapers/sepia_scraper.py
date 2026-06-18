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

def get_sepia_image(payload):
    image_data = payload.get("image") or payload.get("url") or payload.get("data") or ""
    if not image_data:
        return {"success": False, "error": "Missing required parameter: image or url"}

    # Determine sepia intensity (amount)
    # Default is 0.8 as in cocoshot.net
    raw_intensity = payload.get("intensity")
    if raw_intensity is None:
        raw_intensity = payload.get("amount")
        
    if raw_intensity is not None:
        try:
            val = float(raw_intensity)
            if val > 1.0:
                amount = val / 100.0
            else:
                amount = val
            # Clamp between 0.0 and 1.0
            amount = max(0.0, min(1.0, amount))
        except:
            amount = 0.8
    else:
        amount = 0.8

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

    # 2. Process image using Pillow CSS-compliant sepia matrix
    try:
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        width, height = img.size

        # W3C CSS filter sepia matrix interpolation formula:
        r_r = (1.0 - amount) + 0.393 * amount
        r_g = 0.769 * amount
        r_b = 0.189 * amount
        
        g_r = 0.349 * amount
        g_g = (1.0 - amount) + 0.686 * amount
        g_b = 0.168 * amount
        
        b_r = 0.272 * amount
        b_g = 0.534 * amount
        b_b = (1.0 - amount) + 0.131 * amount
        
        matrix = (
            r_r, r_g, r_b, 0,
            g_r, g_g, g_b, 0,
            b_r, b_g, b_b, 0
        )
        
        sepia_img = img.convert("RGB", matrix)
        
        # Save processed image to JPEG bytes
        out_buf = io.BytesIO()
        sepia_img.save(out_buf, format="JPEG", quality=90)
        sepia_bytes = out_buf.getvalue()
    except Exception as e:
        return {"success": False, "error": f"Failed to process sepia filter: {str(e)}"}

    # 3. Upload processed image to Uguu.se
    uguu_processed_url = None
    try:
        processed_b64 = "data:image/jpeg;base64," + base64.b64encode(sepia_bytes).decode('utf-8')
        uguu_res = upload_uguu({"image": processed_b64})
        if uguu_res.get("success"):
            uguu_processed_url = uguu_res.get("data", {}).get("link")
    except:
        pass

    if not uguu_processed_url:
        return {"success": False, "error": "Failed to upload processed image to CDN"}

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
            "url": uguu_processed_url,
            "original": original_url,
            "width": width,
            "height": height,
        }
    }
