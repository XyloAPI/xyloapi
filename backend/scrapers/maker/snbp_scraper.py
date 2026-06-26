# -*- coding: utf-8 -*-
import os
import io
import time
import requests
from PIL import Image, ImageDraw, ImageFont

LOGO_URL = "https://i.imgur.com/uPbPsPI.png"
QR_URL = "https://i.imgur.com/VoeICVh.png"
FONT_BOLD_URL = "https://github.com/google/fonts/raw/main/ofl/lato/Lato-Bold.ttf"
FONT_REG_URL = "https://github.com/google/fonts/raw/main/ofl/lato/Lato-Regular.ttf"

ASSETS_DIR = os.path.join(os.path.dirname(__file__), "snbp_assets")
UGUU_URL = "https://uguu.se/upload.php"

def _upload_to_uguu(binary: bytes) -> str:
    filename = f"snbp_{int(time.time())}.png"
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

def draw_wrapped_text(d, text, x, y, max_w, font, fill):
    words = text.split(" ")
    lines = []
    current_line = []
    for word in words:
        test_line = " ".join(current_line + [word])
        w = d.textbbox((0, 0), test_line, font=font)[2]
        if w <= max_w:
            current_line.append(word)
        else:
            lines.append(" ".join(current_line))
            current_line = [word]
    if current_line:
        lines.append(" ".join(current_line))
    
    curr_y = y
    for line in lines:
        d.text((x, curr_y), line, font=font, fill=fill)
        curr_y += font.getbbox(line)[3] - font.getbbox(line)[1] + 6
    return curr_y

def generate_snbp(payload):
    try:
        # Get parameters with defaults
        status = str(payload.get("status") or payload.get("diterima") or "1").strip()
        tahun = str(payload.get("tahun") or payload.get("year") or "2025").strip()
        no_peserta = str(payload.get("no_peserta") or payload.get("nopes") or "4251234567").strip()
        nisn = str(payload.get("nisn") or "0061234567").strip()
        nama = str(payload.get("name") or payload.get("nama") or "AHMAD LULUS PRATAMA").strip().upper()
        prodi = str(payload.get("prodi") or payload.get("nama_prodi") or "TEKNIK INFORMATIKA - S1").strip().upper()
        univ = str(payload.get("univ") or payload.get("nama_ptn") or "UNIVERSITAS DIPONEGORO").strip().upper()
        tgl_lahir = str(payload.get("tgl_lahir") or payload.get("tl") or "17 Oktober 2006").strip()
        sekolah = str(payload.get("sekolah") or "SMA NEGERI 1 SEMARANG").strip().upper()
        kab = str(payload.get("kab") or "KOTA SEMARANG").strip().upper()
        prov = str(payload.get("prov") or "PROV. JAWA TENGAH").strip().upper()
        link = str(payload.get("link") or "https://pmb.undip.ac.id/").strip()

        # Cache/Download assets
        logo_path = get_cached_file(LOGO_URL, "snbp.png")
        qr_path = get_cached_file(QR_URL, "qr.png")
        font_bold_path = get_cached_file(FONT_BOLD_URL, "Lato-Bold.ttf")
        font_reg_path = get_cached_file(FONT_REG_URL, "Lato-Regular.ttf")

        # Fonts
        font_title = ImageFont.truetype(font_bold_path, 26)
        font_sub_title = ImageFont.truetype(font_bold_path, 13)
        font_bio_caption = ImageFont.truetype(font_bold_path, 16)
        font_bio_value = ImageFont.truetype(font_bold_path, 22)
        font_name = ImageFont.truetype(font_bold_path, 34)
        font_prodi_univ = ImageFont.truetype(font_reg_path, 20)
        font_note_title = ImageFont.truetype(font_bold_path, 18)
        font_note_sub = ImageFont.truetype(font_reg_path, 14)
        font_note_link = ImageFont.truetype(font_bold_path, 14)
        font_footer = ImageFont.truetype(font_reg_path, 14)

        if status == "1":
            W, H = 1200, 850
            img = Image.new("RGBA", (W, H), (22, 22, 22, 255))
            draw = ImageDraw.Draw(img)

            # Gradient Header (Blue: #083661 to #006cb4)
            header_h = 130
            for x in range(W):
                t = x / W
                r = int(8 + (0 - 8) * t)
                g = int(54 + (108 - 54) * t)
                b = int(97 + (180 - 97) * t)
                for y in range(header_h):
                    img.putpixel((x, y), (r, g, b, 255))

            draw.text((35, 45), f"SELAMAT! ANDA DINYATAKAN LULUS SELEKSI SNBP {tahun}", font=font_title, fill=(255, 255, 255, 255))

            # Logo
            logo = Image.open(logo_path).convert("RGBA")
            logo.thumbnail((250, 70), Image.Resampling.LANCZOS)
            img.paste(logo, (W - 35 - logo.width, (header_h - logo.height) // 2), logo)

            # Upper Bio
            draw.text((35, 170), f"NISN {nisn} - NOREG {no_peserta}", font=font_bio_caption, fill=(136, 204, 240, 255))
            draw.text((35, 200), nama, font=font_name, fill=(255, 255, 255, 255))
            draw.text((35, 250), prodi, font=font_prodi_univ, fill=(255, 255, 255, 255))
            draw.text((35, 280), univ, font=font_prodi_univ, fill=(255, 255, 255, 255))

            # QR Code
            qr = Image.open(qr_path).convert("RGBA")
            qr = qr.resize((120, 120), Image.Resampling.LANCZOS)
            img.paste(qr, (W - 35 - 120, 170), qr)

            # Horizontal Separator
            draw.line((35, 340, W - 35, 340), fill=(50, 50, 50, 255), width=2)

            # Details
            draw.text((35, 370), "Tanggal Lahir", font=font_bio_caption, fill=(136, 204, 240, 255))
            draw.text((35, 395), tgl_lahir, font=font_bio_value, fill=(255, 255, 255, 255))

            draw.text((35, 460), "Asal Sekolah", font=font_bio_caption, fill=(136, 204, 240, 255))
            draw.text((35, 485), sekolah, font=font_bio_value, fill=(255, 255, 255, 255))

            draw.text((380, 370), "Kabupaten/Kota", font=font_bio_caption, fill=(136, 204, 240, 255))
            draw.text((380, 395), kab, font=font_bio_value, fill=(255, 255, 255, 255))

            draw.text((380, 460), "Provinsi", font=font_bio_caption, fill=(136, 204, 240, 255))
            draw.text((380, 485), prov, font=font_bio_value, fill=(255, 255, 255, 255))

            # Note Box
            note_x, note_y = 700, 370
            note_w, note_h = 465, 175
            draw.rectangle((note_x, note_y, note_x + note_w, note_y + note_h), fill=(250, 250, 250, 255))

            draw.text((note_x + 20, note_y + 20), "Silakan lakukan pendaftaran ulang.", font=font_note_title, fill=(45, 45, 45, 255))
            draw.text((note_x + 20, note_y + 55), "Informasi pendaftaran ulang di PTN/Politeknik Negeri", font=font_note_sub, fill=(45, 45, 45, 255))
            draw.text((note_x + 20, note_y + 75), "dapat dilihat pada link berikut:", font=font_note_sub, fill=(45, 45, 45, 255))
            draw.text((note_x + 20, note_y + 115), link, font=font_note_link, fill=(0, 138, 207, 255))

            # Horizontal Separator 2
            draw.line((35, 590, W - 35, 590), fill=(50, 50, 50, 255), width=2)

            # Footer
            footer_text1 = f"Status penerimaan Anda sebagai mahasiswa akan ditetapkan setelah PTN tujuan melakukan verifikasi data akademik (rapor dan/atau portofolio). Silakan Anda membaca peraturan tentang penerimaan mahasiswa baru di laman PTN tujuan."
            footer_text2 = f"Khusus peserta KIP Kuliah, PTN tujuan juga dapat melakukan verifikasi data ekonomi dan/atau kunjungan ke tempat tinggal Anda sebelum menetapkan status penerimaan Anda."
            
            next_y = draw_wrapped_text(draw, footer_text1, 35, 615, W - 70, font_footer, (153, 153, 153, 255))
            draw_wrapped_text(draw, footer_text2, 35, next_y + 10, W - 70, font_footer, (153, 153, 153, 255))

        else:
            W, H = 1200, 650
            img = Image.new("RGBA", (W, H), (22, 22, 22, 255))
            draw = ImageDraw.Draw(img)

            # Gradient Header (Red: #bf0a0a to #e82d33)
            header_h = 130
            for x in range(W):
                t = x / W
                r = int(191 + (232 - 191) * t)
                g = int(10 + (45 - 10) * t)
                b = int(10 + (51 - 10) * t)
                for y in range(header_h):
                    img.putpixel((x, y), (r, g, b, 255))

            draw.text((35, 30), f"ANDA DINYATAKAN TIDAK LULUS SELEKSI SNBP {tahun}", font=font_title, fill=(255, 255, 255, 255))
            draw.text((35, 75), f"MASIH ADA KESEMPATAN MENDAFTAR DAN MENGIKUTI SNBT {tahun} ATAU SELEKSI MANDIRI PTN.", font=font_sub_title, fill=(255, 255, 255, 255))

            # Logo
            logo = Image.open(logo_path).convert("RGBA")
            logo.thumbnail((250, 70), Image.Resampling.LANCZOS)
            img.paste(logo, (W - 35 - logo.width, (header_h - logo.height) // 2), logo)

            # Upper Bio
            draw.text((35, 170), f"NOMOR PESERTA: {no_peserta}", font=font_bio_caption, fill=(136, 204, 240, 255))
            draw.text((35, 200), nama, font=font_name, fill=(255, 255, 255, 255))

            # Horizontal Separator
            draw.line((35, 270, W - 35, 270), fill=(50, 50, 50, 255), width=2)

            # Details
            draw.text((35, 300), "Tanggal Lahir", font=font_bio_caption, fill=(136, 204, 240, 255))
            draw.text((35, 325), tgl_lahir, font=font_bio_value, fill=(255, 255, 255, 255))

            draw.text((35, 390), "Asal Sekolah", font=font_bio_caption, fill=(136, 204, 240, 255))
            draw.text((35, 415), sekolah, font=font_bio_value, fill=(255, 255, 255, 255))

            draw.text((380, 300), "Kabupaten/Kota", font=font_bio_caption, fill=(136, 204, 240, 255))
            draw.text((380, 325), kab, font=font_bio_value, fill=(255, 255, 255, 255))

            draw.text((380, 390), "Provinsi", font=font_bio_caption, fill=(136, 204, 240, 255))
            draw.text((380, 415), prov, font=font_bio_value, fill=(255, 255, 255, 255))

            # Horizontal Separator 2
            draw.line((35, 500, W - 35, 500), fill=(50, 50, 50, 255), width=2)

            # Footer
            footer_text1 = f"Pembukaan registrasi akun SNPMB bagi calon peserta UTBK-SNBT adalah tanggal 16 Februari - 03 Maret {tahun}. Pendaftaran UTBK-SNBT akan dibuka pada 21 Maret - 05 April {tahun}. Tetap semangat dan persiapkan diri Anda dengan baik."
            draw_wrapped_text(draw, footer_text1, 35, 525, W - 70, font_footer, (153, 153, 153, 255))

        # Convert to bytes and upload to Uguu
        out_buf = io.BytesIO()
        img.save(out_buf, format="PNG")
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
                "status": status,
                "tahun": tahun,
                "no_peserta": no_peserta,
                "nisn": nisn,
                "nama": nama,
                "prodi": prodi if status == "1" else None,
                "univ": univ if status == "1" else None,
                "tgl_lahir": tgl_lahir,
                "sekolah": sekolah,
                "kab": kab,
                "prov": prov
            }
        }

    except Exception as e:
        return {"success": False, "error": f"Failed to generate fake SNBP card: {str(e)}"}
