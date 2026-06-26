# -*- coding: utf-8 -*-
import os
import io
import time
import requests
from PIL import Image, ImageDraw, ImageFont

TEMPLATE_URL = "https://i.imgur.com/xqsVIbI.jpeg"
FONT_MONTSER_URL = "https://cdn.jsdelivr.net/gh/googlefonts/Montserrat/fonts/ttf/Montserrat-Medium.ttf"


FONT_PACIFICO_URL = "https://cdn.jsdelivr.net/gh/google/fonts/ofl/pacifico/Pacifico-Regular.ttf"

ASSETS_DIR = os.path.join(os.path.dirname(__file__), "kuitansi_assets")
UGUU_URL = "https://uguu.se/upload.php"

def _upload_to_uguu(binary: bytes) -> str:
    filename = f"kuitansi_{int(time.time())}.png"
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
        res = requests.get(
            url, 
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            timeout=30
        )
        res.raise_for_status()
        with open(file_path, "wb") as f:
            f.write(res.content)
    return file_path

def generate_kuitansi(payload):
    try:
        nomor = str(payload.get("nomor") or "234").strip()
        dari = str(payload.get("dari") or "Ibnu Maksum").strip()
        sejumlah = str(payload.get("sejumlah") or "satu juta lima ratus empat puluh lima rupiah").strip()
        untuk1 = str(payload.get("untuk1") or payload.get("untuk") or "Pembayaran").strip()
        untuk2 = str(payload.get("untuk2") or "Uang Muka Rumah").strip()
        untuk3 = str(payload.get("untuk3") or "Uang Muka Mobil").strip()
        jumlah = str(payload.get("jumlah") or "1.000.545,-").strip()
        lokasi = str(payload.get("lokasi") or "Kota Serang, 12 Maret 2024").strip()
        nama = str(payload.get("nama") or "Ibnu Maksum").strip()

        # Cache assets
        template_path = get_cached_file(TEMPLATE_URL, "kuitansi.jpg")
        font_montser_path = get_cached_file(FONT_MONTSER_URL, "Montserrat-Medium.ttf")
        font_pacifico_path = get_cached_file(FONT_PACIFICO_URL, "Pacifico-Regular.ttf")

        img = Image.open(template_path).convert("RGBA")
        draw = ImageDraw.Draw(img)

        # Helper for scaling fonts to prevent overflow
        def get_scaled_font(text, initial_size, max_width):
            size = initial_size
            f = ImageFont.truetype(font_montser_path, size)
            bbox = draw.textbbox((0, 0), text, font=f)
            w = bbox[2] - bbox[0]
            while w > max_width and size > 12:
                size -= 1
                f = ImageFont.truetype(font_montser_path, size)
                bbox = draw.textbbox((0, 0), text, font=f)
                w = bbox[2] - bbox[0]
            return f

        # Drawing text aligned left-middle (anchor="lm") to match Canvas behavior
        text_color = (0, 0, 0, 180) # rgba(0, 0, 0, 0.7)

        # Draw with dynamic scaling
        font_nomor = get_scaled_font(nomor, 45, 300)
        draw.text((400, 80), nomor, font=font_nomor, fill=text_color, anchor="lm")

        font_dari = get_scaled_font(dari, 45, 830)
        draw.text((640, 134), dari, font=font_dari, fill=text_color, anchor="lm")

        font_sejumlah = get_scaled_font(sejumlah, 45, 840)
        draw.text((630, 202), sejumlah, font=font_sejumlah, fill=text_color, anchor="lm")

        font_untuk1 = get_scaled_font(untuk1, 45, 840)
        draw.text((630, 258), untuk1, font=font_untuk1, fill=text_color, anchor="lm")

        font_untuk2 = get_scaled_font(untuk2, 45, 1120)
        draw.text((350, 302), untuk2, font=font_untuk2, fill=text_color, anchor="lm")

        font_untuk3 = get_scaled_font(untuk3, 45, 1120)
        draw.text((350, 345), untuk3, font=font_untuk3, fill=text_color, anchor="lm")

        font_jumlah = get_scaled_font(f"  {jumlah}", 45, 520)
        draw.text((430, 510), f"  {jumlah}", font=font_jumlah, fill=text_color, anchor="lm")

        font_lokasi = get_scaled_font(lokasi, 40, 460)
        draw.text((1010, 390), lokasi, font=font_lokasi, fill=text_color, anchor="lm")

        font_nama = get_scaled_font(f"      {nama}", 40, 360)
        draw.text((1110, 550), f"      {nama}", font=font_nama, fill=text_color, anchor="lm")

        # Draw realistic cursive handwritten signature in dark blue ink
        font_sig = ImageFont.truetype(font_pacifico_path, 42)
        sig_color = (18, 30, 110, 230)
        draw.text((1260, 470), nama, font=font_sig, fill=sig_color, anchor="mm")


        # Convert to RGB and save
        img = img.convert("RGB")
        out_buf = io.BytesIO()
        img.save(out_buf, format="JPEG", quality=100)
        image_bytes = out_buf.getvalue()

        try:
            image_url = _upload_to_uguu(image_bytes)
        except Exception:
            import base64
            b64 = base64.b64encode(image_bytes).decode("utf-8")
            image_url = f"data:image/jpeg;base64,{b64}"

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "image": image_url,
                "nomor": nomor,
                "dari": dari,
                "sejumlah": sejumlah,
                "untuk1": untuk1,
                "untuk2": untuk2,
                "untuk3": untuk3,
                "jumlah": jumlah,
                "lokasi": lokasi,
                "nama": nama
            }
        }

    except Exception as e:
        return {"success": False, "error": f"Failed to generate Kuitansi: {str(e)}"}
