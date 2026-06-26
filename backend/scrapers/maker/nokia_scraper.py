import os
import requests
import io
import time
import unicodedata
from PIL import Image, ImageDraw, ImageFont

BG_URL = "https://i.8upload.com/image/d719de9c5a53030b/file-00000000a9f47208a295c9c984f92b7a.jpg"
FONT_URL = "https://cdn.jsdelivr.net/gh/Ditzzx-vibecoder/Assets/Font/nokia-6000-series-medium.ttf"
ASSETS_DIR = os.path.join(os.path.dirname(__file__), "nokia_assets")
UGUU_URL = "https://uguu.se/upload.php"

def _upload_to_uguu(binary: bytes) -> str:
    filename = f"nokia_{int(time.time())}.png"
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
        res = requests.get(url, timeout=30)
        res.raise_for_status()
        with open(file_path, "wb") as f:
            f.write(res.content)
    return file_path

_emoji_map = None

def get_twemoji(cluster):
    global _emoji_map
    import json
    
    if _emoji_map is None:
        try:
            map_url = "https://cdn.jsdelivr.net/gh/ZacharyCrespin/fluentui-emoji-js/emojiData.json"
            map_path = get_cached_file(map_url, "fluent_emoji_data.json")
            with open(map_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            _emoji_map = {}
            for entry in data:
                glyph = entry.get("glyph")
                folder = entry.get("folder")
                images = entry.get("images", {})
                threed = images.get("3D")
                if glyph and folder and threed:
                    clean_folder = folder.lstrip("/")
                    filename = threed[0]
                    url_folder = clean_folder.replace(" ", "%20")
                    url_filename = filename.replace(" ", "%20")
                    url = f"https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@latest/assets/{url_folder}/3D/{url_filename}"
                    _emoji_map[glyph] = (url, f"fluent_{filename}")
        except Exception:
            _emoji_map = {}
            
    url = None
    filename = None
    if cluster in _emoji_map:
        url, filename = _emoji_map[cluster]
    else:
        clean_cluster = cluster.replace("\ufe0f", "").replace("\ufe0e", "")
        if clean_cluster in _emoji_map:
            url, filename = _emoji_map[clean_cluster]

    if not url:
        codepoints = [f"{ord(c):x}" for c in cluster if ord(c) != 0xfe0f]
        hex_code = "-".join(codepoints)
        url = f"https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/{hex_code}.png"
        filename = f"apple_emoji_{hex_code}.png"

    try:
        path = get_cached_file(url, filename)
        return Image.open(path).convert("RGBA")
    except Exception:
        return None

def is_emoji(char):
    codepoint = ord(char)
    if codepoint < 128:
        return False
    cat = unicodedata.category(char)
    if cat in ('So', 'Cn'):
        return True
    if 0x2000 <= codepoint <= 0x32FF:
        return True
    if 0x1F000 <= codepoint <= 0x1FBF8:
        return True
    return False

def split_text_and_emojis(text):
    segments = []
    n = len(text)
    i = 0
    current_text = []
    
    while i < n:
        char = text[i]
        if is_emoji(char):
            if current_text:
                segments.append({'type': 'text', 'value': ''.join(current_text)})
                current_text = []
            
            cluster = [char]
            i += 1
            while i < n:
                next_char = text[i]
                code = ord(next_char)
                is_modifier = (0x1F3FB <= code <= 0x1F3FF)
                is_vs = (next_char in ('\ufe0e', '\ufe0f'))
                is_zwj = (next_char == '\u200d')
                last_was_zwj = (cluster[-1] == '\u200d')
                
                if is_modifier or is_vs or is_zwj or last_was_zwj or is_emoji(next_char):
                    cluster.append(next_char)
                    i += 1
                else:
                    break
            segments.append({'type': 'emoji', 'value': ''.join(cluster)})
        else:
            current_text.append(char)
            i += 1
            
    if current_text:
        segments.append({'type': 'text', 'value': ''.join(current_text)})
    return segments

def get_segment_width(seg, font, font_size):
    if seg['type'] == 'text':
        try:
            return font.getbbox(seg['value'])[2]
        except Exception:
            try:
                return font.getsize(seg['value'])[0]
            except Exception:
                return len(seg['value']) * int(font_size * 0.6)
    else:
        return font_size

def measure_line(segments, font, font_size):
    return sum(get_segment_width(seg, font, font_size) for seg in segments)

def wrap_text_with_emojis(text, font, font_size, max_width):
    words = text.split(" ")
    lines = []
    current_line = []
    
    for word in words:
        test_line = current_line + [word]
        test_str = " ".join(test_line)
        test_segs = split_text_and_emojis(test_str)
        w = measure_line(test_segs, font, font_size)
        if w > max_width and current_line:
            lines.append(" ".join(current_line))
            current_line = [word]
        else:
            current_line = test_line
            
    if current_line:
        lines.append(" ".join(current_line))
    return lines

def generate_nokia(payload):
    try:
        header = payload.get("header") or payload.get("headerText") or "Nokia"
        message = payload.get("message") or payload.get("messageText") or payload.get("text") or ""
        if isinstance(message, list):
            message = message[0] if message else ""
        if not message:
            return {"success": False, "error": "Missing required parameter: message / text"}

        sender = payload.get("sender") or "Nokia"
        date = payload.get("date") or time.strftime("%d/%m/%Y")
        time_val = payload.get("time") or time.strftime("%H:%M")

        # Download assets dynamically (self-healing)
        bg_path = get_cached_file(BG_URL, "nokia_bg.jpg")
        font_path = get_cached_file(FONT_URL, "nokia.ttf")

        # Load background
        background = Image.open(bg_path).convert("RGBA")
        draw = ImageDraw.Draw(background)

        # 1. DRAW HEADER
        font_header = ImageFont.truetype(font_path, 130)
        for i in range(5):
            draw.text((543 + i, 200), header, fill=(232, 240, 240, 255), font=font_header, anchor="mm")

        # 2. DRAW MESSAGE BODY WITH SCALING
        padding = 60
        text_x = padding
        text_y = 320
        max_w = 1086 - (padding * 2)
        max_h = 980 - text_y - 20
        scale_y = 1.3

        paragraphs = message.split("\n")
        current_font_size = 63
        wrapped_lines = []

        # Dynamic Font Fit
        while current_font_size > 10:
            font_msg = ImageFont.truetype(font_path, current_font_size)
            current_line_height = current_font_size * (110 / 63)
            wrapped_lines = []
            for p in paragraphs:
                wrapped_lines.extend(wrap_text_with_emojis(p, font_msg, current_font_size, max_w))
            if len(wrapped_lines) * current_line_height <= max_h:
                break
            current_font_size -= 1

        active_line_height = current_font_size * (110 / 63)
        font_msg = ImageFont.truetype(font_path, current_font_size)

        for i, line in enumerate(wrapped_lines):
            line_str = line.strip()
            if not line_str:
                continue
                
            segs = split_text_and_emojis(line_str)
            w_line = int(measure_line(segs, font_msg, current_font_size))
            
            try:
                bbox = font_msg.getbbox("Tj")
                h_line = bbox[3] - bbox[1]
                offset_y = bbox[1]
            except Exception:
                h_line = current_font_size
                offset_y = 0

            w_line = max(1, w_line)
            h_line = max(1, h_line)

            # Create transparent canvas for the line
            line_img = Image.new("RGBA", (w_line, h_line + offset_y), (0, 0, 0, 0))
            line_draw = ImageDraw.Draw(line_img)
            
            curr_x = 0
            for seg in segs:
                if seg['type'] == 'text':
                    line_draw.text((curr_x, 0), seg['value'], fill=(0, 0, 0, 255), font=font_msg)
                    curr_x += int(get_segment_width(seg, font_msg, current_font_size))
                else:
                    emoji_img = get_twemoji(seg['value'])
                    if emoji_img:
                        emoji_sz = current_font_size
                        emoji_resized = emoji_img.resize((emoji_sz, emoji_sz), Image.Resampling.LANCZOS)
                        v_offset = int((h_line + offset_y - emoji_sz) / 2)
                        line_img.paste(emoji_resized, (curr_x, v_offset), emoji_resized)
                    curr_x += current_font_size

            # Stretch line vertically
            h_stretched = int((h_line + offset_y) * scale_y)
            line_stretched = line_img.resize((w_line, h_stretched), Image.Resampling.LANCZOS)

            ly = int(text_y + (i * active_line_height))
            background.paste(line_stretched, (text_x, ly), line_stretched)

        # 3. DRAW INFO BLOCK (Dari, Tanggal, Jam)
        info_lines = ["Dari:", sender, date, time_val]
        font_info = ImageFont.truetype(font_path, 48)

        for i, line in enumerate(info_lines):
            line_str = line.strip()
            segs = split_text_and_emojis(line_str)
            w_line = int(measure_line(segs, font_info, 48))
            
            try:
                bbox = font_info.getbbox("Tj")
                h_line = bbox[3] - bbox[1]
                offset_y = bbox[1]
            except Exception:
                h_line = 48
                offset_y = 0

            w_line = max(1, w_line)
            h_line = max(1, h_line)

            line_img = Image.new("RGBA", (w_line, h_line + offset_y), (0, 0, 0, 0))
            line_draw = ImageDraw.Draw(line_img)
            
            curr_x = 0
            for seg in segs:
                if seg['type'] == 'text':
                    line_draw.text((curr_x, 0), seg['value'], fill=(0, 0, 0, 255), font=font_info)
                    curr_x += int(get_segment_width(seg, font_info, 48))
                else:
                    emoji_img = get_twemoji(seg['value'])
                    if emoji_img:
                        emoji_resized = emoji_img.resize((48, 48), Image.Resampling.LANCZOS)
                        v_offset = int((h_line + offset_y - 48) / 2)
                        line_img.paste(emoji_resized, (curr_x, v_offset), emoji_resized)
                    curr_x += 48

            # Stretch vertically by 1.3
            h_stretched = int((h_line + offset_y) * 1.3)
            line_stretched = line_img.resize((w_line, h_stretched), Image.Resampling.LANCZOS)

            info_y = int(980 + (i * 80))
            background.paste(line_stretched, (text_x, info_y), line_stretched)

        # Convert to bytes and upload
        out_buf = io.BytesIO()
        background.save(out_buf, format="PNG")
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
                "header": header,
                "message": message,
                "sender": sender,
                "date": date,
                "time": time_val
            }
        }

    except Exception as e:
        return {"success": False, "error": f"Failed to generate Nokia fake message: {str(e)}"}
