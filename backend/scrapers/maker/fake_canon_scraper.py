# -*- coding: utf-8 -*-
import os
import io
import time
import requests
from PIL import Image

ASSETS_DIR = os.path.join(os.path.dirname(__file__), "fake_canon_assets")
UGUU_URL = "https://uguu.se/upload.php"
CANON_TEMPLATE_URL = "https://i.imgur.com/3v7Ruvj.png"

def _upload_to_uguu(binary: bytes) -> str:
    filename = f"fake_canon_{int(time.time())}.png"
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

def crop_to_fill(img, target_width, target_height):
    width, height = img.size
    aspect_target = target_width / target_height
    aspect_img = width / height
    if aspect_img > aspect_target:
        new_width = int(height * aspect_target)
        left = (width - new_width) // 2
        img = img.crop((left, 0, left + new_width, height))
    else:
        new_height = int(width / aspect_target)
        top = (height - new_height) // 2
        img = img.crop((0, top, width, top + new_height))
    return img.resize((target_width, target_height), Image.Resampling.LANCZOS)

def generate_fake_canon(payload):
    try:
        user_image_url = payload.get("image") or payload.get("url") or ""
        if not user_image_url:
            return {"success": False, "error": "Missing required 'image' parameter"}

        # 1. Download/Cache template
        template_path = get_cached_file(CANON_TEMPLATE_URL, "canon_template.png")
        template = Image.open(template_path).convert("RGBA")

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

        # Bounding box is x1=0, y1=141, x2=1169, y2=1501. Center is at (583, 820)
        # Optimal cropped size to allow bleed space and cover screen after rotation: 820x1220
        target_w = 820
        target_h = 1220
        user_img_resized = crop_to_fill(user_img.convert("RGBA"), target_w, target_h)

        # 3. Paste photo centered on intermediate canvas, then rotate and composite
        canvas = Image.new("RGBA", template.size, (0, 0, 0, 0))
        # Center of photo is at (410, 610)
        # Paste at (583 - 410, 820 - 610) = (173, 210)
        canvas.paste(user_img_resized, (173, 210))

        # Rotate by 24.3 degrees counter-clockwise around the viewport center (583, 820)
        rotated = canvas.rotate(24.3, resample=Image.Resampling.BICUBIC, center=(583, 820))

        # Overlay the template
        final_canvas = Image.new("RGBA", template.size, (0, 0, 0, 0))
        final_canvas.alpha_composite(rotated)
        final_canvas.alpha_composite(template)

        # Output PNG
        img_byte_arr = io.BytesIO()
        final_canvas.save(img_byte_arr, format="PNG")
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
        return {"success": False, "error": f"Failed to generate Fake Canon: {str(e)}"}
