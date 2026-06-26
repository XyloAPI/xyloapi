# -*- coding: utf-8 -*-
import os
import io
import time
import requests
from PIL import Image, ImageDraw, ImageFont

BG_URL = "https://i.8upload.com/image/f4542a3cae8bcd07/my.png"
FONT_URL = "https://github.com/google/fonts/raw/main/ofl/greatvibes/GreatVibes-Regular.ttf"
ASSETS_DIR = os.path.join(os.path.dirname(__file__), "darksystem_assets")
UGUU_URL = "https://uguu.se/upload.php"

def _upload_to_uguu(binary: bytes) -> str:
    filename = f"darksystem_{int(time.time())}.png"
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

def generate_darksystem(payload):
    try:
        # Get parameter 'name' or 'nama' or fallback to a default
        name = payload.get("name") or payload.get("nama") or payload.get("text") or "Master Dark System"
        if isinstance(name, list):
            name = name[0] if name else "Master Dark System"
        
        name = name.strip()
        
        # Load background template and font
        bg_path = get_cached_file(BG_URL, "darksystem_template.png")
        font_path = get_cached_file(FONT_URL, "GreatVibes-Regular.ttf")
        
        img = Image.open(bg_path).convert("RGBA")
        draw = ImageDraw.Draw(img)
        
        # Calligraphy font at size 110
        font = ImageFont.truetype(font_path, 110)
        
        # Left-aligned above the white line
        x = 65
        y = 410
        
        # Solid white text
        color = (255, 255, 255, 255)
        draw.text((x, y), name, font=font, fill=color)
        
        # Convert to bytes and upload to Uguu
        out_buf = io.BytesIO()
        img.save(out_buf, format="PNG")
        image_bytes = out_buf.getvalue()
        
        try:
            image_url = _upload_to_uguu(image_bytes)
        except Exception:
            import base64
            b64 = base64.b64encode(image_bytes).decode("utf-8")
            image_url = f"data:image/png;base64,{b64}"
            
        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "image": image_url,
                "name": name
            }
        }
        
    except Exception as e:
        return {"success": False, "error": f"Failed to generate dark system certificate"}
