# -*- coding: utf-8 -*-
import os
import io
import time
import requests
import math
from PIL import Image, ImageDraw, ImageFont

ASSETS_DIR = os.path.join(os.path.dirname(__file__), "spotifycard_assets")
UGUU_URL = "https://uguu.se/upload.php"

FONT_BOLD_URL = "https://cdn.jsdelivr.net/gh/googlefonts/roboto/src/hinted/Roboto-Bold.ttf"
FONT_REGULAR_URL = "https://cdn.jsdelivr.net/gh/googlefonts/roboto/src/hinted/Roboto-Regular.ttf"
DEFAULT_COVER_URL = "https://i.imgur.com/zflNW7n.jpeg"
SPOTIFY_LOGO_URL = "https://i.imgur.com/FcHzSOC.png"

def _upload_to_uguu(binary: bytes) -> str:
    filename = f"spotifycard_{int(time.time())}.png"
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

def parse_color(color_str, default=(24, 24, 27, 255)):
    if not color_str:
        return default
    color_str = str(color_str).strip()
    
    # rgb/rgba
    rgb_match = re.match(r'^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d\.]+))?\s*\)$', color_str, re.IGNORECASE)
    if rgb_match:
        r, g, b = int(rgb_match.group(1)), int(rgb_match.group(2)), int(rgb_match.group(3))
        a = float(rgb_match.group(4)) if rgb_match.group(4) else 1.0
        return (r, g, b, int(a * 255))
        
    # hex
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

import re

from PIL import Image, ImageDraw, ImageFont, ImageFilter

def draw_star(draw, center, radius, color):
    cx, cy = center
    points = []
    for i in range(10):
        r = radius if i % 2 == 0 else radius * 0.4
        angle = i * math.pi / 5 - math.pi / 2
        x = cx + r * math.cos(angle)
        y = cy + r * math.sin(angle)
        points.append((x, y))
    draw.polygon(points, fill=color)

def generate_spotifycard(payload):
    try:
        title = str(payload.get("title") or "STAY HERE 4 LIFE").strip()
        artist = str(payload.get("artist") or "A$AP Rocky").strip()
        cover_input = payload.get("cover") or payload.get("image") or ""
        
        progress = float(payload.get("progress") or 40)
        progress = max(0.0, min(100.0, progress))
        
        current_time = str(payload.get("current_time") or "1:24").strip()
        duration = str(payload.get("duration") or "3:35").strip()
        status = str(payload.get("status") or "playing").strip().lower()
        theme = str(payload.get("theme") or "dark").strip().lower()

        # Canvas details (Tall mobile device aspect ratio)
        bgwidth = 540
        bgheight = 960
        
        card_width = 460
        card_height = 760
        card_x1 = (bgwidth - card_width) // 2
        card_y1 = (bgheight - card_height) // 2
        
        # Theme presets
        if theme == "light":
            default_bg = (244, 244, 245, 235) # zinc-100 semi-transparent
            default_title = (24, 24, 27, 255) # zinc-900
            default_artist = (113, 113, 122, 255) # zinc-500
            default_bar_bg = (212, 212, 216, 255) # zinc-300
            default_bar_fg = (24, 24, 27, 255) # zinc-900
        elif theme == "green":
            default_bg = (25, 20, 20, 235) # spotify black semi-transparent
            default_title = (255, 255, 255, 255)
            default_artist = (179, 179, 179, 255)
            default_bar_bg = (83, 83, 83, 255)
            default_bar_fg = (29, 185, 84, 255) # spotify green
        else: # dark
            default_bg = (18, 18, 18, 235) # solid black semi-transparent
            default_title = (255, 255, 255, 255)
            default_artist = (161, 161, 170, 255) # zinc-400
            default_bar_bg = (63, 63, 70, 255) # zinc-700
            default_bar_fg = (255, 255, 255, 255)

        bgcolor = parse_color(payload.get("bgcolor"), default_bg)
        titlecolor = parse_color(payload.get("titlecolor"), default_title)
        artistcolor = parse_color(payload.get("artistcolor"), default_artist)
        progresscolor = parse_color(payload.get("progresscolor"), default_bar_fg)

        # Ensure bgcolor has alpha channel for glassmorphism overlay
        card_bg = list(bgcolor) if isinstance(bgcolor, tuple) else [18, 18, 18, 235]
        if len(card_bg) == 3:
            card_bg.append(235)
        else:
            card_bg[3] = 235
        card_bg = tuple(card_bg)

        # Load / Cache cover image
        cover_size = 400
        cover_img = None
        if cover_input:
            try:
                if str(cover_input).startswith("data:image/"):
                    import base64
                    header, encoded = str(cover_input).split(",", 1)
                    cover_data = base64.b64decode(encoded)
                    cover_img = Image.open(io.BytesIO(cover_data))
                else:
                    res = requests.get(cover_input, timeout=10)
                    cover_img = Image.open(io.BytesIO(res.content))
            except Exception:
                pass
                
        if not cover_img:
            try:
                fallback_path = get_cached_file(DEFAULT_COVER_URL, "default_cover.jpg")
                cover_img = Image.open(fallback_path)
            except Exception:
                cover_img = Image.new("RGBA", (cover_size, cover_size), (29, 185, 84, 255))
                c_draw = ImageDraw.Draw(cover_img)
                c_draw.ellipse([80, 80, 320, 320], fill=(25, 20, 20, 255))

        cover_img = cover_img.convert("RGBA")

        # 1. Setup Canvas with blurred cover background
        bg_cover = cover_img.resize((bgwidth, bgheight), Image.Resampling.LANCZOS)
        bg_cover = bg_cover.filter(ImageFilter.GaussianBlur(radius=40))
        
        # Apply dark vignette/overlay to background
        overlay = Image.new("RGBA", bg_cover.size, (0, 0, 0, 110))
        bg_cover = Image.alpha_composite(bg_cover, overlay)

        # Create drawing context on final canvas
        draw = ImageDraw.Draw(bg_cover)

        # 2. Draw Spotify Card background (Glassmorphism overlay)
        draw.rounded_rectangle([card_x1, card_y1, card_x1 + card_width, card_y1 + card_height], radius=36, fill=card_bg)

        # Load Fonts
        font_bold_path = get_cached_file(FONT_BOLD_URL, "Roboto-Bold.ttf")
        font_reg_path = get_cached_file(FONT_REGULAR_URL, "Roboto-Regular.ttf")
        
        font_title = ImageFont.truetype(font_bold_path, 23)
        font_artist = ImageFont.truetype(font_reg_path, 16)
        font_label = ImageFont.truetype(font_reg_path, 11)
        font_time = ImageFont.truetype(font_reg_path, 12)

        # 3. Draw Album Cover inside card
        cover_x = card_x1 + 30
        cover_y = card_y1 + 30
        
        rounded_cover_src = cover_img.resize((cover_size, cover_size), Image.Resampling.LANCZOS)
        
        # Rounded mask for cover
        mask = Image.new("L", (cover_size, cover_size), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([0, 0, cover_size, cover_size], radius=20, fill=255)
        
        rounded_cover = Image.new("RGBA", (cover_size, cover_size), (0, 0, 0, 0))
        rounded_cover.paste(rounded_cover_src, (0, 0), mask=mask)
        
        # Paste Spotify logo from URL overlay on bottom-right of the cover image
        try:
            logo_path = get_cached_file(SPOTIFY_LOGO_URL, "spotify_logo_new.png")
            logo_img = Image.open(logo_path).convert("RGBA").resize((32, 32), Image.Resampling.LANCZOS)
            rounded_cover.paste(logo_img, (cover_size - 44, cover_size - 44), logo_img)
        except Exception:
            c_logo_draw = ImageDraw.Draw(rounded_cover)
            logo_cx, logo_cy = cover_size - 28, cover_size - 28
            logo_r = 16
            c_logo_draw.ellipse([logo_cx - logo_r, logo_cy - logo_r, logo_cx + logo_r, logo_cy + logo_r], fill=(29, 185, 84, 255))
            for offset in [-4, 0, 4]:
                c_logo_draw.arc([logo_cx - 8, logo_cy - 8 + offset, logo_cx + 8, logo_cy + 8 + offset], start=210, end=330, fill=(0, 0, 0, 255), width=2)
            
        bg_cover.paste(rounded_cover, (cover_x, cover_y), rounded_cover)

        # 4. Device Label ("iPhone" / "Spotify")
        label_text = "iPhone"
        label_y = card_y1 + 450
        label_x = cover_x
        draw.text((label_x, label_y), label_text, fill=artistcolor, font=font_label)

        # 5. Track Title
        title_y = card_y1 + 470
        title_bbox = draw.textbbox((0, 0), title, font=font_title)
        title_w = title_bbox[2] - title_bbox[0]
        
        # Explicit badge and casting icon alignment boundaries
        max_title_w = 340
        if title_w > max_title_w:
            while len(title) > 3 and title_w > (max_title_w - 20):
                title = title[:-1]
                title_bbox = draw.textbbox((0, 0), title + "...", font=font_title)
                title_w = title_bbox[2] - title_bbox[0]
            title = title + "..."
            
        draw.text((cover_x, title_y), title, fill=titlecolor, font=font_title)

        # Explicit Badge ("E")
        badge_x = cover_x + title_w + 8
        badge_y = title_y + 6
        draw.rounded_rectangle([badge_x, badge_y, badge_x + 16, badge_y + 14], radius=2, fill=(113, 113, 122, 255))
        draw.text((badge_x + 4, badge_y), "E", fill=(255, 255, 255, 255), font=font_label)

        # Device Cast Icon on the right side of the Title
        cast_x = card_x1 + card_width - 50
        cast_y = title_y + 5
        # Draw cast icon: outline box and waves in bottom-left
        draw.rectangle([cast_x + 2, cast_y + 2, cast_x + 18, cast_y + 14], outline=titlecolor, width=2)
        draw.arc([cast_x, cast_y + 8, cast_x + 8, cast_y + 16], start=270, end=360, fill=titlecolor, width=2)

        # 6. Artist Name
        artist_y = card_y1 + 508
        artist_bbox = draw.textbbox((0, 0), artist, font=font_artist)
        artist_w = artist_bbox[2] - artist_bbox[0]
        if artist_w > 400:
            while len(artist) > 3 and artist_w > 380:
                artist = artist[:-1]
                artist_bbox = draw.textbbox((0, 0), artist + "...", font=font_artist)
                artist_w = artist_bbox[2] - artist_bbox[0]
            artist = artist + "..."
        draw.text((cover_x, artist_y), artist, fill=artistcolor, font=font_artist)

        # 7. Progress Bar Row
        bar_x = cover_x
        bar_y = card_y1 + 555
        bar_w = cover_size
        bar_h = 4
        
        # Background track
        draw.rounded_rectangle([bar_x, bar_y, bar_x + bar_w, bar_y + bar_h], radius=2, fill=default_bar_bg)
        
        # Filled track
        fill_w = int(bar_w * (progress / 100.0))
        if fill_w > 0:
            draw.rounded_rectangle([bar_x, bar_y, bar_x + fill_w, bar_y + bar_h], radius=2, fill=progresscolor)
            # Circular progress handle
            draw.ellipse([bar_x + fill_w - 6, bar_y + bar_h//2 - 6, bar_x + fill_w + 6, bar_y + bar_h//2 + 6], fill=(255, 255, 255, 255))

        # Timestamps
        time_y = card_y1 + 570
        draw.text((bar_x, time_y), current_time, fill=artistcolor, font=font_time)
        
        duration_bbox = draw.textbbox((0, 0), duration, font=font_time)
        duration_w = duration_bbox[2] - duration_bbox[0]
        draw.text((bar_x + bar_w - duration_w, time_y), duration, fill=artistcolor, font=font_time)

        # 8. Playback Controls Row (Sleek Spotify glyphs directly on card)
        control_y = card_y1 + 630
        
        # Previous button (double triangle pointing left + vertical line)
        prev_cx = card_x1 + 130
        prev_cy = control_y
        draw.polygon([(prev_cx + 10, prev_cy - 10), (prev_cx + 10, prev_cy + 10), (prev_cx + 0, prev_cy)], fill=titlecolor)
        draw.polygon([(prev_cx + 0, prev_cy - 10), (prev_cx + 0, prev_cy + 10), (prev_cx - 10, prev_cy)], fill=titlecolor)
        draw.rectangle([prev_cx - 14, prev_cy - 10, prev_cx - 11, prev_cy + 10], fill=titlecolor)

        # Play/Pause button
        play_cx = card_x1 + 230
        play_cy = control_y
        
        if status == "playing":
            # Pause icon: two vertical bars
            draw.rectangle([play_cx - 7, play_cy - 14, play_cx - 2, play_cy + 14], fill=titlecolor)
            draw.rectangle([play_cx + 2, play_cy - 14, play_cx + 7, play_cy + 14], fill=titlecolor)
        else:
            # Play icon: triangle pointing right
            draw.polygon([(play_cx - 8, play_cy - 14), (play_cx - 8, play_cy + 14), (play_cx + 12, play_cy)], fill=titlecolor)

        # Next button (double triangle pointing right + vertical line)
        next_cx = card_x1 + 330
        next_cy = control_y
        draw.polygon([(next_cx - 10, next_cy - 10), (next_cx - 10, next_cy + 10), (next_cx - 0, next_cy)], fill=titlecolor)
        draw.polygon([(next_cx - 0, next_cy - 10), (next_cx - 0, next_cy + 10), (next_cx + 10, next_cy)], fill=titlecolor)
        draw.rectangle([next_cx + 11, next_cy - 10, next_cx + 14, next_cy + 10], fill=titlecolor)

        # 9. Volume Slider Row
        volume_y = card_y1 + 700
        volume_w = 260
        volume_x = card_x1 + (card_width - volume_w) // 2
        volume_h = 4
        
        # Mute Icon (Left)
        mute_x = volume_x - 30
        mute_y = volume_y - 4
        draw.polygon([(mute_x + 2, mute_y + 4), (mute_x + 6, mute_y + 4), (mute_x + 10, mute_y + 1), (mute_x + 10, mute_y + 9), (mute_x + 2, mute_y + 6)], fill=artistcolor)
        
        # Volume Up Icon (Right)
        volup_x = volume_x + volume_w + 14
        volup_y = volume_y - 4
        draw.polygon([(volup_x + 2, volup_y + 4), (volup_x + 6, volup_y + 4), (volup_x + 10, volup_y + 1), (volup_x + 10, volup_y + 9), (volup_x + 2, volup_y + 6)], fill=artistcolor)
        draw.arc([volup_x + 6, volup_y + 2, volup_x + 14, volup_y + 8], start=270, end=90, fill=artistcolor, width=1)

        # Volume Track background
        draw.rounded_rectangle([volume_x, volume_y, volume_x + volume_w, volume_y + volume_h], radius=2, fill=default_bar_bg)
        # Volume fill (70%)
        vol_fill_w = int(volume_w * 0.7)
        draw.rounded_rectangle([volume_x, volume_y, volume_x + vol_fill_w, volume_y + volume_h], radius=2, fill=progresscolor)
        # Circular volume handle
        draw.ellipse([volume_x + vol_fill_w - 6, volume_y + volume_h//2 - 6, volume_x + vol_fill_w + 6, volume_y + volume_h//2 + 6], fill=(255, 255, 255, 255))

        # Output PNG
        img_byte_arr = io.BytesIO()
        bg_cover.save(img_byte_arr, format="PNG")
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
                "title": title,
                "artist": artist
            }
        }

    except Exception as e:
        return {"success": False, "error": f"Failed to generate Spotify card: {str(e)}"}
