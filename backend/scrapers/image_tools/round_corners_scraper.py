import base64
import requests
import io
import time
import os
from PIL import Image, ImageDraw

try:
    from uguu_uploader import upload_uguu
except ImportError:
    import sys
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    from uguu_uploader import upload_uguu

def get_rounded_image(payload):
    image_data = payload.get("image") or payload.get("url") or payload.get("data") or ""
    if not image_data:
        return {"success": False, "error": "Missing required parameter: image or url"}

    radius_val = payload.get("radius")
    if radius_val is None:
        radius_val = 30

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

    # 2. Apply round corners
    try:
        img = Image.open(io.BytesIO(img_bytes))
        width, height = img.size

        # Parse radius
        try:
            radius_str = str(radius_val).strip()
            if radius_str.endswith("%"):
                pct = float(radius_str[:-1]) / 100.0
                radius = int(min(width, height) * pct)
            else:
                radius = int(float(radius_str))
        except:
            radius = 30

        # Constraints
        max_radius = min(width, height) // 2
        radius = max(0, min(max_radius, radius))

        # 4x oversampling mask for anti-aliasing
        scale = 4
        mask_size = (width * scale, height * scale)
        mask = Image.new('L', mask_size, 0)
        draw = ImageDraw.Draw(mask)
        draw.rounded_rectangle((0, 0, mask_size[0], mask_size[1]), radius=radius * scale, fill=255)
        
        mask = mask.resize((width, height), Image.Resampling.LANCZOS)

        img_rgba = img.convert("RGBA")
        img_rgba.putalpha(mask)

        out_buf = io.BytesIO()
        img_rgba.save(out_buf, format="PNG")
        rounded_bytes = out_buf.getvalue()
    except Exception as e:
        return {"success": False, "error": f"Failed to round corners on image: {str(e)}"}

    # 3. Upload rounded PNG to Uguu.se
    uguu_rounded_url = None
    try:
        rounded_b64 = "data:image/png;base64," + base64.b64encode(rounded_bytes).decode('utf-8')
        uguu_res = upload_uguu({"image": rounded_b64})
        if uguu_res.get("success"):
            uguu_rounded_url = uguu_res.get("data", {}).get("link")
    except:
        pass

    if not uguu_rounded_url:
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
            "url": uguu_rounded_url,
            "original": original_url,
            "width": width,
            "height": height,
        }
    }
