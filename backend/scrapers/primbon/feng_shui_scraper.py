import requests
from bs4 import BeautifulSoup
import re

def get_feng_shui(payload):
    nama = payload.get("nama") or payload.get("name")
    gender = payload.get("gender")
    tahun = payload.get("tahun") or payload.get("thn")

    if not nama or gender is None or not tahun:
        return {"success": False, "error": "Parameters 'nama', 'gender' (1=laki-laki, 0=perempuan), and 'tahun' are required"}

    url = "https://www.primbon.com/perhitungan_feng_shui.php"
    post_data = {
        "nama": str(nama),
        "gender": str(gender),
        "tahun": str(tahun),
        "submit": " Submit! "
    }
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    try:
        response = requests.post(url, data=post_data, headers=headers, timeout=30)
        if response.status_code != 200:
            return {"success": False, "error": f"Failed to fetch from Primbon (HTTP {response.status_code})"}

        soup = BeautifulSoup(response.content, "html.parser")
        body_div = soup.find("div", id="body")
        if not body_div:
            return {"success": False, "error": "Failed to parse result from Primbon"}

        contents = list(body_div.contents)

        result_nama = ""
        tahun_lahir = ""
        jenis_kelamin = ""
        angka_kua = ""
        kelompok_kua = ""
        karakter = ""
        warna_keberuntungan = ""
        sektor_baik = []
        sektor_buruk = []

        current_label = ""
        sektor_mode = None
        current_sektor = None

        for node in contents:
            txt = node.get_text().strip() if node.name else str(node).strip()
            clean = txt.replace("\xa0", " ").strip()
            if not clean:
                continue

            if node.name == "b":
                if clean == "Nama:":
                    current_label = "nama"
                elif clean == "Thn. Lahir:":
                    current_label = "tahun"
                elif clean == "Jns. Kelamin:":
                    current_label = "gender"
                elif clean == "Angka Kua Anda:":
                    current_label = "kua_wait"
                elif clean == "Warna Keberuntungan:":
                    current_label = "warna_wait"
                elif clean == "SEKTOR/ARAH BAIK":
                    sektor_mode = "baik"
                    current_sektor = None
                    current_label = ""
                elif clean == "SEKTOR/ARAH BURUK":
                    sektor_mode = "buruk"
                    current_sektor = None
                    current_label = ""
                elif current_label == "kua_wait":
                    angka_kua = clean
                    current_label = ""
                elif current_label == "warna_wait":
                    warna_keberuntungan = clean
                    current_label = ""
                elif sektor_mode and re.match(r"^\d+\.", clean):
                    if current_sektor:
                        (sektor_baik if sektor_mode == "baik" else sektor_buruk).append(current_sektor)
                    current_sektor = {"nama": clean.rstrip(":"), "arah": "", "keterangan": ""}
                    current_label = "sektor_arah"
                elif sektor_mode and current_label == "sektor_arah":
                    if current_sektor:
                        current_sektor["arah"] = clean
                    current_label = "sektor_ket"
                continue

            if not node.name:
                if current_label == "nama":
                    result_nama = clean
                    current_label = ""
                elif current_label == "tahun":
                    tahun_lahir = clean
                    current_label = ""
                elif current_label == "gender":
                    jenis_kelamin = clean
                    current_label = ""
                continue

            if node.name == "i":
                if sektor_mode and current_sektor and current_label == "sektor_ket":
                    current_sektor["keterangan"] = clean
                    current_label = ""
                elif "kelompok Kua" in clean:
                    parts = clean.split("Orang dalam")
                    kelompok_kua = parts[0].replace("Anda termasuk", "").strip()
                    if len(parts) > 1:
                        m = re.search(r"karakter:\s*(.+)", parts[1])
                        if m:
                            karakter = m.group(1).strip()
                    current_label = ""
                continue

        if current_sektor and sektor_mode:
            (sektor_baik if sektor_mode == "baik" else sektor_buruk).append(current_sektor)

        if not angka_kua:
            return {"success": False, "error": "Failed to parse Feng Shui results."}

        return {
            "success": True,
            "data": {
                "nama": result_nama,
                "tahun_lahir": tahun_lahir,
                "jenis_kelamin": jenis_kelamin,
                "angka_kua": angka_kua,
                "kelompok_kua": kelompok_kua,
                "karakter": karakter,
                "warna_keberuntungan": warna_keberuntungan,
                "sektor_baik": sektor_baik,
                "sektor_buruk": sektor_buruk
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Error occurred: {str(e)}"}
