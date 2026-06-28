import requests
from bs4 import BeautifulSoup

def get_kecocokan_nama_pasangan(payload):
    nama1 = payload.get("nama1") or payload.get("query1")
    nama2 = payload.get("nama2") or payload.get("query2")
    if not nama1 or not nama2:
        return {"success": False, "error": "Parameters 'nama1' and 'nama2' are required"}

    url = "https://www.primbon.com/kecocokan_nama_pasangan.php"
    params = {
        "nama1": nama1,
        "nama2": nama2,
        "proses": " Submit! "
    }
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, params=params, headers=headers, timeout=30)
        if response.status_code != 200:
            return {"success": False, "error": f"Failed to fetch data from Primbon (HTTP {response.status_code})"}

        soup = BeautifulSoup(response.content, "html.parser")
        body_div = soup.find("div", id="body")
        if not body_div:
            return {"success": False, "error": "Failed to parse result from Primbon"}

        nama_anda = ""
        nama_pasangan = ""
        sisi_positif = ""
        sisi_negatif = ""
        deskripsi = ""

        # Let's trace nodes
        for idx, node in enumerate(body_div.contents):
            if node.name == "b":
                txt = node.get_text().strip()
                if "Nama Anda:" in txt:
                    if idx + 1 < len(body_div.contents):
                        nama_anda = body_div.contents[idx + 1].get_text().strip() if body_div.contents[idx + 1].name else str(body_div.contents[idx + 1]).strip()
                elif "Nama Pasangan:" in txt:
                    if idx + 1 < len(body_div.contents):
                        nama_pasangan = body_div.contents[idx + 1].get_text().strip() if body_div.contents[idx + 1].name else str(body_div.contents[idx + 1]).strip()
                elif "Sisi Positif Anda:" in txt:
                    if idx + 1 < len(body_div.contents):
                        sisi_positif = body_div.contents[idx + 1].get_text().strip() if body_div.contents[idx + 1].name else str(body_div.contents[idx + 1]).strip()
                elif "Sisi Negatif Anda:" in txt:
                    if idx + 1 < len(body_div.contents):
                        sisi_negatif = body_div.contents[idx + 1].get_text().strip() if body_div.contents[idx + 1].name else str(body_div.contents[idx + 1]).strip()
                        for j in range(idx + 2, len(body_div.contents)):
                            sub_node = body_div.contents[j]
                            if sub_node.name == "a" or (sub_node.name == "b" and "Ramalan Kecocokan" in sub_node.get_text()):
                                break
                            if not sub_node.name:
                                txt_val = str(sub_node).strip()
                                if txt_val:
                                    deskripsi = txt_val
                                    break

        if not nama_anda and not nama_pasangan:
            return {"success": False, "error": "Failed to parse compatibility results."}

        return {
            "success": True,
            "data": {
                "nama_anda": nama_anda or nama1,
                "nama_pasangan": nama_pasangan or nama2,
                "sisi_positif": sisi_positif,
                "sisi_negatif": sisi_negatif,
                "deskripsi": deskripsi
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Error occurred: {str(e)}"}
