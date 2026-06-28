import requests
from bs4 import BeautifulSoup
import re

def get_weton_jawa(payload):
    tgl = payload.get("tgl")
    bln = payload.get("bln")
    thn = payload.get("thn")

    if not tgl or not bln or not thn:
        return {"success": False, "error": "Parameters 'tgl', 'bln', and 'thn' are required"}

    url = "https://www.primbon.com/weton_jawa.php"
    post_data = {
        "tgl": str(tgl),
        "bln": str(bln),
        "thn": str(thn),
        "submit": "  Cek WETON JAWA \u00bb  "
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

        contents = list(body_div.contents)

        weton = ""
        neptu_pancasuda = ""
        neptu_saptawara = ""
        neptu_kamarokam = ""
        watak_hari = ""
        naga_hari = ""
        jam_baik = ""
        watak_kelahiran = ""
        nasib_rejeki = []

        current_section = ""

        for node in contents:
            txt = node.get_text().strip() if node.name else str(node).strip()
            clean = txt.replace("\xa0", " ").strip()
            if not clean:
                continue

            if node.name == "b":
                if "Tanggal:" in clean:
                    current_section = "tanggal"
                elif "Jumlah Neptu" in clean:
                    current_section = "neptu"
                elif "Watak Hari" in clean:
                    current_section = "watak_hari"
                elif "Naga Hari" in clean:
                    current_section = "naga_hari"
                elif "Jam Baik" in clean:
                    current_section = "jam_baik"
                elif "Watak Kelahiran" in clean:
                    current_section = "watak_kelahiran"
                elif "Nasib & Rejeki" in clean:
                    current_section = "nasib_rejeki"
                else:
                    current_section = ""
                continue

            if not node.name:
                if current_section == "tanggal":
                    weton = clean
                    current_section = ""
                elif current_section == "neptu":
                    if "Pancasuda:" in clean:
                        neptu_pancasuda = clean
                    elif "Saptawara" in clean:
                        neptu_saptawara = clean
                    elif "Kamarokam:" in clean:
                        neptu_kamarokam = clean
                elif current_section == "watak_hari":
                    watak_hari = clean
                    current_section = ""
                elif current_section == "naga_hari":
                    naga_hari = clean
                    current_section = ""
                elif current_section == "jam_baik":
                    jam_baik = clean
                    current_section = ""
                elif current_section == "watak_kelahiran":
                    watak_kelahiran = clean
                    current_section = ""
                elif current_section == "nasib_rejeki":
                    if "Untuk menghitung" in clean or "Catatan:" in clean:
                        current_section = ""
                        continue
                    if clean.startswith("Usia"):
                        m = re.match(r"(Usia\s+.*?\s+Tahun):\s*(.*)", clean)
                        if m:
                            nasib_rejeki.append({
                                "usia": m.group(1).strip(),
                                "prediksi": m.group(2).strip()
                            })
                        else:
                            nasib_rejeki.append({
                                "usia": "Detail",
                                "prediksi": clean
                            })

        return {
            "success": True,
            "data": {
                "weton": weton,
                "neptu": {
                    "pancasuda": neptu_pancasuda,
                    "saptawara": neptu_saptawara,
                    "kamarokam": neptu_kamarokam
                },
                "watak_hari": watak_hari,
                "naga_hari": naga_hari,
                "jam_baik": jam_baik,
                "watak_kelahiran": watak_kelahiran,
                "nasib_rejeki": nasib_rejeki
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Error occurred: {str(e)}"}
