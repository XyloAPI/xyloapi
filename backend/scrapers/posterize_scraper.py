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

def get_posterized_image(payload):
    image_data = payload.get("image") or payload.get("url") or payload.get("data") or ""
    if not image_data:
        return {"success": False, "error": "Missing required parameter: image or url"}

    color_levels = payload.get("color_levels")
    if color_levels is None:
        color_levels = 8
    try:
        color_levels = max(2, min(256, int(color_levels)))
    except:
        color_levels = 8

    # Selective region coordinates
    x = payload.get("x")
    y = payload.get("y")
    w = payload.get("w")
    h = payload.get("h")

    try:
        if x is not None: x = int(x)
        if y is not None: y = int(y)
        if w is not None: w = int(w)
        if h is not None: h = int(h)
    except:
        x, y, w, h = None, None, None, None

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

    # 2. Posterize image using PIL vectorized LUT mapping
    try:
        img = Image.open(io.BytesIO(img_bytes))
        width, height = img.size

        # Convert palette images or other modes to RGB/RGBA to apply filter cleanly
        has_alpha = img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info)
        target_mode = "RGBA" if has_alpha else "RGB"
        if img.mode != target_mode:
            img = img.convert(target_mode)

        # Build Look-up Table (LUT)
        step_size = 256.0 / color_levels
        lut = [int(int(i / step_size) * step_size) for i in range(256)]
        
        # We only want to map RGB channels, leaving Alpha channel unchanged if it exists
        if target_mode == "RGBA":
            # For RGBA, we can split channels, apply point to RGB, and merge back
            r, g, b, a = img.split()
            r = r.point(lut)
            g = g.point(lut)
            b = b.point(lut)
            processed_img = Image.merge("RGBA", (r, g, b, a))
        else:
            processed_img = img.point(lut * 3)

        # Clamp bounding box coordinates to image dimensions
        if x is not None and y is not None and w is not None and h is not None:
            # Bound check
            x = max(0, min(width - 1, x))
            y = max(0, min(height - 1, y))
            w = max(1, min(width - x, w))
            h = max(1, min(height - y, h))

            box = (x, y, x + w, y + h)
            cropped = img.crop(box)
            
            # Apply posterization to cropped region
            if target_mode == "RGBA":
                cr, cg, cb, ca = cropped.split()
                cr = cr.point(lut)
                cg = cg.point(lut)
                cb = cb.point(lut)
                posterized_crop = Image.merge("RGBA", (cr, cg, cb, ca))
            else:
                posterized_crop = cropped.point(lut * 3)
            
            # Avoid in-place modification side-effects
            out_img = img.copy()
            out_img.paste(posterized_crop, box)
            img = out_img
        else:
            img = processed_img

        out_buf = io.BytesIO()
        fmt = img.format if img.format else "PNG"
        img.save(out_buf, format=fmt)
        processed_bytes = out_buf.getvalue()
    except Exception as e:
        return {"success": False, "error": f"Failed to apply posterization to image: {str(e)}"}

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
