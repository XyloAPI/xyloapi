# -*- coding: utf-8 -*-
import os
import io
import time
import requests
from PIL import Image, ImageDraw, ImageFont

ASSETS_DIR = os.path.join(os.path.dirname(__file__), "fakedm_assets")
UGUU_URL = "https://uguu.se/upload.php"

FONT_BOLD_URL = "https://cdn.jsdelivr.net/gh/googlefonts/roboto/src/hinted/Roboto-Bold.ttf"
FONT_REGULAR_URL = "https://cdn.jsdelivr.net/gh/googlefonts/roboto/src/hinted/Roboto-Regular.ttf"

def _upload_to_uguu(binary: bytes) -> str:
    filename = f"fakedm_{int(time.time())}.png"
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

def draw_camera_icon(draw, cx, cy, color):
    # Camera body rounded rectangle
    draw.rounded_rectangle([cx - 11, cy - 6, cx + 11, cy + 8], radius=2, outline=color, width=2)
    # Camera lens circle
    draw.ellipse([cx - 4, cy - 2, cx + 4, cy + 6], outline=color, width=2)
    # Camera top flash bump
    draw.rounded_rectangle([cx - 6, cy - 9, cx - 1, cy - 6], radius=1, outline=color, width=2)

def generate_fakedm(payload):
    try:
        username = str(payload.get("username") or "username").strip()
        avatar_input = payload.get("avatar") or ""
        verified = str(payload.get("verified") or "false").strip().lower() in ["true", "1", "yes"]
        online = str(payload.get("online") or "true").strip().lower() in ["true", "1", "yes"]
        dm_text = str(payload.get("dmText") or payload.get("text") or "Sent you a message").strip()
        time_val = str(payload.get("time") or "1m").strip()
        unread = str(payload.get("unread") or "false").strip().lower() in ["true", "1", "yes"]
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
        
        font_username = ImageFont.truetype(font_bold_path, 15)
        font_message = ImageFont.truetype(font_bold_path if unread else font_reg_path, 14)
        font_meta = ImageFont.truetype(font_reg_path, 13)

        # Create final image canvas (Fixed size of 500x80 for DM list card)
        card_width = 500
        card_height = 80
        canvas = Image.new("RGBA", (card_width, card_height), bg_color)
        draw = ImageDraw.Draw(canvas)

        # Draw Avatar
        avatar_size = 56
        avatar_x = 16
        avatar_y = 12
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

        # Draw Online green dot at bottom-right of avatar if online
        if online:
            dot_cx, dot_cy = avatar_x + avatar_size - 7, avatar_y + avatar_size - 7
            # Draw overlay background border
            draw.ellipse([dot_cx - 9, dot_cy - 9, dot_cx + 9, dot_cy + 9], fill=bg_color)
            # Draw green dot
            draw.ellipse([dot_cx - 6, dot_cy - 6, dot_cx + 6, dot_cy + 6], fill=(61, 184, 67, 255))

        # Draw Username
        user_x = 88
        user_y = 20
        draw.text((user_x, user_y), username, fill=text_primary, font=font_username)
        user_bbox = draw.textbbox((0, 0), username, font=font_username)
        user_w = user_bbox[2] - user_bbox[0]

        # Draw Verified Icon if enabled
        meta_x = user_x + user_w + 6
        if verified:
            badge_size = 14
            badge_cy = user_y + 8
            draw.ellipse([meta_x, badge_cy - 6, meta_x + badge_size, badge_cy + 8], fill=(0, 149, 246, 255))
            cx, cy = meta_x + 7, badge_cy + 1
            draw.line([(cx - 3, cy), (cx - 1, cy + 2), (cx + 3, cy - 2)], fill=(255, 255, 255, 255), width=2)

        # Truncate DM message if it is too long
        max_msg_width = 240
        msg_color = text_primary if unread else text_secondary
        
        msg_bbox = draw.textbbox((0, 0), dm_text, font=font_message)
        msg_w = msg_bbox[2] - msg_bbox[0]
        if msg_w > max_msg_width:
            while len(dm_text) > 3 and msg_w > (max_msg_width - 15):
                dm_text = dm_text[:-1]
                msg_bbox = draw.textbbox((0, 0), dm_text + "...", font=font_message)
                msg_w = msg_bbox[2] - msg_bbox[0]
            dm_text = dm_text + "..."

        # Draw message text, separator, and time
        sub_y = 42
        draw.text((user_x, sub_y), dm_text, fill=msg_color, font=font_message)
        
        next_x = user_x + msg_w + 6
        if dm_text:
            draw.text((next_x, sub_y), "·", fill=text_secondary, font=font_meta)
            next_x += 10
            
        draw.text((next_x, sub_y), time_val, fill=text_secondary, font=font_meta)

        # Draw Camera icon on right
        cam_cx = card_width - 16 - 12
        cam_cy = card_height // 2
        draw_camera_icon(draw, cam_cx, cam_cy, text_primary)

        # Draw unread dot on left of camera if unread
        if unread:
            dot_x = cam_cx - 28
            dot_y = cam_cy - 5
            draw.ellipse([dot_x, dot_y, dot_x + 10, dot_y + 10], fill=(0, 149, 246, 255))

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
                "text": dm_text
            }
        }

    except Exception as e:
        return {"success": False, "error": f"Failed to generate Instagram DM: {str(e)}"}
