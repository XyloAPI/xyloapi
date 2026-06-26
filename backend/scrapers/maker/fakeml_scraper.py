import os
import requests
import io
import time
import tarfile
from PIL import Image, ImageDraw, ImageFont

BORDER_OFFSET = {
    1: 26, 2: 36, 3: 26, 4: 26, 5: 26,
    6: 26, 7: 26, 8: 26, 9: 26,
    10: 26, 11: 22, 12: 28, 13: 26,
    14: 21, 15: 26, 16: 26,
}

RANK_CONFIG = {
    "epic":   {"size": 210, "x": 388, "y": 760},
    "glory":  {"size": 210, "x": 387, "y": 760},
    "gm":     {"size": 260, "x": 358, "y": 760},
    "honor":  {"size": 210, "x": 384, "y": 760},
    "imo":    {"size": 260, "x": 358, "y": 760},
    "legend": {"size": 260, "x": 360, "y": 760},
    "mawi":   {"size": 210, "x": 387, "y": 760},
}

ASSETS_DIR = os.path.join(os.path.dirname(__file__), "fake_ml_assets")
UGUU_URL = "https://uguu.se/upload.php"

def _upload_to_uguu(binary: bytes) -> str:
    filename = f"fakeml_{int(time.time())}.png"
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

def download_and_extract_assets():
    if os.path.exists(ASSETS_DIR):
        return

    url = "https://registry.npmjs.org/fake-ml/-/fake-ml-1.0.5.tgz"
    res = requests.get(url, timeout=60)
    res.raise_for_status()

    with tarfile.open(fileobj=io.BytesIO(res.content), mode="r:gz") as tar:
        for member in tar.getmembers():
            if "package/assets/" in member.name:
                rel_path = member.name.split("package/assets/", 1)[1]
                if not rel_path:
                    continue
                dest_path = os.path.join(ASSETS_DIR, rel_path)
                os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                if member.isfile():
                    f = tar.extractfile(member)
                    if f:
                        with open(dest_path, "wb") as out_f:
                            out_f.write(f.read())

def download_avatar(url):
    try:
        res = requests.get(url, timeout=15)
        if res.ok:
            return Image.open(io.BytesIO(res.content)).convert("RGBA")
    except Exception:
        pass
    return Image.open(os.path.join(ASSETS_DIR, "avatar.jpg")).convert("RGBA")

def crop_to_square(image):
    width, height = image.size
    min_dim = min(width, height)
    left = (width - min_dim) // 2
    top = (height - min_dim) // 2
    right = (width + min_dim) // 2
    bottom = (height + min_dim) // 2
    return image.crop((left, top, right, bottom))

def generate_fake_ml(payload):
    try:
        # Self-healing assets download
        download_and_extract_assets()

        # Parse inputs
        username = payload.get("username") or payload.get("name") or "Player"
        avatar_url = payload.get("avatar") or ""
        rank = payload.get("rank") or "imo"
        border_val = payload.get("border") or 0

        try:
            border = int(border_val)
        except Exception:
            border = 0

        # Load background
        bg_path = os.path.join(ASSETS_DIR, "Lobby.jpg")
        background = Image.open(bg_path).convert("RGBA")
        
        # Load Avatar
        if avatar_url:
            avatar_img = download_avatar(avatar_url)
        else:
            avatar_img = Image.open(os.path.join(ASSETS_DIR, "avatar.jpg")).convert("RGBA")
            
        # Draw avatar at x: 389, y: 446, size: 204, r: 12
        av_x, av_y, av_size, av_r = 389, 446, 204, 12
        
        # Crop avatar to square 1:1 ratio
        avatar_square = crop_to_square(avatar_img)
        
        # Resize avatar to exactly av_size x av_size
        avatar_resized = avatar_square.resize((av_size, av_size), Image.Resampling.LANCZOS)
        
        # Create rounded avatar mask
        mask = Image.new("L", (av_size, av_size), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([0, 0, av_size, av_size], radius=av_r, fill=255)
        
        # Draw outline if no border
        use_border = border > 0
        if not use_border:
            outline_color = (184, 149, 111, 255)
            thickness = 4
            outline_draw = ImageDraw.Draw(background)
            outline_draw.rounded_rectangle(
                [av_x - thickness, av_y - thickness, av_x + av_size + thickness, av_y + av_size + thickness],
                radius=av_r + thickness,
                outline=outline_color,
                width=thickness
            )

            
        # Paste Avatar
        background.paste(avatar_resized, (av_x, av_y), mask)
        
        # Draw Border
        if use_border:
            border_path = os.path.join(ASSETS_DIR, "border", f"{border}.webp")
            if os.path.exists(border_path):
                border_img = Image.open(border_path).convert("RGBA")
                offset = BORDER_OFFSET.get(border, 26)
                b_size = av_size + offset * 2
                border_resized = border_img.resize((b_size, b_size), Image.Resampling.LANCZOS)
                background.paste(border_resized, (av_x - offset, av_y - offset), border_resized)
                
        # Draw Rank
        rank_cfg = RANK_CONFIG.get(rank, {"size": 210, "x": 387, "y": 760})
        rank_path = os.path.join(ASSETS_DIR, "rank", f"{rank}.webp")
        if os.path.exists(rank_path):
            rank_img = Image.open(rank_path).convert("RGBA")
            r_size = rank_cfg["size"]
            r_h = int(r_size * (rank_img.height / rank_img.width))
            rank_resized = rank_img.resize((r_size, r_h), Image.Resampling.LANCZOS)
            background.paste(rank_resized, (rank_cfg["x"], rank_cfg["y"]), rank_resized)
            
        # Draw Indonesian flag circle at x: 364, y: 428, size: 55
        flag_x, flag_y, flag_size = 364, 428, 55
        flag_img = Image.new("RGBA", (flag_size, flag_size), (255, 255, 255, 255))
        flag_draw = ImageDraw.Draw(flag_img)
        flag_draw.rectangle([0, 0, flag_size, flag_size // 2], fill=(255, 0, 0, 255))
        
        # Circle mask
        flag_mask = Image.new("L", (flag_size, flag_size), 0)
        flag_mask_draw = ImageDraw.Draw(flag_mask)
        flag_mask_draw.ellipse([0, 0, flag_size, flag_size], fill=255)
        
        background.paste(flag_img, (flag_x, flag_y), flag_mask)
        
        # Draw Username
        name = username[:15]
        font_path = os.path.join(ASSETS_DIR, "noto-sans.regular.ttf")
        font_size = 36
        
        while font_size > 8:
            font = ImageFont.truetype(font_path, font_size)
            draw_temp = ImageDraw.Draw(background)
            try:
                w_text = draw_temp.textbbox((0, 0), name, font=font)[2]
            except Exception:
                w_text = font.getsize(name)[0]
                
            if w_text <= 209:
                break
            font_size -= 1
            
        draw = ImageDraw.Draw(background)
        draw.text((496, 681 + 46 // 2), name, fill=(255, 255, 255, 255), font=ImageFont.truetype(font_path, font_size), anchor="mm")
        
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
                "username": username,
                "rank": rank,
                "border": border
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Failed to generate Fake ML card: {str(e)}"}
