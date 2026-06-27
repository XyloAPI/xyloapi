# -*- coding: utf-8 -*-
import os
import io
import time
import requests
from PIL import Image, ImageDraw, ImageFont

ASSETS_DIR = os.path.join(os.path.dirname(__file__), "pakustad_assets")
UGUU_URL = "https://uguu.se/upload.php"

TEMPLATE_TYPE1 = "https://i.imgur.com/8cmOf73.jpeg"
TEMPLATE_TYPE2 = "https://i.imgur.com/pyed2xS.jpeg"
FONT_LEMON = "https://cdn.jsdelivr.net/gh/LemonSync/Pak_Ustad/media/fonts/Lemon.ttf"

def _upload_to_uguu(binary: bytes) -> str:
    filename = f"pakustad_{int(time.time())}.png"
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

def generate_pakustad(payload):
    try:
        text = str(payload.get("isi") or payload.get("text") or "Tobat woi").strip()
        option = str(payload.get("option") or "type1").strip().lower()

        # Enforce maximum text length as per original source code limit of 68
        if len(text) > 68:
            text = text[:68]

        # Download/Cache font and templates
        font_path = get_cached_file(FONT_LEMON, "Lemon.ttf")
        
        if option == "type2":
            bg_path = get_cached_file(TEMPLATE_TYPE2, "pak_ustad2.jpg")
            font_size = 40
            max_text_width = 500
            start_y = 220
            line_height = 45
        else:
            bg_path = get_cached_file(TEMPLATE_TYPE1, "pak_ustad.jpg")
            font_size = 30
            max_text_width = 405
            start_y = 120
            line_height = 35

        # Open template
        img = Image.open(bg_path).convert("RGBA")
        draw = ImageDraw.Draw(img)
        font = ImageFont.truetype(font_path, font_size)

        # Word wrap text
        words = text.split(" ")
        lines = []
        current_line = []

        for word in words:
            test_line = " ".join(current_line + [word])
            # Measure line width
            bbox = draw.textbbox((0, 0), test_line, font=font)
            w = bbox[2] - bbox[0]
            if w <= max_text_width:
                current_line.append(word)
            else:
                if current_line:
                    lines.append(" ".join(current_line))
                    current_line = [word]
                else:
                    # Single word exceeds max width, split character by character
                    sub_line = ""
                    for char in word:
                        test_sub = sub_line + char
                        bbox_sub = draw.textbbox((0, 0), test_sub, font=font)
                        if (bbox_sub[2] - bbox_sub[0]) > max_text_width:
                            lines.append(sub_line)
                            sub_line = char
                        else:
                            sub_line = test_sub
                    if sub_line:
                        current_line = [sub_line]
                    else:
                        current_line = []
        if current_line:
            lines.append(" ".join(current_line))

        # Render wrapped text lines centered
        centerX = img.width / 2
        for i, line_text in enumerate(lines):
            line_bbox = draw.textbbox((0, 0), line_text, font=font)
            line_w = line_bbox[2] - line_bbox[0]
            x = centerX - line_w / 2
            y = start_y + i * line_height
            draw.text((x, y), line_text, fill=(0, 0, 0, 255), font=font)

        # Output PNG
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format="PNG")
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
                "image": image_url,
                "text": text,
                "option": option
            }
        }

    except Exception as e:
        return {"success": False, "error": f"Failed to generate Pak Ustad image: {str(e)}"}
