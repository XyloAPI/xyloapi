import requests
from bs4 import BeautifulSoup

def get_sifat_karakter(payload):
    nama = payload.get("nama")
    tanggal = payload.get("tanggal")
    bulan = payload.get("bulan")
    tahun = payload.get("tahun")

    if not nama or not tanggal or not bulan or not tahun:
        return {"success": False, "error": "Parameters 'nama', 'tanggal', 'bulan', and 'tahun' are required"}

    url = "https://www.primbon.com/sifat_karakter_tanggal_lahir.php"
    post_data = {
        "nama": str(nama),
        "tanggal": str(tanggal),
        "bulan": str(bulan),
        "tahun": str(tahun),
        "submit": " Submit! "
    }
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    try:
        response = requests.post(url, data=post_data, headers=headers, timeout=20)
        if response.status_code != 200:
            return {"success": False, "error": f"Failed to fetch from Primbon (HTTP {response.status_code})"}

        soup = BeautifulSoup(response.content, "html.parser")
        body_div = soup.find("div", id="body")
        if not body_div:
            return {"success": False, "error": "Failed to parse result from Primbon"}

        # Extract weton / tanggal & nama
        texts = [t.strip() for t in body_div.find_all(string=True) if t.strip()]

        name_val = ""
        lahir_val = ""

        for idx, t in enumerate(texts):
            if "Nama :" in t:
                name_val = texts[idx+1] if idx+1 < len(texts) else ""
            elif "Tgl. Lahir :" in t:
                lahir_val = texts[idx+1] if idx+1 < len(texts) else ""

        # Find garis hidup header
        garis_hidup = ""
        b_tags = body_div.find_all("b")
        for b in b_tags:
            b_txt = b.get_text().strip()
            if "GARIS HIDUP" in b_txt or "ANGKA" in b_txt:
                garis_hidup = b_txt
                break

        # Find the description in the <i> tag
        i_tag = body_div.find("i")
        desc_raw = i_tag.get_text().strip() if i_tag else ""

        # Split description into paragraphs by newline
        paragraphs = [p.strip() for p in desc_raw.split("\n") if p.strip()]

        return {
            "success": True,
            "data": {
                "nama": name_val or nama,
                "tgl_lahir": lahir_val,
                "garis_hidup": garis_hidup,
                "penjelasan": paragraphs
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Error occurred: {str(e)}"}
