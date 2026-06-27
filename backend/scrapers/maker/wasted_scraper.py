# -*- coding: utf-8 -*-
import os
import io
import time
import math
import requests
from PIL import Image, ImageDraw

ASSETS_DIR = os.path.join(os.path.dirname(__file__), "wasted_assets")
UGUU_URL = "https://uguu.se/upload.php"
WASTED_TEXT_URL = "https://i.imgur.com/pijahZ3.png"

def _upload_to_uguu(binary: bytes) -> str:
    filename = f"wasted_{int(time.time())}.png"
    res = requests.post(
        UGUU_URL,
        files={"files[]": (filename, io.BytesIO(binary), "image/png")},
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        timeout=45,
    )
    res.raise_for_status()
    data = res.json()
    if data.get("success") and data.get("files"):
        return data["files"][0].get("url", "")
    raise Exception("Uguu upload failed")

def get_cached_file(url, filename):
    os.makedirs(ASSETS_DIR, exist_ok=True)
    file_path = os.path.join(ASSETS_DIR, filename)
    if not os.path.exists(file_path):
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        res = requests.get(url, headers=headers, timeout=60)
        res.raise_for_status()
        with open(file_path, "wb") as f:
            f.write(res.content)
    return file_path

def apply_vignette(img):
    w, h = img.size
    vignette = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    v_draw = ImageDraw.Draw(vignette)
    
    cx, cy = w / 2, h / 2
    max_dist = math.sqrt(cx**2 + cy**2)
    steps = 80
    
    # Overwrite inner concentric circles with lower opacity to create a smooth vignette
    for i in range(steps):
        r = max_dist * (1 - i / steps)
        alpha = int(220 * (1 - i / steps) ** 1.8)
        v_draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(0, 0, 0, alpha))
        
    return Image.alpha_composite(img, vignette)

def generate_wasted(payload):
    try:
        user_image_url = payload.get("image") or payload.get("url") or ""
        if not user_image_url:
            return {"success": False, "error": "Missing required 'image' parameter"}

        # 1. Download/Cache "wasted" text PNG
        text_path = get_cached_file(WASTED_TEXT_URL, "wasted_text.png")
        wasted_text_src = Image.open(text_path).convert("RGBA")

        # 2. Download user image
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        try:
            if str(user_image_url).startswith("data:image/"):
                import base64
                header, encoded = str(user_image_url).split(",", 1)
                user_data = base64.b64decode(encoded)
                user_img = Image.open(io.BytesIO(user_data))
            else:
                res = requests.get(user_image_url, headers=headers, timeout=15)
                res.raise_for_status()
                user_img = Image.open(io.BytesIO(res.content))
        except Exception as e:
            return {"success": False, "error": f"Failed to download user image: {str(e)}"}

        # Convert user image to monochrome (L mode) and back to RGBA
        user_mono = user_img.convert("L").convert("RGBA")

        # Apply film grain to the photo
        noise = Image.effect_noise(user_mono.size, 75).convert("RGBA")
        user_mono_grained = Image.blend(user_mono, noise, 0.22)

        # Apply dark vignette effect
        canvas = apply_vignette(user_mono_grained)
        w, h = canvas.size

        # 3. Process wasted text: crop to actual text boundaries to remove empty spaces
        bbox = wasted_text_src.getbbox()
        if bbox:
            wasted_text = wasted_text_src.crop(bbox)
        else:
            wasted_text = wasted_text_src

        # Calculate dynamic size of wasted text (e.g. 55% of canvas width)
        target_w = int(w * 0.55)
        aspect = wasted_text.width / wasted_text.height
        target_h = int(target_w / aspect)
        
        # Resize wasted text
        wasted_text_resized = wasted_text.resize((target_w, target_h), Image.Resampling.LANCZOS)

        # 4. Draw horizontal dark smoke black bar behind the text
        bar_height = int(target_h * 1.45)
        bar_y1 = (h - bar_height) // 2
        bar_y2 = bar_y1 + bar_height
        
        # Draw translucent smoke black bar on a separate layer and blend
        bar_layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
        bar_draw = ImageDraw.Draw(bar_layer)
        bar_draw.rectangle([0, bar_y1, w, bar_y2], fill=(0, 0, 0, 140))
        canvas = Image.alpha_composite(canvas, bar_layer)

        # 5. Paste the "wasted" text centered over the bar
        paste_x = (w - target_w) // 2
        paste_y = (h - target_h) // 2
        canvas.paste(wasted_text_resized, (paste_x, paste_y), wasted_text_resized)

        # Output PNG
        img_byte_arr = io.BytesIO()
        canvas.save(img_byte_arr, format="PNG")
        binary_data = img_byte_arr.getvalue()

        try:
            image_url = _upload_to_uguu(binary_data)
        except Exception:
            import base64
            b64 = base64.b64encode(binary_data).decode("utf-8")
            image_url = f"data:image/png;base64,{b64}"

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "image": image_url
            }
        }

    except Exception as e:
        return {"success": False, "error": f"Failed to generate Wasted image: {str(e)}"}
