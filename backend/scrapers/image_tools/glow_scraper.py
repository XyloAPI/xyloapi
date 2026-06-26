import base64
import requests
import io
import time
import os
from PIL import Image, ImageFilter, ImageChops

try:
    from uguu_uploader import upload_uguu
except ImportError:
    import sys
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    from uguu_uploader import upload_uguu

def get_glow_image(payload):
    image_data = payload.get("image") or payload.get("url") or payload.get("data") or ""
    if not image_data:
        return {"success": False, "error": "Missing required parameter: image or url"}

    intensity = payload.get("intensity")
    if intensity is None:
        intensity = 20
    try:
        intensity = max(1, min(100, float(intensity)))
    except:
        intensity = 20

    radius = payload.get("radius")
    if radius is None:
        radius = 10
    try:
        radius = max(1, min(50, float(radius)))
    except:
        radius = 10

    color = payload.get("color")
    if not color:
        color = "#ffffff"
    color = str(color).strip()

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

    # 2. Process Glow Effect
    try:
        img = Image.open(io.BytesIO(img_bytes))
        width, height = img.size

        # Clamp bounding box coordinates to image dimensions
        is_selective = x is not None and y is not None and w is not None and h is not None
        if is_selective:
            x = max(0, min(width - 1, x))
            y = max(0, min(height - 1, y))
            w = max(1, min(width - x, w))
            h = max(1, min(height - y, h))
            box = (x, y, x + w, y + h)
            target_img = img.crop(box)
        else:
            target_img = img.copy()

        # Convert target image to RGBA
        target_rgba = target_img.convert("RGBA")
        t_width, t_height = target_rgba.size

        # Parse hex color
        hex_color = color.lstrip('#')
        if len(hex_color) == 3:
            hex_color = "".join([c*2 for c in hex_color])
        if len(hex_color) != 6:
            hex_color = "ffffff"
        rgb_color = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

        # Create glow shadow layer
        alpha = target_rgba.split()[-1]
        blurred_alpha = alpha.filter(ImageFilter.GaussianBlur(radius))
        
        glow_shadow = Image.new("RGBA", (t_width, t_height), rgb_color)
        glow_opacity = (intensity / 100.0) * 0.8
        glow_shadow.putalpha(blurred_alpha.point(lambda p: min(255, int(p * glow_opacity))))

        # Screen blend mode compositing
        original_rgb = target_rgba.convert("RGB")
        shadow_rgb = glow_shadow.convert("RGB")
        shadow_alpha = glow_shadow.split()[-1]

        screened_rgb = ImageChops.screen(original_rgb, shadow_rgb)
        result_rgb = Image.composite(screened_rgb, original_rgb, shadow_alpha)

        # Lighter blend mode compositing if intensity > 50
        if intensity > 50:
            addition_rgb = ImageChops.add(result_rgb, shadow_rgb, scale=1.0, offset=0)
            addition_alpha = shadow_alpha.point(lambda p: min(255, int(p * 0.3)))
            result_rgb = Image.composite(addition_rgb, result_rgb, addition_alpha)

        # Merge back the original alpha channel
        processed_target = Image.merge("RGBA", result_rgb.split() + (alpha,))

        # Put back selective cropped part if applicable
        if is_selective:
            out_img = img.copy()
            # If the original image doesn't support alpha but we processed with RGBA, we can paste it back
            # or keep it as is.
            if out_img.mode not in ("RGB", "RGBA"):
                out_img = out_img.convert("RGBA")
            out_img.paste(processed_target, box)
            img = out_img
        else:
            img = processed_target

        out_buf = io.BytesIO()
        fmt = img.format if img.format else "PNG"
        img.save(out_buf, format=fmt)
        processed_bytes = out_buf.getvalue()
    except Exception as e:
        return {"success": False, "error": f"Failed to apply glow effect to image: {str(e)}"}

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
