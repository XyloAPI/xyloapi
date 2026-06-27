# -*- coding: utf-8 -*-
import os
import io
import time
import math
import requests
from PIL import Image, ImageDraw, ImageFont

ASSETS_DIR = os.path.join(os.path.dirname(__file__), "fakecomment_assets")
UGUU_URL = "https://uguu.se/upload.php"

FONT_BOLD_URL = "https://cdn.jsdelivr.net/gh/googlefonts/roboto/src/hinted/Roboto-Bold.ttf"
FONT_REGULAR_URL = "https://cdn.jsdelivr.net/gh/googlefonts/roboto/src/hinted/Roboto-Regular.ttf"

def _upload_to_uguu(binary: bytes) -> str:
    filename = f"fakecomment_{int(time.time())}.png"
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

def draw_parametric_heart(draw, cx, cy, color, filled=False):
    points = []
    # 360-step parametric heart curve
    for degree in range(360):
        t = math.radians(degree)
        x = 16 * (math.sin(t) ** 3)
        y = -(13 * math.cos(t) - 5 * math.cos(2*t) - 2 * math.cos(3*t) - math.cos(4*t))
        points.append((cx + x * 0.55, cy + y * 0.55))
    if filled:
        draw.polygon(points, fill=color)
    else:
        # Outline using polygon line segments
        draw.polygon(points, outline=color, width=2)

def generate_fakecomment(payload):
    try:
        username = str(payload.get("username") or "username").strip()
        avatar_input = payload.get("avatar") or ""
        verified = str(payload.get("verified") or "false").strip().lower() in ["true", "1", "yes"]
        comment_text = str(payload.get("text") or "This is a fake comment!").strip()
        time_val = str(payload.get("time") or "1d").strip()
        likes_val = str(payload.get("likes") or "").strip()
        liked = str(payload.get("liked") or "false").strip().lower() in ["true", "1", "yes"]
        theme = str(payload.get("theme") or "dark").strip().lower()

        # Theme Colors
        if theme == "light":
            bg_color = (255, 255, 255, 255)
            text_primary = (0, 0, 0, 255)
            text_secondary = (115, 115, 115, 255) # zinc-500
        else: # dark
            bg_color = (0, 0, 0, 255)
            text_primary = (245, 245, 245, 255) # zinc-100
            text_secondary = (163, 163, 163, 255) # zinc-400

        # Load / Cache fonts
        font_bold_path = get_cached_file(FONT_BOLD_URL, "Roboto-Bold.ttf")
        font_reg_path = get_cached_file(FONT_REGULAR_URL, "Roboto-Regular.ttf")
        
        font_username = ImageFont.truetype(font_bold_path, 14)
        font_text = ImageFont.truetype(font_reg_path, 14)
        font_meta = ImageFont.truetype(font_reg_path, 13)
        font_likes = ImageFont.truetype(font_reg_path, 11)

        # Word wrap text (Max text width is 380px)
        max_text_width = 380
        # Dummy image context just to measure wrapped text boundaries
        temp_img = Image.new("RGBA", (1, 1), (0, 0, 0, 0))
        temp_draw = ImageDraw.Draw(temp_img)
        
        words = comment_text.split(" ")
        lines = []
        current_line = []

        for word in words:
            test_line = " ".join(current_line + [word])
            bbox = temp_draw.textbbox((0, 0), test_line, font=font_text)
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
                        bbox_sub = temp_draw.textbbox((0, 0), test_sub, font=font_text)
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

        # Calculate heights
        start_y = 16
        text_y_offset = 38
        line_height = 18
        reply_btn_y = text_y_offset + len(lines) * line_height + 4
        card_height = max(74, reply_btn_y + 18 + 16)

        # Create final image canvas
        card_width = 500
        canvas = Image.new("RGBA", (card_width, card_height), bg_color)
        draw = ImageDraw.Draw(canvas)

        # Draw Avatar
        avatar_size = 42
        avatar_x = 16
        avatar_y = 16
        avatar_img = None
        if avatar_input:
            try:
                if str(avatar_input).startswith("data:image/"):
                    import base64
                    header, encoded = str(avatar_input).split(",", 1)
                    avatar_data = base64.b64decode(encoded)
                    avatar_img = Image.open(io.BytesIO(avatar_data))
                else:
                    headers = {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                    }
                    res = requests.get(avatar_input, headers=headers, timeout=10)
                    avatar_img = Image.open(io.BytesIO(res.content))
            except Exception:
                pass

        if avatar_img:
            avatar_img = avatar_img.convert("RGBA").resize((avatar_size, avatar_size), Image.Resampling.LANCZOS)
            # Circular mask for avatar
            mask = Image.new("L", (avatar_size, avatar_size), 0)
            mask_draw = ImageDraw.Draw(mask)
            mask_draw.ellipse([0, 0, avatar_size, avatar_size], fill=255)
            
            rounded_avatar = Image.new("RGBA", (avatar_size, avatar_size), (0, 0, 0, 0))
            rounded_avatar.paste(avatar_img, (0, 0), mask=mask)
            canvas.paste(rounded_avatar, (avatar_x, avatar_y), rounded_avatar)
        else:
            # Draw initial initials avatar placeholder
            draw.ellipse([avatar_x, avatar_y, avatar_x + avatar_size, avatar_y + avatar_size], fill=(0, 149, 246, 255))
            initial = username[0].upper() if username else "?"
            init_bbox = draw.textbbox((0, 0), initial, font=font_username)
            init_w = init_bbox[2] - init_bbox[0]
            init_h = init_bbox[3] - init_bbox[1]
            draw.text((avatar_x + (avatar_size - init_w)//2, avatar_y + (avatar_size - init_h)//2 - 1), initial, fill=(255, 255, 255, 255), font=font_username)

        # Draw Username
        user_x = 70
        user_y = start_y
        draw.text((user_x, user_y), username, fill=text_primary, font=font_username)
        user_bbox = draw.textbbox((0, 0), username, font=font_username)
        user_w = user_bbox[2] - user_bbox[0]

        # Draw Verified Icon if enabled
        meta_x = user_x + user_w + 6
        if verified:
            # Blue Instagram verification check badge
            badge_size = 14
            badge_cy = user_y + 8
            # Draw a beautiful verified check badge using draw.ellipse & draw.line
            draw.ellipse([meta_x, badge_cy - 6, meta_x + badge_size, badge_cy + 8], fill=(0, 149, 246, 255))
            # Draw checkmark inside
            cx, cy = meta_x + 7, badge_cy + 1
            draw.line([(cx - 3, cy), (cx - 1, cy + 2), (cx + 3, cy - 2)], fill=(255, 255, 255, 255), width=2)
            meta_x += badge_size + 6

        # Draw time
        draw.text((meta_x, user_y), time_val, fill=text_secondary, font=font_meta)

        # Draw wrapped Comment Text
        for i, line_text in enumerate(lines):
            draw.text((user_x, text_y_offset + i * line_height), line_text, fill=text_primary, font=font_text)

        # Draw Reply button
        draw.text((user_x, reply_btn_y), "Reply", fill=text_secondary, font=font_meta)

        # Draw Heart (Likes area) on the far right
        heart_cx = card_width - 16 - 12
        heart_cy = start_y + 12
        
        heart_color = (239, 68, 68, 255) if liked else text_secondary
        draw_parametric_heart(draw, heart_cx, heart_cy, heart_color, filled=liked)

        # Draw Likes Count if specified
        if likes_val:
            likes_bbox = draw.textbbox((0, 0), likes_val, font=font_likes)
            likes_w = likes_bbox[2] - likes_bbox[0]
            draw.text((heart_cx - likes_w//2, heart_cy + 14), likes_val, fill=text_secondary, font=font_likes)

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
                "image": image_url,
                "username": username,
                "text": comment_text
            }
        }

    except Exception as e:
        return {"success": False, "error": f"Failed to generate Instagram comment: {str(e)}"}
