import requests
from bs4 import BeautifulSoup

def get_simbol_tarot(payload):
    tanggal = payload.get("tanggal") or payload.get("tgl")
    bulan = payload.get("bulan") or payload.get("bln")
    tahun = payload.get("tahun") or payload.get("thn")
    
    if not tanggal or not bulan or not tahun:
        return {"success": False, "error": "Parameters 'tanggal', 'bulan', and 'tahun' are required"}

    tanggal_str = str(int(tanggal))
    bulan_str = str(int(bulan))
    tahun_str = str(int(tahun))

    url = "https://www.primbon.com/arti_kartu_tarot.php"
    post_data = {
        "tgl": tanggal_str,
        "bln": bulan_str,
        "thn": tahun_str,
        "kirim": " Submit! "
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

        p = body_div.find("p")
        if not p:
            return {"success": False, "error": "Failed to locate tarot card details paragraph."}

        img = p.find("img")
        image_url = ""
        if img and img.get("src"):
            image_url = "https://www.primbon.com/" + img.get("src")
        
        b_elements = p.find_all("b")
        tanggal_lahir = ""
        if len(b_elements) > 0:
            tanggal_lahir = b_elements[0].get_text().strip()
        
        kartu_tarot = ""
        if len(b_elements) > 1:
            kartu_tarot = b_elements[1].get_text().strip()

        # Extract description
        import copy
        p_copy = copy.copy(p)
        b_count = 0
        desc_nodes = []
        for child in list(p_copy.children):
            if child.name == "b":
                b_count += 1
                continue
            if b_count >= 2:
                if child.name == "img":
                    continue
                if child.name == "br":
                    desc_nodes.append("\n")
                else:
                    desc_nodes.append(child.get_text())
                    
        description = "".join(desc_nodes).strip()
        description = "\n".join(line.strip() for line in description.split("\n") if line.strip())

        return {
            "success": True,
            "data": {
                "tanggal_lahir": tanggal_lahir,
                "kartu_tarot": kartu_tarot,
                "image_url": image_url,
                "deskripsi": description
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Error occurred: {str(e)}"}
