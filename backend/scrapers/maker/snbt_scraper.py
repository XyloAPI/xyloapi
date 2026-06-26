# -*- coding: utf-8 -*-
import os
import io
import time
import requests
from PIL import Image, ImageDraw, ImageFont

LOGO_URL = "https://i.imgur.com/Oi6QIpm.png"
QR_URL = "https://i.imgur.com/z6Cdv14.png"
FONT_BOLD_URL = "https://cdn.jsdelivr.net/gh/google/fonts/ofl/lato/Lato-Bold.ttf"
FONT_REG_URL = "https://cdn.jsdelivr.net/gh/google/fonts/ofl/lato/Lato-Regular.ttf"

ASSETS_DIR = os.path.join(os.path.dirname(__file__), "snbt_assets")
UGUU_URL = "https://uguu.se/upload.php"

def _upload_to_uguu(binary: bytes) -> str:
    filename = f"snbt_{int(time.time())}.png"
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

def draw_wrapped_text(d, text, x, y, max_w, font, fill, align="left", spacing=6):
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
        if align == "center":
            w = d.textbbox((0, 0), line, font=font)[2]
            line_x = x + (max_w - w) // 2
        else:
            line_x = x
        d.text((line_x, curr_y), line, font=font, fill=fill)
        curr_y += font.getbbox(line)[3] - font.getbbox(line)[1] + spacing
    return curr_y

def generate_snbt(payload):
    try:
        # Get parameters with defaults
        status = str(payload.get("status") or payload.get("diterima") or "1").strip()
        tahun = str(payload.get("tahun") or payload.get("year") or "2026").strip()
        no_peserta = str(payload.get("no_peserta") or payload.get("nopes") or "12-3456-789012").strip()
        nama = str(payload.get("name") or payload.get("nama") or "NAMA PESERTA").strip().upper()
        tgl_lahir = str(payload.get("tgl_lahir") or payload.get("tl") or "01-02-2006").strip()
        
        kode_ptn = str(payload.get("kode_ptn") or "000").strip()
        nama_ptn = str(payload.get("nama_ptn") or payload.get("ptn") or "UNIVERSITAS NEGERI").strip().upper()
        kode_prodi = str(payload.get("kode_prodi") or "1234567").strip()
        nama_prodi = str(payload.get("nama_prodi") or payload.get("prodi") or "PRODI").strip().upper()
        
        kip = str(payload.get("kip") or "0").strip()
        link = str(payload.get("link") or "https://pmb.univ.ac.id/").strip()

        # Cache/Download assets
        logo_path = get_cached_file(LOGO_URL, "snbt_logo.png")
        qr_path = get_cached_file(QR_URL, "snbt_qr.png")
        font_bold_path = get_cached_file(FONT_BOLD_URL, "Lato-Bold.ttf")
        font_reg_path = get_cached_file(FONT_REG_URL, "Lato-Regular.ttf")

        # Fonts
        font_title = ImageFont.truetype(font_bold_path, 24)
        font_label = ImageFont.truetype(font_reg_path, 16)
        font_value = ImageFont.truetype(font_bold_path, 16)
        font_congrats = ImageFont.truetype(font_bold_path, 18)
        font_note_red = ImageFont.truetype(font_reg_path, 13)
        font_note_normal = ImageFont.truetype(font_reg_path, 14)
        font_button = ImageFont.truetype(font_bold_path, 14)
        font_rejection = ImageFont.truetype(font_reg_path, 18)
        font_rejection_bold = ImageFont.truetype(font_bold_path, 18)
        font_motivational = ImageFont.truetype(font_bold_path, 24)

        W, H = 1000, 720
        # Create base gradient background
        img = Image.new("RGBA", (W, H))
        for x in range(W):
            t = x / W
            r = int(91 + (54 - 91) * t)
            g = int(134 + (209 - 134) * t)
            b = int(229 + (220 - 229) * t)
            for y in range(H):
                img.putpixel((x, y), (r, g, b, 255))

        # Create overlay image for transparent card
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)
        
        # Transparent Card Container (similar to rgba(180, 180, 180, 0.4))
        draw.rounded_rectangle((50, 40, 950, 680), radius=12, fill=(180, 180, 180, 75))
        draw.rounded_rectangle((50, 40, 950, 680), radius=12, outline=(255, 255, 255, 40), width=1)

        # Draw Logo
        logo = Image.open(logo_path).convert("RGBA")
        logo.thumbnail((220, 60), Image.Resampling.LANCZOS)
        overlay.paste(logo, (90, 70), logo)

        # Title: PENGUMUMAN HASIL SELEKSI SNBT SNPMB [TAHUN]
        draw.text((90, 150), f"PENGUMUMAN HASIL SELEKSI SNBT SNPMB {tahun}", font=font_title, fill=(255, 255, 255, 255))

        if status == "1":
            # QR Code
            qr = Image.open(qr_path).convert("RGBA")
            qr = qr.resize((150, 150), Image.Resampling.LANCZOS)
            overlay.paste(qr, (90, 200), qr)

            # Bio details
            draw.text((270, 200), "Nomor peserta", font=font_label, fill=(255, 255, 255, 220))
            draw.text((390, 200), ":", font=font_label, fill=(255, 255, 255, 220))
            draw.text((410, 200), no_peserta, font=font_value, fill=(255, 255, 255, 255))

            draw.text((270, 225), "Nama", font=font_label, fill=(255, 255, 255, 220))
            draw.text((390, 225), ":", font=font_label, fill=(255, 255, 255, 220))
            draw.text((410, 225), nama, font=font_value, fill=(255, 255, 255, 255))

            draw.text((270, 250), "Tanggal lahir", font=font_label, fill=(255, 255, 255, 220))
            draw.text((390, 250), ":", font=font_label, fill=(255, 255, 255, 220))
            draw.text((410, 250), tgl_lahir, font=font_value, fill=(255, 255, 255, 255))

            # Congrats
            draw.text((270, 290), f"Selamat! Anda dinyatakan lulus seleksi SNBT SNPMB {tahun} di", font=font_congrats, fill=(255, 255, 255, 255))

            # PTN & Prodi
            draw.text((270, 325), "PTN", font=font_label, fill=(255, 255, 255, 220))
            draw.text((390, 325), ":", font=font_label, fill=(255, 255, 255, 220))
            draw.text((410, 325), f"{kode_ptn} - {nama_ptn}", font=font_value, fill=(255, 255, 255, 255))

            draw.text((270, 350), "Program Studi", font=font_label, fill=(255, 255, 255, 220))
            draw.text((390, 350), ":", font=font_label, fill=(255, 255, 255, 220))
            draw.text((410, 350), f"{kode_prodi} - {nama_prodi}", font=font_value, fill=(255, 255, 255, 255))

            curr_y = 390
            # KIP Warning Note if enabled
            if kip == "1":
                kip_text = "Anda sebagai pendaftar Program Indonesia Pintar Pendidikan Tinggi, calon pemegang Kartu Indonesia Pintar Kuliah (KIP Kuliah) harus lolos verifikasi terhadap data akademik dan verifikasi data ekonomi melalui dokumen dan/atau kunjungan ke alamat tinggal Peserta."
                curr_y = draw_wrapped_text(draw, kip_text, 270, curr_y, 590, font_note_red, (255, 75, 75, 255), spacing=3)
                curr_y += 5

            # Normal footer notes
            note_1 = f"Persyaratan pendaftaran ulang calon mahasiswa baru dapat dilihat di {link}."
            note_2 = f"Anda dapat mencetak kembali Kartu Tanda Peserta UTBK-SNBT {tahun} di portal SNPMB."
            curr_y = draw_wrapped_text(draw, note_1, 270, curr_y, 590, font_note_normal, (255, 255, 255, 240), spacing=3)
            curr_y += 5
            curr_y = draw_wrapped_text(draw, note_2, 270, curr_y, 590, font_note_normal, (255, 255, 255, 240), spacing=3)

            # Unduh PDF Button
            btn_x, btn_y = 270, 560
            btn_w, btn_h = 590, 42
            draw.rounded_rectangle((btn_x, btn_y, btn_x + btn_w, btn_y + btn_h), radius=4, fill=(23, 162, 184, 255))
            
            btn_text = "UNDUH PENGUMUMAN KETUA SNPMB (PDF)"
            text_w = draw.textbbox((0, 0), btn_text, font=font_button)[2]
            text_h = draw.textbbox((0, 0), btn_text, font=font_button)[3] - draw.textbbox((0, 0), btn_text, font=font_button)[1]
            draw.text((btn_x + (btn_w - text_w) // 2, btn_y + (btn_h - text_h) // 2 - 2), btn_text, font=font_button, fill=(255, 255, 255, 255))

        else:
            # Rejection message
            reject_text = f"PESERTA ATAS NAMA {nama} DENGAN NOMOR PESERTA {no_peserta} DINYATAKAN TIDAK LULUS SELEKSI SNBT SNPMB {tahun}."
            
            # Wrap and center-align the text
            curr_y = draw_wrapped_text(draw, reject_text, 90, 240, 820, font_rejection_bold, (255, 255, 255, 255), align="center", spacing=8)
            
            # Motivational text
            m_text = "JANGAN PUTUS ASA DAN TETAP SEMANGAT!"
            curr_y += 40
            draw_wrapped_text(draw, m_text, 90, curr_y, 820, font_motivational, (255, 255, 255, 255), align="center")

            # Back button
            btn_x, btn_y = 350, 500
            btn_w, btn_h = 300, 42
            draw.rounded_rectangle((btn_x, btn_y, btn_x + btn_w, btn_y + btn_h), radius=4, fill=(40, 167, 69, 255))
            
            btn_text = "Kembali ke pencarian"
            text_w = draw.textbbox((0, 0), btn_text, font=font_button)[2]
            text_h = draw.textbbox((0, 0), btn_text, font=font_button)[3] - draw.textbbox((0, 0), btn_text, font=font_button)[1]
            draw.text((btn_x + (btn_w - text_w) // 2, btn_y + (btn_h - text_h) // 2 - 2), btn_text, font=font_button, fill=(255, 255, 255, 255))

        # Alpha composite overlay onto base gradient image
        img = Image.alpha_composite(img, overlay)

        # Convert to RGB if needed, or save as PNG
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
                "nama": nama,
                "kode_ptn": kode_ptn if status == "1" else None,
                "nama_ptn": nama_ptn if status == "1" else None,
                "kode_prodi": kode_prodi if status == "1" else None,
                "nama_prodi": nama_prodi if status == "1" else None,
                "tgl_lahir": tgl_lahir,
                "kip": kip,
                "link": link if status == "1" else None
            }
        }

    except Exception as e:
        return {"success": False, "error": f"Failed to generate fake SNBT card: {str(e)}"}
