# -*- coding: utf-8 -*-
import os
import io
import time
import requests
from PIL import Image

ASSETS_DIR = os.path.join(os.path.dirname(__file__), "iphone_context_menu_assets")
UGUU_URL = "https://uguu.se/upload.php"
IPHONE_CONTEXT_MENU_TEMPLATE_URL = "https://i.imgur.com/xrdmYoc.png"

def _upload_to_uguu(binary: bytes) -> str:
    filename = f"iphone_context_menu_{int(time.time())}.png"
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

def generate_iphone_context_menu(payload):
    try:
        user_image_url = payload.get("image") or payload.get("url") or ""
        if not user_image_url:
            return {"success": False, "error": "Missing required 'image' parameter"}

        # 1. Download/Cache template
        template_path = get_cached_file(IPHONE_CONTEXT_MENU_TEMPLATE_URL, "iphone_context_menu_template.png")
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

        # 3. Crop to a perfect square with offside bleed size: 1850x1850
        target_size = 1850
        user_img_resized = crop_to_fill(user_img.convert("RGBA"), target_size, target_size)

        # 4. Composite: user image placed BEHIND template
        # The frame box is (31, 295) to (1874, 2137)
        # Center of frame: cx=952, cy=1216. To center 1850x1850: paste at (27, 291)
        paste_x = 27
        paste_y = 291

        canvas = Image.new("RGBA", template.size, (0, 0, 0, 0))
        canvas.paste(user_img_resized, (paste_x, paste_y))
        canvas.alpha_composite(template)

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
        return {"success": False, "error": f"Failed to generate iPhone Context Menu: {str(e)}"}
