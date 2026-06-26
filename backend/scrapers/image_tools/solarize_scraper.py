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

def get_solarized_image(payload):
    image_data = payload.get("image") or payload.get("url") or payload.get("data") or ""
    if not image_data:
        return {"success": False, "error": "Missing required parameter: image or url"}

    threshold = payload.get("threshold")
    if threshold is None:
        threshold = 128
    try:
        threshold = max(0, min(255, float(threshold)))
    except:
        threshold = 128

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

    # 2. Solarize image using NTSC luminance thresholding
    try:
        img = Image.open(io.BytesIO(img_bytes))
        width, height = img.size

        # Convert to RGBA/RGB if needed
        has_alpha = img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info)
        target_mode = "RGBA" if has_alpha else "RGB"
        if img.mode != target_mode:
            img = img.convert(target_mode)

        pixels = img.load()
        for y in range(height):
            for x in range(width):
                pixel = pixels[x, y]
                r, g, b = pixel[0], pixel[1], pixel[2]
                brightness = 0.299 * r + 0.587 * g + 0.114 * b
                if brightness > threshold:
                    if has_alpha:
                        pixels[x, y] = (255 - r, 255 - g, 255 - b, pixel[3])
                    else:
                        pixels[x, y] = (255 - r, 255 - g, 255 - b)

        out_buf = io.BytesIO()
        fmt = img.format if img.format else "PNG"
        img.save(out_buf, format=fmt)
        processed_bytes = out_buf.getvalue()
    except Exception as e:
        return {"success": False, "error": f"Failed to apply solarization to image: {str(e)}"}

    # 3. Upload processed image to Uguu.se
    uguu_processed_url = None
    try:
        mime = "image/png" if fmt.lower() == "png" else "image/jpeg"
        b64_str = f"data:{mime};base64," + base64.b64encode(processed_bytes).decode('utf-8')
        uguu_res = upload_uguu({"image": b64_str})
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
