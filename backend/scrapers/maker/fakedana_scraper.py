import os
import io
import time
import requests
import tempfile
import math
from PIL import Image, ImageDraw, ImageFont

CONFIG = {
    "rp": {"x": 70, "y": 62, "fontSize": 19, "color": "#a9e6ff"},
    "saldo": {"x": 101, "y": 53, "fontSize": 29, "color": "#FFFFFF"},
    "icon": {"gap": 8, "y": 64, "size": 20}
}

FONT_RP = 'https://cdn.jsdelivr.net/gh/Ditzzx-vibecoder/Assets/Font/iconfont.ttf'
FONT_SALDO = 'https://cdn.jsdelivr.net/gh/Ditzzx-vibecoder/Assets/Font/f5803c-1772975107907.ttf'
BG_URL = 'https://i.8upload.com/image/c73f965ba42e1d71/20260501192538912.jpg'
EYE_URL = 'https://i.8upload.com/image/448bcf3655edb2d2/invisible.png'
UGUU_URL = "https://uguu.se/upload.php"

def _upload_to_uguu(binary: bytes) -> str:
    filename = f"fakedana_{int(time.time())}.png"
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

def generate_dana_mockup(angka):
    # Get background image
    bg_path = get_cached_file(BG_URL, "dana_bg.jpg")
    bg = Image.open(bg_path).convert("RGBA")
    
    # Get fonts
    font_rp_path = get_cached_file(FONT_RP, "iconfont.ttf")
    font_saldo_path = get_cached_file(FONT_SALDO, "font_saldo.ttf")
    
    font_rp = ImageFont.truetype(font_rp_path, CONFIG["rp"]["fontSize"])
    font_saldo = ImageFont.truetype(font_saldo_path, CONFIG["saldo"]["fontSize"])
    
    # Get eye icon
    eye_path = get_cached_file(EYE_URL, "dana_eye.png")
    eye_icon = Image.open(eye_path).convert("RGBA")
    eye_icon = eye_icon.resize((CONFIG["icon"]["size"], CONFIG["icon"]["size"]), Image.Resampling.LANCZOS)
    
    # Create canvas
    canvas = Image.new("RGBA", (bg.width, bg.height))
    canvas.paste(bg, (0, 0))
    
    draw = ImageDraw.Draw(canvas)
    
    # Draw "Rp"
    draw.text(
        (CONFIG["rp"]["x"], CONFIG["rp"]["y"]),
        "Rp",
        font=font_rp,
        fill=CONFIG["rp"]["color"]
    )
    
    # Draw nominal / saldo
    draw.text(
        (CONFIG["saldo"]["x"], CONFIG["saldo"]["y"]),
        angka,
        font=font_saldo,
        fill=CONFIG["saldo"]["color"]
    )
    
    # Measure text width to position the eye icon
    bbox = font_saldo.getbbox(angka)
    text_width = bbox[2] - bbox[0]
    icon_x = CONFIG["saldo"]["x"] + text_width + CONFIG["icon"]["gap"]
    
    # Paste eye icon
    canvas.paste(eye_icon, (icon_x, CONFIG["icon"]["y"]), eye_icon)
    
    # Draw Watermark (rotasi -0.35 radian, alpha 0.35)
    watermark = Image.new("RGBA", (bg.width * 2, bg.height * 2), (255, 255, 255, 0))
    w_draw = ImageDraw.Draw(watermark)
    
    center_x = bg.width
    center_y = bg.height
    
    try:
        w_font_large = ImageFont.truetype("arial.ttf", 46)
        w_font_small = ImageFont.truetype("arial.ttf", 18)
    except IOError:
        w_font_large = ImageFont.load_default()
        w_font_small = ImageFont.load_default()
        
    w_bbox_large = w_font_large.getbbox("SIMULASI")
    w_w_large = w_bbox_large[2] - w_bbox_large[0]
    w_h_large = w_bbox_large[3] - w_bbox_large[1]
    
    w_draw.text(
        (center_x - w_w_large / 2, center_y - w_h_large / 2 - 10),
        "SIMULASI",
        font=w_font_large,
        fill=(255, 255, 255, 90) # white with ~35% alpha
    )
    
    w_bbox_small = w_font_small.getbbox("BUKAN BUKTI SALDO / TRANSAKSI")
    w_w_small = w_bbox_small[2] - w_bbox_small[0]
    w_h_small = w_bbox_small[3] - w_bbox_small[1]
    
    w_draw.text(
        (center_x - w_w_small / 2, center_y - w_h_small / 2 + 35),
        "BUKAN BUKTI SALDO / TRANSAKSI",
        font=w_font_small,
        fill=(255, 255, 255, 90)
    )
    
    angle_deg = -0.35 * 180 / math.pi
    rotated_watermark = watermark.rotate(angle_deg, resample=Image.Resampling.BICUBIC, center=(center_x, center_y))
    
    crop_box = (
        int(bg.width / 2),
        int(bg.height / 2),
        int(bg.width / 2 + bg.width),
        int(bg.height / 2 + bg.height)
    )
    watermark_cropped = rotated_watermark.crop(crop_box)
    
    final_canvas = Image.alpha_composite(canvas, watermark_cropped)
    
    img_byte_arr = io.BytesIO()
    final_canvas.convert("RGB").save(img_byte_arr, format="PNG")
    return img_byte_arr.getvalue()

def generate_fakedana(payload):
    try:
        text = payload.get("nominal") or payload.get("text") or payload.get("amount") or ""
        if isinstance(text, list):
            text = text[0] if text else ""
        if not text:
            return {"success": False, "error": "Missing required parameter: nominal"}

        raw = int("".join(c for c in str(text) if c.isdigit()))
        angka = f"{raw:,}".replace(",", ".")

        buffer = generate_dana_mockup(angka)
        
        try:
            image_url = _upload_to_uguu(buffer)
        except Exception:
            import base64
            b64 = base64.b64encode(buffer).decode("utf-8")
            image_url = f"data:image/png;base64,{b64}"

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "image": image_url,
                "nominal": f"Rp{angka}",
                "status": "Simulasi / mockup"
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Failed to run Fake Dana generator: {str(e)}"}
