import requests
from bs4 import BeautifulSoup

def get_potensi_penyakit(payload):
    tanggal = payload.get("tanggal") or payload.get("tgl")
    bulan = payload.get("bulan") or payload.get("bln")
    tahun = payload.get("tahun") or payload.get("thn")
    
    if not tanggal or not bulan or not tahun:
        return {"success": False, "error": "Parameters 'tanggal', 'bulan', and 'tahun' are required"}

    tanggal_str = str(tanggal).zfill(2)
    bulan_str = str(bulan).zfill(2)
    tahun_str = str(tahun)

    url = "https://www.primbon.com/cek_potensi_penyakit.php"
    post_data = {
        "tanggal": tanggal_str,
        "bulan": bulan_str,
        "tahun": tahun_str,
        "hitung": " Submit! "
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

        contents = body_div.contents

        tanggal_lahir = ""
        sektor_analisa = []
        penjelasan_potensi = ""
        potensi_penyakit = []
        catatan = ""
        tetraktys_table = []

        for idx, node in enumerate(contents):
            txt = node.get_text().strip() if node.name else str(node).strip()
            if "Hasil analisa Pitagoras untuk tgl. lahir" in txt:
                tanggal_lahir = txt.replace("Hasil analisa Pitagoras untuk tgl. lahir", "").replace("\xa0", " ").strip()
                continue

            # Sektor yg dianalisa
            if node.name == "b" and "Sektor yg dianalisa:" in txt:
                for j in range(idx + 1, len(contents)):
                    sub_node = contents[j]
                    sub_txt = sub_node.get_text().strip() if sub_node.name else str(sub_node).strip()
                    if "Anda tidak memiliki" in sub_txt or (sub_node.name and sub_node.name in ["ul", "div", "form", "table"]):
                        break
                    if not sub_node.name:
                        cleaned = sub_txt.replace("\xa0", " ").strip()
                        if cleaned:
                            sektor_analisa.append(cleaned)
                continue

            # Penjelasan potensi
            if not node.name and "sehingga potensi penyakit ditentukan oleh elemen tersebut" in txt:
                penjelasan_potensi = txt.replace("\xa0", " ").strip()
                continue

            # Potensi penyakit (ul)
            if node.name == "ul":
                for li in node.find_all("li"):
                    li_txt = li.get_text().strip()
                    if ":" in li_txt:
                        parts = li_txt.split(":", 1)
                        potensi_penyakit.append({
                            "elemen": parts[0].strip(),
                            "deskripsi": parts[1].strip()
                        })
                continue

            # Catatan
            if node.name == "div" and txt.startswith("*Potensi penyakit"):
                catatan = txt.strip()
                continue

        # Find the Holy Tetraktys table
        table_el = body_div.find("table")
        if table_el:
            import copy
            for tr in table_el.find_all("tr"):
                row_cells = []
                for cell in tr.find_all("td"):
                    c_cell = copy.copy(cell)
                    center = c_cell.find("center")
                    if center:
                        small = center.find("div", class_="small")
                        if small:
                            small_text = small.get_text().strip()
                            small.decompose()
                            text = center.get_text().strip().replace("\xa0", " ") + "\n" + small_text
                        else:
                            text = center.get_text().strip().replace("\xa0", " ")
                    else:
                        text = c_cell.get_text().strip().replace("\xa0", " ")
                    
                    text = text.replace("\r", "").replace("\n", "\n")
                    row_cells.append({
                        "text": text,
                        "colspan": int(cell.get("colspan", 1)),
                        "rowspan": int(cell.get("rowspan", 1)),
                        "bgcolor": cell.get("bgcolor", ""),
                        "align": cell.get("align", ""),
                        "width": cell.get("width", ""),
                        "height": cell.get("height", "")
                    })
                tetraktys_table.append(row_cells)

        if not tanggal_lahir and not penjelasan_potensi:
            return {"success": False, "error": "Failed to parse Potensi Penyakit results."}

        return {
            "success": True,
            "data": {
                "tanggal_lahir": tanggal_lahir,
                "sektor_analisa": sektor_analisa,
                "penjelasan_potensi": penjelasan_potensi,
                "potensi_penyakit": potensi_penyakit,
                "catatan": catatan,
                "tetraktys_table": tetraktys_table
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Error occurred: {str(e)}"}
