import requests
from bs4 import BeautifulSoup
import re

def get_naga_hari(payload):
    tgl = payload.get("tgl")
    bln = payload.get("bln")
    thn = payload.get("thn")

    if not tgl or not bln or not thn:
        return {"success": False, "error": "Parameters 'tgl', 'bln', and 'thn' are required"}

    url = "https://www.primbon.com/rahasia_naga_hari.php"
    post_data = {
        "tgl": str(tgl),
        "bln": str(bln),
        "thn": str(thn),
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

        # Find Weton/Tanggal
        b_tag = body_div.find("b")
        weton = b_tag.get_text().strip() if b_tag else ""

        # Find result in <i> tag
        i_tag = body_div.find("i")
        result_raw = i_tag.get_text().strip() if i_tag else ""

        # Parse locations and directions
        naga_hari_lokasi = ""
        arah_tujuan = ""

        m = re.search(r"Naga Hari berada di\s+(.*?)\.", result_raw)
        if m:
            naga_hari_lokasi = m.group(1).strip()

        m2 = re.search(r"arah yang harus dituju adalah\s+(.*?)(?:\.|$)", result_raw)
        if m2:
            arah_tujuan = m2.group(1).strip()

        return {
            "success": True,
            "data": {
                "weton": weton,
                "result_raw": result_raw,
                "naga_hari_lokasi": naga_hari_lokasi,
                "arah_tujuan": arah_tujuan
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Error occurred: {str(e)}"}
