import requests
from bs4 import BeautifulSoup

def get_sifat_usaha(payload):
    tgl = payload.get("tgl")
    bln = payload.get("bln")
    thn = payload.get("thn")
    if not tgl or not bln or not thn:
        return {"success": False, "error": "Parameters 'tgl', 'bln', and 'thn' are required"}

    url = "https://www.primbon.com/sifat_usaha_bisnis.php"
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
        response = requests.post(url, data=post_data, headers=headers, timeout=30)
        if response.status_code != 200:
            return {"success": False, "error": f"Failed to fetch data from Primbon (HTTP {response.status_code})"}

        soup = BeautifulSoup(response.content, "html.parser")
        body_div = soup.find("div", id="body")
        if not body_div:
            return {"success": False, "error": "Failed to parse result from Primbon"}

        hari_lahir_raw = ""
        hari_lahir = ""
        tanggal = ""
        deskripsi = ""

        # Trace nodes
        for idx, node in enumerate(body_div.contents):
            if node.name == "b":
                txt = node.get_text().strip()
                if "Hari Lahir Anda:" in txt:
                    if idx + 1 < len(body_div.contents):
                        hari_lahir_raw = body_div.contents[idx + 1].get_text().strip() if body_div.contents[idx + 1].name else str(body_div.contents[idx + 1]).strip()
                        if ", Tgl. " in hari_lahir_raw:
                            parts = hari_lahir_raw.split(", Tgl. ")
                            hari_lahir = parts[0].strip()
                            tanggal = parts[1].strip()
                        else:
                            hari_lahir = hari_lahir_raw
                        
                        for j in range(idx + 2, len(body_div.contents)):
                            sub_node = body_div.contents[j]
                            if sub_node.name == "a" or (sub_node.name == "b" and "Memahami" in sub_node.get_text()):
                                break
                            if not sub_node.name:
                                txt_val = str(sub_node).strip()
                                if txt_val:
                                    deskripsi = txt_val
                                    break

        if not hari_lahir_raw and not deskripsi:
            return {"success": False, "error": "Failed to parse business compatibility results."}

        return {
            "success": True,
            "data": {
                "hari_lahir_raw": hari_lahir_raw,
                "hari_lahir": hari_lahir,
                "tanggal": tanggal,
                "deskripsi": deskripsi
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Error occurred: {str(e)}"}
