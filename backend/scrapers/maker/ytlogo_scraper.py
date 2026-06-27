# -*- coding: utf-8 -*-
import os
import io
import re
import time
import requests
from PIL import Image, ImageDraw, ImageFont

ASSETS_DIR = os.path.join(os.path.dirname(__file__), "ytlogo_assets")
UGUU_URL = "https://uguu.se/upload.php"

FONT_BOLD_URL = "https://cdn.jsdelivr.net/gh/googlefonts/roboto/src/hinted/Roboto-Bold.ttf"
FONT_REGULAR_URL = "https://cdn.jsdelivr.net/gh/googlefonts/roboto/src/hinted/Roboto-Regular.ttf"

def _upload_to_uguu(binary: bytes) -> str:
    filename = f"ytlogo_{int(time.time())}.png"
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

def parse_color(color_str, default=(238, 28, 27, 255)):
    if not color_str:
        return default
    color_str = str(color_str).strip()
    
    # rgb(r, g, b) or rgba(r, g, b, a)
    rgb_match = re.match(r'^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d\.]+))?\s*\)$', color_str, re.IGNORECASE)
    if rgb_match:
        r, g, b = int(rgb_match.group(1)), int(rgb_match.group(2)), int(rgb_match.group(3))
        a = float(rgb_match.group(4)) if rgb_match.group(4) else 1.0
        return (r, g, b, int(a * 255))
        
    # hex color
    hex_str = color_str.lstrip('#')
    if len(hex_str) == 3:
        hex_str = ''.join([c*2 for c in hex_str])
    if len(hex_str) == 6:
        try:
            return (int(hex_str[0:2], 16), int(hex_str[2:4], 16), int(hex_str[4:6], 16), 255)
        except ValueError:
            pass
    elif len(hex_str) == 8:
        try:
            return (int(hex_str[0:2], 16), int(hex_str[2:4], 16), int(hex_str[4:6], 16), int(hex_str[6:8], 16))
        except ValueError:
            pass
            
    return color_str

def generate_ytlogo(payload):
    try:
        you = str(payload.get("you") or "You").strip()
        tube = str(payload.get("tube") or "Tube").strip()
        
        youfontsize = int(payload.get("youfontsize") or 100)
        tubefontsize = int(payload.get("tubefontsize") or 100)
        bold_opt = str(payload.get("bold") or "bold").strip().lower()
        
        bgwidth = int(payload.get("bgwidth") or 480)
        bgheight = int(payload.get("bgheight") or 480)
        
        bgcolor = parse_color(payload.get("bgcolor") or "rgb(238,28,27)", (238, 28, 27, 255))
        rightbgcolor = parse_color(payload.get("rightbgcolor") or "#FFFFFF", (255, 255, 255, 255))
        leftcolor = parse_color(payload.get("leftcolor") or "#FFFFFF", (255, 255, 255, 255))
        rightcolor = parse_color(payload.get("rightcolor") or "rgb(238,28,27)", (238, 28, 27, 255))

        # Setup fonts
        font_path = get_cached_file(
            FONT_BOLD_URL if bold_opt == "bold" else FONT_REGULAR_URL,
            "font.ttf"
        )
        font_you = ImageFont.truetype(font_path, youfontsize)
        font_tube = ImageFont.truetype(font_path, tubefontsize)

        # Setup canvas
        img = Image.new("RGBA", (bgwidth, bgheight), bgcolor)
        draw = ImageDraw.Draw(img)

        # Text size calculations
        you_bbox = draw.textbbox((0, 0), you, font=font_you)
        tube_bbox = draw.textbbox((0, 0), tube, font=font_tube)

        you_w = you_bbox[2] - you_bbox[0]
        tube_w = tube_bbox[2] - tube_bbox[0]
        
        you_h = you_bbox[3] - you_bbox[1]
        tube_h = tube_bbox[3] - tube_bbox[1]
        
        max_h = max(you_h, tube_h)

        # Padding details for Tube box
        pad_x = int(tubefontsize * 0.16)
        pad_y = int(tubefontsize * 0.08)
        spacing = int(max(youfontsize, tubefontsize) * 0.08)
        radius = int(tubefontsize * 0.20)  # YouTube logo has rounder corners (16px at 100px font size)

        # Total layout width
        total_w = you_w + spacing + (pad_x * 2) + tube_w

        # Center placement coordinates
        start_x = (bgwidth - total_w) / 2
        
        # Center vertically based on text height
        start_y_you = (bgheight - you_h) / 2 - you_bbox[1]
        start_y_tube = (bgheight - tube_h) / 2 - tube_bbox[1]

        # Draw left text (You)
        draw.text((start_x, start_y_you), you, fill=leftcolor, font=font_you)

        # Draw right rounded rectangle (Tube box)
        box_x1 = start_x + you_w + spacing
        box_y1 = start_y_tube + tube_bbox[1] - pad_y
        box_x2 = box_x1 + (pad_x * 2) + tube_w
        box_y2 = start_y_tube + tube_bbox[1] + tube_h + pad_y

        draw.rounded_rectangle([box_x1, box_y1, box_x2, box_y2], radius=radius, fill=rightbgcolor)

        # Draw right text inside box (Tube)
        draw.text((box_x1 + pad_x, start_y_tube), tube, fill=rightcolor, font=font_tube)

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
                "you": you,
                "tube": tube
            }
        }

    except Exception as e:
        return {"success": False, "error": f"Failed to generate YouTube logo: {str(e)}"}
