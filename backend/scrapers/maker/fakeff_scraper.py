# -*- coding: utf-8 -*-
import os
import io
import time
import random
import requests
from PIL import Image, ImageDraw, ImageFont, ImageFilter

FONT_URL = "https://cdn.jsdelivr.net/gh/Ditzzx-vibecoder/fake-ff/assets/fonts/TeutonNormal.otf"
BG_URL_TEMPLATE = "https://cdn.jsdelivr.net/gh/Ditzzx-vibecoder/fake-ff/assets/lobby/{}.jpg"
ASSETS_DIR = os.path.join(os.path.dirname(__file__), "fakeff_assets")
UGUU_URL = "https://uguu.se/upload.php"
LOBBY_COUNT = 30

def _upload_to_uguu(binary: bytes) -> str:
    filename = f"fakeff_{int(time.time())}.jpg"
    res = requests.post(
        UGUU_URL,
        files={"files[]": (filename, io.BytesIO(binary), "image/jpeg")},
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

def interpolate_color(t):
    stops = [
        (0.00, (255, 253, 231)),
        (0.35, (255, 229, 127)),
        (0.70, (255, 179, 0)),
        (1.00, (255, 143, 0))
    ]
    for i in range(len(stops) - 1):
        t1, c1 = stops[i]
        t2, c2 = stops[i+1]
        if t1 <= t <= t2:
            factor = (t - t1) / (t2 - t1)
            r = int(c1[0] + (c2[0] - c1[0]) * factor)
            g = int(c1[1] + (c2[1] - c1[1]) * factor)
            b = int(c1[2] + (c2[2] - c1[2]) * factor)
            return (r, g, b, 255)
    return (255, 143, 0, 255)

def generate_fake_ff(payload):
    try:
        # Get username/name parameter
        username = payload.get("username") or payload.get("name") or payload.get("nama") or payload.get("text") or "Player"
        if isinstance(username, list):
            username = username[0] if username else "Player"
        username = username.strip()
        # Max 20 chars
        username = username[:20]

        # Get lobby index parameter
        lobby_val = payload.get("lobby")
        if isinstance(lobby_val, list):
            lobby_val = lobby_val[0] if lobby_val else None
        
        try:
            if lobby_val is not None:
                lobby_num = int(lobby_val)
                lobby_num = max(1, min(lobby_num, LOBBY_COUNT))
            else:
                lobby_num = random.randint(1, LOBBY_COUNT)
        except ValueError:
            lobby_num = random.randint(1, LOBBY_COUNT)

        # Download/Cache background lobby and font
        lobby_url = BG_URL_TEMPLATE.format(lobby_num)
        bg_path = get_cached_file(lobby_url, f"lobby_{lobby_num}.jpg")
        font_path = get_cached_file(FONT_URL, "TeutonNormal.otf")

        img = Image.open(bg_path).convert("RGBA")
        draw = ImageDraw.Draw(img)

        # 1. Determine font size (shrink to fit safe zone of width 592)
        size = 85
        font = None
        text_w = 0
        text_h = 0
        bbox = None
        
        while size > 12:
            font = ImageFont.truetype(font_path, size)
            bbox = draw.textbbox((0, 0), username, font=font)
            text_w = bbox[2] - bbox[0]
            text_h = bbox[3] - bbox[1]
            if text_w <= 592:
                break
            size -= 1

        # Safe zone config coordinates
        a = 2650
        b = 2790
        centerX = 1009
        
        boxH = b - a
        centerY = a + boxH // 2

        # Create temporary canvas for text + shadow + gradient
        pad = 40
        text_canvas = Image.new("RGBA", (text_w + pad, text_h + pad), (0, 0, 0, 0))
        
        tx = pad // 2 - bbox[0]
        ty = pad // 2 - bbox[1]
        
        # Render shadow to a mask
        shadow_mask = Image.new("L", (text_w + pad, text_h + pad), 0)
        shadow_draw = ImageDraw.Draw(shadow_mask)
        shadow_draw.text((tx + 3, ty + 4), username, font=font, fill=178) # 70% opacity
        shadow_mask = shadow_mask.filter(ImageFilter.GaussianBlur(radius=4))
        
        shadow_layer = Image.new("RGBA", (text_w + pad, text_h + pad), (0, 0, 0, 255))
        text_canvas.paste(shadow_layer, (0, 0), shadow_mask)
        
        # Render text to a mask for gradient
        text_mask = Image.new("L", (text_w + pad, text_h + pad), 0)
        mask_draw = ImageDraw.Draw(text_mask)
        mask_draw.text((tx, ty), username, font=font, fill=255)
        
        # Create horizontal linear gradient
        gradient = Image.new("RGBA", (text_w + pad, text_h + pad))
        for x_coord in range(text_canvas.width):
            if x_coord < tx:
                t = 0.0
            elif x_coord > tx + text_w:
                t = 1.0
            else:
                t = (x_coord - tx) / text_w
            color = interpolate_color(t)
            for y_coord in range(text_canvas.height):
                gradient.putpixel((x_coord, y_coord), color)
                
        text_canvas.paste(gradient, (0, 0), text_mask)
        
        # Paste text canvas onto main image centered at centerX and centerY
        paste_x = centerX - text_canvas.width // 2
        paste_y = centerY - text_canvas.height // 2
        img.paste(text_canvas, (paste_x, paste_y), text_canvas)

        # Convert back to RGB and save as JPEG
        out_buf = io.BytesIO()
        img.convert("RGB").save(out_buf, format="JPEG", quality=95)
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
                "username": username,
                "lobby": lobby_num
            }
        }

    except Exception as e:
        return {"success": False, "error": f"Failed to generate fake Free Fire lobby"}
