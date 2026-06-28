import requests
from bs4 import BeautifulSoup

def get_hari_baik(payload):
    tgl = payload.get("tgl")
    bln = payload.get("bln")
    thn = payload.get("thn")

    if not tgl or not bln or not thn:
        return {"success": False, "error": "Parameters 'tgl', 'bln', and 'thn' are required"}

    url = "https://www.primbon.com/petung_hari_baik.php"
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

        # Extract weton
        texts = [t.strip() for t in body_div.find_all(string=True) if t.strip()]
        weton = ""
        for t in texts:
            if "Tgl." in t:
                weton = t
                break

        # Extract watak from <i> tag
        i_tag = body_div.find("i")
        watak_raw = i_tag.get_text().strip() if i_tag else ""

        kategori = ""
        karakter = ""
        status = ""
        if ":" in watak_raw:
            parts = watak_raw.split(":", 1)
            kategori = parts[0].strip()
            desc = parts[1].strip()
            if desc.startswith("BAIK"):
                status = "BAIK"
                karakter = desc.replace("BAIK", "", 1).strip().lstrip(",").strip()
            elif desc.startswith("BURUK"):
                status = "BURUK"
                karakter = desc.replace("BURUK", "", 1).strip().lstrip(",").strip()
            else:
                karakter = desc

        return {
            "success": True,
            "data": {
                "weton": weton,
                "watak_raw": watak_raw,
                "kategori": kategori,
                "status": status,
                "karakter": karakter
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Error occurred: {str(e)}"}
