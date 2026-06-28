import requests
from bs4 import BeautifulSoup

def get_hari_naas(payload):
    tgl = payload.get("tgl")
    bln = payload.get("bln")
    thn = payload.get("thn")

    if not tgl or not bln or not thn:
        return {"success": False, "error": "Parameters 'tgl', 'bln', and 'thn' are required"}

    url = "https://www.primbon.com/primbon_hari_naas.php"
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

        contents = list(body_div.contents)

        hari_lahir = ""
        hari_naas = ""
        catatan = ""

        current_label = ""
        for node in contents:
            txt = node.get_text().strip() if node.name else str(node).strip()
            clean = txt.replace("\xa0", " ").strip()
            if not clean:
                continue

            if node.name == "b":
                if "Hari Lahir Anda" in clean:
                    current_label = "hari_lahir"
                elif "Hari Naas Anda" in clean:
                    current_label = "hari_naas"
                continue

            if not node.name:
                if current_label == "hari_lahir":
                    hari_lahir = clean
                    current_label = ""
                elif current_label == "hari_naas":
                    hari_naas = clean
                    current_label = ""
                continue

            if node.name == "i" and "Catatan:" in clean:
                catatan = clean
                continue

        return {
            "success": True,
            "data": {
                "hari_lahir": hari_lahir,
                "hari_naas": hari_naas,
                "catatan": catatan
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Error occurred: {str(e)}"}
