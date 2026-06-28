import requests
from bs4 import BeautifulSoup
import re

def get_masa_subur(payload):
    dateday = payload.get("dateday")
    datemonth = payload.get("datemonth")
    dateyear = payload.get("dateyear")
    days = payload.get("days", "28")

    if not dateday or not datemonth or not dateyear:
        return {"success": False, "error": "Parameters 'dateday', 'datemonth', and 'dateyear' are required"}

    url = "https://www.primbon.com/masa_subur.php"
    post_data = {
        "dateday": str(dateday),
        "datemonth": str(datemonth),
        "dateyear": str(dateyear),
        "days": str(days),
        "calculator_ok": " Submit "
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

        next_mens = ""
        ovulasi = {"start": "", "end": ""}
        masa_subur = {"start": "", "end": ""}
        konsepsi_laki = {"start": "", "end": ""}
        konsepsi_perempuan = {"start": "", "end": ""}
        persalinan = ""

        current_label = ""

        for node in contents:
            txt = node.get_text().strip() if node.name else str(node).strip()
            if not txt:
                continue

            if "Tgl. Menstruasi Berikutnya :" in txt:
                current_label = "next_mens"
            elif "Tgl. Ovulasi :" in txt:
                current_label = "ovulasi"
            elif "Tgl. Masa Subur :" in txt:
                current_label = "masa_subur"
            elif "Konsepsi Bayi Laki-laki" in txt:
                current_label = "laki"
            elif "Konsepsi Bayi Perempuan" in txt:
                current_label = "perempuan"
            elif "Tgl. Persalinan :" in txt:
                current_label = "persalinan"

            if node.name == "b":
                val = txt
                val = re.sub(r'^[^\w\s]+', '', val).strip()

                if current_label == "next_mens":
                    next_mens = val
                    current_label = ""
                elif current_label == "ovulasi":
                    if not ovulasi["start"]:
                        ovulasi["start"] = val
                    else:
                        ovulasi["end"] = val
                        current_label = ""
                elif current_label == "masa_subur":
                    if not masa_subur["start"]:
                        masa_subur["start"] = val
                    else:
                        masa_subur["end"] = val
                        current_label = ""
                elif current_label == "laki":
                    if not konsepsi_laki["start"]:
                        konsepsi_laki["start"] = val
                    else:
                        konsepsi_laki["end"] = val
                        current_label = ""
                elif current_label == "perempuan":
                    if not konsepsi_perempuan["start"]:
                        konsepsi_perempuan["start"] = val
                    else:
                        konsepsi_perempuan["end"] = val
                        current_label = ""
                elif current_label == "persalinan":
                    persalinan = val
                    current_label = ""

        return {
            "success": True,
            "data": {
                "siklus": f"{days} hari",
                "tgl_menstruasi_berikutnya": next_mens,
                "tgl_ovulasi": f"{ovulasi['start']} s/d {ovulasi['end']}" if ovulasi["start"] else "",
                "tgl_masa_subur": f"{masa_subur['start']} s/d {masa_subur['end']}" if masa_subur["start"] else "",
                "konsepsi_laki_laki": f"{konsepsi_laki['start']} s/d {konsepsi_laki['end']}" if konsepsi_laki["start"] else "",
                "konsepsi_perempuan": f"{konsepsi_perempuan['start']} s/d {konsepsi_perempuan['end']}" if konsepsi_perempuan["start"] else "",
                "tgl_persalinan": persalinan
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Error occurred: {str(e)}"}
