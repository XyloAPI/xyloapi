# -*- coding: utf-8 -*-
import os
import io
import time
import requests
import tempfile
import re
import unicodedata
import base64

EMOJIS_JS_URL = "https://tikolu.net/emojimix/emojis.js"
UGUU_URL = "https://uguu.se/upload.php"

def _upload_to_uguu(binary: bytes) -> str:
    filename = f"emojimix_{int(time.time())}.png"
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
    temp_dir = tempfile.gettempdir()
    file_path = os.path.join(temp_dir, filename)
    if not os.path.exists(file_path):
        res = requests.get(url, timeout=30)
        res.raise_for_status()
        with open(file_path, "wb") as f:
            f.write(res.content)
    return file_path

_emojis_db = None

def load_emojis_db():
    global _emojis_db
    if _emojis_db is not None:
        return _emojis_db
    try:
        path = get_cached_file(EMOJIS_JS_URL, "emojimix_database.js")
        with open(path, "r", encoding="utf-8") as f:
            text = f.read()
        pattern = r'\[\s*\[([\d\s,]+)\]\s*,\s*"([^"]+)"'
        matches = re.findall(pattern, text)
        _emojis_db = []
        for cp_str, date in matches:
            cps = tuple(int(x.strip()) for x in cp_str.split(",") if x.strip())
            _emojis_db.append((cps, date))
    except Exception:
        _emojis_db = []
    return _emojis_db

def is_emoji_char(char):
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

def extract_emojis(text):
    emojis_found = []
    n = len(text)
    i = 0
    while i < n:
        char = text[i]
        if is_emoji_char(char):
            cluster = [char]
            i += 1
            while i < n:
                next_char = text[i]
                code = ord(next_char)
                is_modifier = (0x1F3FB <= code <= 0x1F3FF)
                is_vs = (next_char in ('\ufe0e', '\ufe0f'))
                is_zwj = (next_char == '\u200d')
                
                if is_modifier or is_vs:
                    cluster.append(next_char)
                    i += 1
                elif is_zwj:
                    cluster.append(next_char)
                    i += 1
                    if i < n and is_emoji_char(text[i]):
                        cluster.append(text[i])
                        i += 1
                else:
                    break
            emojis_found.append(''.join(cluster))
        else:
            i += 1
    return emojis_found

def find_emoji_entry(emoji_str):
    db = load_emojis_db()
    raw_cps = tuple(ord(c) for c in emoji_str)
    
    # 1. Exact match
    for cps, date in db:
        if cps == raw_cps:
            return cps, date
            
    # 2. Try match without 65039 (fe0f)
    clean_cps = tuple(c for c in raw_cps if c != 65039)
    for cps, date in db:
        clean_db_cps = tuple(c for c in cps if c != 65039)
        if clean_db_cps == clean_cps:
            return cps, date
            
    # 3. Try matching by first codepoint only
    if clean_cps:
        first_cp = clean_cps[0]
        for cps, date in db:
            clean_db_cps = tuple(c for c in cps if c != 65039)
            if clean_db_cps and clean_db_cps[0] == first_cp:
                return cps, date
                
    return None

def generate_emojimix(payload):
    try:
        # Get emojis from payload
        emoji1 = payload.get("emoji1")
        emoji2 = payload.get("emoji2")
        
        if isinstance(emoji1, list):
            emoji1 = emoji1[0] if emoji1 else None
        if isinstance(emoji2, list):
            emoji2 = emoji2[0] if emoji2 else None

        if isinstance(emoji1, str):
            emoji1 = emoji1.strip()
        if isinstance(emoji2, str):
            emoji2 = emoji2.strip()

        # Ignore placeholder parameters (e.g. starting with :)
        if emoji1 and (emoji1.startswith(":") or emoji1 == ""):
            emoji1 = None
        if emoji2 and (emoji2.startswith(":") or emoji2 == ""):
            emoji2 = None

        # If not supplied separately, try parsing from a single text/prompt parameter
        if not emoji1 or not emoji2:
            text = payload.get("text") or payload.get("prompt") or payload.get("message") or ""
            if isinstance(text, list):
                text = text[0] if text else ""
            
            if isinstance(text, str):
                text = text.strip()
                # Ignore placeholders in text too
                if text.startswith(":"):
                    text = ""
            
            # Extract emojis from the string
            emojis = extract_emojis(text)
            if len(emojis) >= 2:
                emoji1 = emojis[0]
                emoji2 = emojis[1]
            elif len(emojis) == 1:
                emoji1 = emojis[0]
                emoji2 = emojis[0]
            else:
                return {"success": False, "error": "Could not extract at least one emoji from the input text"}

        # Find entries in database
        entry1 = find_emoji_entry(emoji1)
        entry2 = find_emoji_entry(emoji2)
        
        if not entry1 or not entry2:
            return {"success": False, "error": f"One or both emojis are not supported by the Google Emoji Kitchen compatibility list. (Emoji1: {repr(emoji1)}, Emoji2: {repr(emoji2)})"}
            
        cps1, date1 = entry1
        cps2, date2 = entry2
        
        u1 = "-".join(f"u{c:x}" for c in cps1)
        u2 = "-".join(f"u{c:x}" for c in cps2)
        
        # Try both URL combinations
        url1 = f"https://www.gstatic.com/android/keyboard/emojikitchen/{date1}/{u1}/{u1}_{u2}.png"
        url2 = f"https://www.gstatic.com/android/keyboard/emojikitchen/{date2}/{u2}/{u2}_{u1}.png"
        
        target_url = None
        
        res = requests.head(url1, timeout=15)
        if res.status_code == 200:
            target_url = url1
        else:
            res = requests.head(url2, timeout=15)
            if res.status_code == 200:
                target_url = url2
                
        if not target_url:
            return {"success": False, "error": "This specific combination of emojis is not supported by Google Emoji Kitchen."}
            
        # Download the image
        img_res = requests.get(target_url, timeout=30)
        img_res.raise_for_status()
        image_bytes = img_res.content
        
        # Upload the generated image to Uguu
        try:
            image_url = _upload_to_uguu(image_bytes)
        except Exception:
            b64 = base64.b64encode(image_bytes).decode("utf-8")
            image_url = f"data:image/png;base64,{b64}"
            
        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "image": image_url,
                "emoji1": emoji1,
                "emoji2": emoji2
            }
        }
        
    except Exception as e:
        return {"success": False, "error": f"Failed to generate emojimix: {str(e)}"}
