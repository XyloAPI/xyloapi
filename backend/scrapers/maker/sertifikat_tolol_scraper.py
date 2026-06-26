# -*- coding: utf-8 -*-
import os
import io
import time
import requests
from PIL import Image, ImageDraw, ImageFont

TEMPLATE_URL = "https://i.imgur.com/LimF1kv.jpeg"
FONT_URL = "https://cdn.jsdelivr.net/gh/ibnux/Generator-Sertifikat-Tolol/HelveticaNeueMed.ttf"


ASSETS_DIR = os.path.join(os.path.dirname(__file__), "sertifikat_tolol_assets")
UGUU_URL = "https://uguu.se/upload.php"

def _upload_to_uguu(binary: bytes) -> str:
    filename = f"sertifikat_tolol_{int(time.time())}.png"
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
        res = requests.get(
            url, 
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            timeout=30
        )
        res.raise_for_status()
        with open(file_path, "wb") as f:
            f.write(res.content)
    return file_path

def generate_sertifikat_tolol(payload):
    try:
        name = str(payload.get("name") or payload.get("nama") or "ADMIN").strip().upper()

        template_path = get_cached_file(TEMPLATE_URL, "template.jpg")
        font_path = get_cached_file(FONT_URL, "HelveticaNeueMed.ttf")

        img = Image.open(template_path).convert("RGBA")
        draw = ImageDraw.Draw(img)

        # Font size is 30
        font = ImageFont.truetype(font_path, 30)

        W, H = img.size
        # Draw the uppercase name exactly centered on the image
        draw.text((W // 2, H // 2), name, font=font, fill=(255, 255, 255, 255), anchor="mm")

        # Convert back to RGB or keep RGBA, save as JPEG as original
        img = img.convert("RGB")
        out_buf = io.BytesIO()
        img.save(out_buf, format="JPEG", quality=100)
        image_bytes = out_buf.getvalue()

        try:
            image_url = _upload_to_uguu(image_bytes)
        except Exception:
            import base64
            b64 = base64.b64encode(image_bytes).decode("utf-8")
            image_url = f"data:image/jpeg;base64,{b64}"

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "image": image_url,
                "nama": name
            }
        }

    except Exception as e:
        return {"success": False, "error": f"Failed to generate Sertifikat Tolol: {str(e)}"}
