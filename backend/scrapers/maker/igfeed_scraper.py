# -*- coding: utf-8 -*-
import os
import io
import time
import requests
from PIL import Image, ImageDraw, ImageFont

ASSETS_DIR = os.path.join(os.path.dirname(__file__), "igfeed_assets")
UGUU_URL = "https://uguu.se/upload.php"

# Default fallback URLs
DEFAULT_AVATAR = "https://i.imgur.com/9l66omG.jpeg"
DEFAULT_PHOTO = "https://i.imgur.com/BGs3Cu5.jpeg"
FONT_REGULAR_URL = "https://cdn.jsdelivr.net/gh/googlefonts/roboto/src/hinted/Roboto-Regular.ttf"
FONT_BOLD_URL = "https://cdn.jsdelivr.net/gh/googlefonts/roboto/src/hinted/Roboto-Bold.ttf"

def _upload_to_uguu(binary: bytes) -> str:
    filename = f"igfeed_{int(time.time())}.png"
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

def download_image_to_memory(url, fallback_url=None):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    try:
        res = requests.get(url, headers=headers, timeout=30)
        res.raise_for_status()
        return Image.open(io.BytesIO(res.content))
    except Exception:
        if fallback_url:
            try:
                res = requests.get(fallback_url, headers=headers, timeout=30)
                res.raise_for_status()
                return Image.open(io.BytesIO(res.content))
            except Exception:
                pass
        # Final fallback: create a dummy color block
        return Image.new("RGBA", (470, 470), (239, 239, 239, 255))

def generate_igfeed(payload):
    try:
        username = str(payload.get("username") or "sterling_dev").strip()
        avatar_url = str(payload.get("avatar") or DEFAULT_AVATAR).strip()
        post_url = str(payload.get("post") or DEFAULT_PHOTO).strip()
        caption = str(payload.get("caption") or "Explore the world through code. 🚀✨").strip()
        likes_str = str(payload.get("likes") or "4,643 likes").strip()
        
        # Parse theme
        theme = str(payload.get("theme") or "light").strip().lower()

        font_reg_path = get_cached_file(FONT_REGULAR_URL, "Roboto-Regular.ttf")
        font_bold_path = get_cached_file(FONT_BOLD_URL, "Roboto-Bold.ttf")

        # Color system
        if theme == "dark":
            bg_color = (0, 0, 0, 255)
            text_color = (255, 255, 255, 255)
            gray_text_color = (142, 142, 142, 255)
            border_color = (38, 38, 38, 255)
        else:
            bg_color = (255, 255, 255, 255)
            text_color = (38, 38, 38, 255)
            gray_text_color = (142, 142, 142, 255)
            border_color = (219, 219, 219, 255)

        # Fonts
        font_username = ImageFont.truetype(font_bold_path, 14)
        font_likes = ImageFont.truetype(font_bold_path, 14)
        font_text = ImageFont.truetype(font_reg_path, 14)
        font_dots = ImageFont.truetype(font_bold_path, 16)

        # Load avatar & post image
        avatar_img = download_image_to_memory(avatar_url, DEFAULT_AVATAR)
        post_img = download_image_to_memory(post_url, DEFAULT_PHOTO)

        # Dimensions & Coordinates
        card_width = 470
        header_height = 56
        image_height = 470
        interactions_bar_height = 46
        
        # Caption layout
        temp_img = Image.new("RGBA", (100, 100))
        temp_draw = ImageDraw.Draw(temp_img)
        
        max_caption_width = card_width - 32
        lines = []
        words = caption.split(" ")
        current_line = []
        
        # We need username prefix on line 1
        username_prefix = username + " "
        first_line = True
        
        for word in words:
            prefix = username_prefix if first_line else ""
            test_line = prefix + " ".join(current_line + [word])
            bbox = temp_draw.textbbox((0, 0), test_line, font=font_text)
            w = bbox[2] - bbox[0]
            if w > max_caption_width:
                lines.append(" ".join(current_line))
                current_line = [word]
                first_line = False
            else:
                current_line.append(word)
        if current_line:
            lines.append(" ".join(current_line))

        line_height = 18
        caption_height = len(lines) * line_height + 8
        likes_height = 20
        padding_bottom = 16
        
        total_height = header_height + image_height + interactions_bar_height + likes_height + caption_height + padding_bottom
        
        card = Image.new("RGBA", (card_width, total_height), bg_color)
        draw = ImageDraw.Draw(card)

        # Draw Header
        # Render Avatar with story ring gradient
        ring_size = 38
        ring_img = Image.new("RGBA", (ring_size, ring_size), (0, 0, 0, 0))
        ring_draw = ImageDraw.Draw(ring_img)
        
        # Draw IG Gradient Ring
        for i in range(ring_size):
            r = int(240 - (240 - 188) * (i / ring_size))
            g = int(148 - (148 - 24) * (i / ring_size))
            b = int(51 - (51 - 136) * (i / ring_size))
            ring_draw.arc((0, 0, ring_size-1, ring_size-1), i * (360 / ring_size), (i + 1) * (360 / ring_size), fill=(r, g, b, 255), width=2)
            
        card.paste(ring_img, (12, 9), ring_img)

        # Place Circular Avatar inside story ring
        avatar_size = 32
        avatar_cropped = avatar_img.convert("RGBA").resize((avatar_size, avatar_size), Image.Resampling.LANCZOS)
        mask = Image.new("L", (avatar_size, avatar_size), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.ellipse((0, 0, avatar_size, avatar_size), fill=255)
        
        card.paste(avatar_cropped, (15, 12), mask=mask)

        # Render username
        draw.text((62, 19), username, fill=text_color, font=font_username)

        # Render More Options dot dot dot
        draw.text((438, 14), "...", fill=text_color, font=font_dots)

        # Draw Post Image (squared)
        post_resized = post_img.convert("RGBA").resize((card_width, image_height), Image.Resampling.LANCZOS)
        card.paste(post_resized, (0, header_height))

        # Draw Interactions Bar Icons
        bar_y = header_height + image_height
        
        # Heart Icon
        heart_fill = (237, 73, 86, 255)
        # Custom Path for red heart
        draw.polygon([(26, bar_y + 16), (36, bar_y + 26), (46, bar_y + 16), (46, bar_y + 11), (41, bar_y + 6), (36, bar_y + 10), (31, bar_y + 6), (26, bar_y + 11)], fill=heart_fill)

        # Comment Bubble
        draw.arc((66, bar_y + 12, 82, bar_y + 26), 0, 360, fill=text_color, width=2)
        draw.polygon([(66, bar_y + 22), (62, bar_y + 28), (70, bar_y + 26)], fill=text_color)

        # Share Paper Plane
        draw.line([(102, bar_y + 26), (116, bar_y + 12)], fill=text_color, width=2)
        draw.line([(116, bar_y + 12), (102, bar_y + 18)], fill=text_color, width=2)
        draw.line([(116, bar_y + 12), (110, bar_y + 26)], fill=text_color, width=2)
        draw.line([(102, bar_y + 26), (102, bar_y + 18)], fill=text_color, width=2)
        draw.line([(102, bar_y + 26), (110, bar_y + 26)], fill=text_color, width=2)

        # Pagination Dots (center)
        dot_y = bar_y + 18
        draw.ellipse((226, dot_y, 231, dot_y + 5), fill="#0095f6")
        draw.ellipse((235, dot_y, 239, dot_y + 4), fill=gray_text_color)
        draw.ellipse((243, dot_y, 247, dot_y + 4), fill=gray_text_color)

        # Bookmark Save Icon (right)
        bm_x = 432
        draw.line([(bm_x, bar_y + 12), (bm_x + 14, bar_y + 12)], fill=text_color, width=2)
        draw.line([(bm_x, bar_y + 12), (bm_x, bar_y + 28)], fill=text_color, width=2)
        draw.line([(bm_x + 14, bar_y + 12), (bm_x + 14, bar_y + 28)], fill=text_color, width=2)
        draw.line([(bm_x, bar_y + 28), (bm_x + 7, bar_y + 22)], fill=text_color, width=2)
        draw.line([(bm_x + 14, bar_y + 28), (bm_x + 7, bar_y + 22)], fill=text_color, width=2)

        # Likes Text
        likes_y = bar_y + interactions_bar_height
        draw.text((16, likes_y), likes_str, fill=text_color, font=font_likes)

        # Caption (with username highlighted)
        cap_y = likes_y + likes_height + 4
        
        first_line_text = lines[0] if lines else ""
        draw.text((16, cap_y), username, fill=text_color, font=font_username)
        
        username_bbox = draw.textbbox((16, cap_y), username + " ", font=font_username)
        indent_w = username_bbox[2] - username_bbox[0]
        
        draw.text((16 + indent_w, cap_y), first_line_text, fill=text_color, font=font_text)
        
        curr_y = cap_y + line_height
        for next_line in lines[1:]:
            draw.text((16, curr_y), next_line, fill=text_color, font=font_text)
            curr_y += line_height

        img_byte_arr = io.BytesIO()
        card.save(img_byte_arr, format="PNG")
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
                "username": username,
                "theme": theme,
                "likes": likes_str
            }
        }

    except Exception as e:
        return {"success": False, "error": f"Failed to generate Instagram feed image: {str(e)}"}
