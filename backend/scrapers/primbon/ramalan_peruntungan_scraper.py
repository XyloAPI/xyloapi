import requests
from bs4 import BeautifulSoup

def get_ramalan_peruntungan(payload):
    nama = payload.get("nama1")
    tgl = payload.get("tgl1")
    bln = payload.get("bln1")
    thn1 = payload.get("thn1")
    thn2 = payload.get("thn2")

    if not nama or not tgl or not bln or not thn1 or not thn2:
        return {"success": False, "error": "Parameters 'nama1', 'tgl1', 'bln1', 'thn1', and 'thn2' are required"}

    url = "https://www.primbon.com/ramalan_peruntungan.php"
    post_data = {
        "nama1": str(nama),
        "tgl1": str(tgl),
        "bln1": str(bln),
        "thn1": str(thn1),
        "thn2": str(thn2),
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

        # Extract weton & name
        texts = [t.strip() for t in body_div.find_all(string=True) if t.strip()]

        name_val = ""
        lahir_val = ""
        header_val = ""

        for idx, t in enumerate(texts):
            if "Nama :" in t:
                name_val = texts[idx+1] if idx+1 < len(texts) else ""
            elif "Tgl. Lahir :" in t:
                lahir_val = texts[idx+1] if idx+1 < len(texts) else ""
            elif "PERUNTUNGAN ANDA DI TAHUN" in t:
                header_val = t

        # Find paragraphs of predictions
        paragraphs = []
        found_start = False

        contents = list(body_div.contents)
        for node in contents:
            txt = node.get_text().strip() if node.name else str(node).strip()
            clean = txt.replace("\xa0", " ").strip()
            if not clean:
                continue

            if node.name == "b" and "PERUNTUNGAN ANDA DI TAHUN" in clean:
                found_start = True
                continue

            if found_start:
                if node.name == "a" and "Hitung Kembali" in clean:
                    break
                if "adsbygoogle" in clean or "window.adsbygoogle" in clean:
                    continue
                if clean.isdigit() and len(clean) <= 2:
                    continue

                if node.name is None:
                    paragraphs.append(clean)
                elif node.name not in ["br", "hr", "script", "style"]:
                    paragraphs.append(node.get_text().strip())

        return {
            "success": True,
            "data": {
                "nama": name_val or nama,
                "tgl_lahir": lahir_val,
                "tahun_peruntungan": thn2,
                "header": header_val or f"PERUNTUNGAN ANDA DI TAHUN {thn2}",
                "ramalan": paragraphs
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Error occurred: {str(e)}"}
