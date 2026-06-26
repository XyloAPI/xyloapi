# -*- coding: utf-8 -*-
import os
import io
import time
import requests
import datetime
from PIL import Image, ImageDraw, ImageFont

ASSETS_DIR = os.path.join(os.path.dirname(__file__), "faketweet_assets")
UGUU_URL = "https://uguu.se/upload.php"

DEFAULT_AVATAR = "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
FONT_REGULAR_URL = "https://cdn.jsdelivr.net/gh/googlefonts/roboto/src/hinted/Roboto-Regular.ttf"
FONT_BOLD_URL = "https://cdn.jsdelivr.net/gh/googlefonts/roboto/src/hinted/Roboto-Bold.ttf"

def _upload_to_uguu(binary: bytes) -> str:
    filename = f"faketweet_{int(time.time())}.png"
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

def _parse_bool(val, default=True):
    if val is None:
        return default
    if isinstance(val, bool):
        return val
    s = str(val).strip().lower()
    if s in ("true", "1", "yes", "on"):
        return True
    if s in ("false", "0", "no", "off"):
        return False
    return default

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
        return Image.new("RGBA", (400, 400), (200, 200, 200, 255))

def generate_faketweet(payload):
    try:
        name = str(payload.get("name") or "Twitter").strip()
        username = str(payload.get("username") or "twitter").strip()
        avatar_url = str(payload.get("avatar") or DEFAULT_AVATAR).strip()
        text = str(payload.get("text") or "This is a fake tweet").strip()
        
        verified = _parse_bool(payload.get("verified"), True)
        locked = _parse_bool(payload.get("locked"), False)
        
        theme = str(payload.get("theme") or "light").strip().lower()
        retweets = str(payload.get("retweets") or "32K").strip()
        quotes = str(payload.get("quotes") or "100").strip()
        likes = str(payload.get("likes") or "12.7K").strip()
        
        now = datetime.datetime.now()
        date_str = str(payload.get("date") or now.strftime("%b %d, %Y")).strip()
        time_str = str(payload.get("time") or now.strftime("%I:%M %p")).strip()
        device_str = str(payload.get("device") or payload.get("app") or "Twitter for iPhone").strip()

        # Download font assets
        font_reg_path = get_cached_file(FONT_REGULAR_URL, "Roboto-Regular.ttf")
        font_bold_path = get_cached_file(FONT_BOLD_URL, "Roboto-Bold.ttf")

        # Handle @ prefix for username
        if not username.startswith("@"):
            username = "@" + username

        # Theme styling
        if theme == "dark":
            bg_color = (0, 0, 0, 255)
            text_color = (255, 255, 255, 255)
            gray_text_color = (136, 153, 166, 255)
            border_color = (56, 68, 77, 255)
        else:
            bg_color = (255, 255, 255, 255)
            text_color = (20, 23, 26, 255)
            gray_text_color = (101, 119, 134, 255)
            border_color = (230, 236, 240, 255)

        # Setup fonts
        font_name = ImageFont.truetype(font_bold_path, 20)
        font_handle = ImageFont.truetype(font_reg_path, 16)
        font_tweet = ImageFont.truetype(font_reg_path, 22)
        font_meta = ImageFont.truetype(font_reg_path, 15)
        font_stats_bold = ImageFont.truetype(font_bold_path, 16)
        font_stats_label = ImageFont.truetype(font_reg_path, 16)
        font_verified = ImageFont.truetype(font_bold_path, 14)

        # Line wrap text
        max_text_width = 752
        lines = []
        words = text.split(" ")
        current_line = []
        
        temp_img = Image.new("RGBA", (100, 100))
        temp_draw = ImageDraw.Draw(temp_img)
        
        for word in words:
            if "\n" in word:
                parts = word.split("\n")
                for i, part in enumerate(parts):
                    test_line = " ".join(current_line + [part])
                    bbox = temp_draw.textbbox((0, 0), test_line, font=font_tweet)
                    w = bbox[2] - bbox[0]
                    if w > max_text_width:
                        lines.append(" ".join(current_line))
                        current_line = [part]
                    else:
                        current_line.append(part)
                    if i < len(parts) - 1:
                        lines.append(" ".join(current_line))
                        current_line = []
            else:
                test_line = " ".join(current_line + [word])
                bbox = temp_draw.textbbox((0, 0), test_line, font=font_tweet)
                w = bbox[2] - bbox[0]
                if w > max_text_width:
                    lines.append(" ".join(current_line))
                    current_line = [word]
                else:
                    current_line.append(word)
        if current_line:
            lines.append(" ".join(current_line))

        line_height = 28
        tweet_text_height = len(lines) * line_height
        
        avatar_size = 60
        top_padding = 24
        header_height = top_padding + avatar_size
        
        tweet_start_y = header_height + 16
        meta_start_y = tweet_start_y + tweet_text_height + 20
        divider1_y = meta_start_y + 24 + 6
        stats_start_y = divider1_y + 12
        divider2_y = stats_start_y + 24 + 6
        total_height = divider2_y + 16
        
        card = Image.new("RGBA", (800, total_height), bg_color)
        draw = ImageDraw.Draw(card)

        # Draw Avatar
        avatar_img = download_image_to_memory(avatar_url, DEFAULT_AVATAR)
        avatar_cropped = avatar_img.convert("RGBA").resize((avatar_size, avatar_size), Image.Resampling.LANCZOS)
        mask = Image.new("L", (avatar_size, avatar_size), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.ellipse((0, 0, avatar_size, avatar_size), fill=255)
        card.paste(avatar_cropped, (24, top_padding), mask=mask)

        # Draw Name
        draw.text((96, 30), name, fill=text_color, font=font_name)
        
        # Draw Badges (Verified / Locked)
        name_bbox = draw.textbbox((96, 30), name, font=font_name)
        name_width = name_bbox[2] - name_bbox[0]
        badge_x = 96 + name_width + 8
        badge_y = 32
        
        if verified:
            badge_size = 18
            draw.ellipse([badge_x, badge_y, badge_x + badge_size, badge_y + badge_size], fill="#1da1f2")
            draw.text((badge_x + 9, badge_y + 8), "✓", font=font_verified, fill="#ffffff", anchor="mm")
            badge_x += badge_size + 8
            
        if locked:
            # Draw Lock Icon
            draw.arc((badge_x + 1, badge_y + 1, badge_x + 9, badge_y + 9), 180, 360, fill=text_color, width=2)
            draw.rectangle((badge_x, badge_y + 5, badge_x + 10, badge_y + 12), fill=text_color)

        # Draw Handle
        draw.text((96, 56), username, fill=gray_text_color, font=font_handle)

        # Draw Tweet text
        y_cursor = tweet_start_y
        for line in lines:
            draw.text((24, y_cursor), line, fill=text_color, font=font_tweet)
            y_cursor += line_height

        # Draw metadata (Time, Date, Device)
        meta_text = f"{time_str} · {date_str} · {device_str}"
        draw.text((24, meta_start_y), meta_text, fill=gray_text_color, font=font_meta)

        # Draw Divider 1
        draw.line([(24, divider1_y), (800 - 24, divider1_y)], fill=border_color, width=1)

        # Draw Stats Bar
        stats_x = 24
        
        # Retweets
        draw.text((stats_x, stats_start_y), retweets, fill=text_color, font=font_stats_bold)
        rt_val_bbox = draw.textbbox((stats_x, stats_start_y), retweets, font=font_stats_bold)
        stats_x += (rt_val_bbox[2] - rt_val_bbox[0]) + 6
        
        draw.text((stats_x, stats_start_y), "Retweets", fill=gray_text_color, font=font_stats_label)
        rt_lbl_bbox = draw.textbbox((stats_x, stats_start_y), "Retweets", font=font_stats_label)
        stats_x += (rt_lbl_bbox[2] - rt_lbl_bbox[0]) + 20
        
        # Quotes
        draw.text((stats_x, stats_start_y), quotes, fill=text_color, font=font_stats_bold)
        q_val_bbox = draw.textbbox((stats_x, stats_start_y), quotes, font=font_stats_bold)
        stats_x += (q_val_bbox[2] - q_val_bbox[0]) + 6
        
        draw.text((stats_x, stats_start_y), "Quotes", fill=gray_text_color, font=font_stats_label)
        q_lbl_bbox = draw.textbbox((stats_x, stats_start_y), "Quotes", font=font_stats_label)
        stats_x += (q_lbl_bbox[2] - q_lbl_bbox[0]) + 20

        # Likes
        draw.text((stats_x, stats_start_y), likes, fill=text_color, font=font_stats_bold)
        lk_val_bbox = draw.textbbox((stats_x, stats_start_y), likes, font=font_stats_bold)
        stats_x += (lk_val_bbox[2] - lk_val_bbox[0]) + 6
        
        draw.text((stats_x, stats_start_y), "Likes", fill=gray_text_color, font=font_stats_label)

        # Draw Divider 2
        draw.line([(24, divider2_y), (800 - 24, divider2_y)], fill=border_color, width=1)

        # Save to PNG and upload
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
                "name": name,
                "username": username,
                "text": text,
                "theme": theme
            }
        }

    except Exception as e:
        return {"success": False, "error": f"Failed to generate fake tweet image: {str(e)}"}
