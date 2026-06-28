import requests
from bs4 import BeautifulSoup

def get_pitagoras(payload):
    tanggal = payload.get("tanggal") or payload.get("tgl")
    bulan = payload.get("bulan") or payload.get("bln")
    tahun = payload.get("tahun") or payload.get("thn")
    
    if not tanggal or not bulan or not tahun:
        return {"success": False, "error": "Parameters 'tanggal', 'bulan', and 'tahun' are required"}

    # Pad inputs with leading zeroes if needed (e.g. 1 -> 01)
    tanggal_str = str(tanggal).zfill(2)
    bulan_str = str(bulan).zfill(2)
    tahun_str = str(tahun)

    url = "https://www.primbon.com/ramalan_nasib.php"
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
        angka_akar_title = ""
        angka_akar_val = ""
        sisi_negatif = ""
        bisnis_insight = ""
        elemen = ""
        rekomendasi_arah = []
        kombinasi_angka = []

        for idx, node in enumerate(contents):
            txt = node.get_text().strip() if node.name else str(node).strip()
            if "Hasil analisa pitagoras untuk tanggal lahir" in txt:
                tanggal_lahir = txt.replace("Hasil analisa pitagoras untuk tanggal lahir", "").replace("\xa0", " ").strip()
                continue

            # Angka Akar
            if node.name == "b" and "Angka Akar" in txt:
                angka_akar_title = txt
                desc_parts = []
                for j in range(idx + 1, len(contents)):
                    sub_node = contents[j]
                    if sub_node.name:
                        if sub_node.name == "b" or sub_node.name == "i":
                            break
                        sub_txt = sub_node.get_text().strip()
                        if "Sisi Negatif" in sub_txt or "Dalam numerologi" in sub_txt:
                            break
                    else:
                        sub_txt = str(sub_node).strip()
                        if sub_txt:
                            if sub_txt.startswith("Sisi Negatif") or sub_txt.startswith("Dalam numerologi"):
                                break
                            desc_parts.append(sub_txt)
                angka_akar_val = " ".join(desc_parts).strip()
                continue

            # Sisi Negatif
            if not node.name and txt.startswith("Sisi Negatif"):
                sisi_negatif = txt.replace("Sisi Negatif -", "").strip()
                continue

            # Bisnis Insight
            if node.name == "i" and not txt.startswith("Catatan:"):
                bisnis_insight = txt
                continue

            # Elemen
            if not node.name and "Dalam numerologi Pitagoras, anda termasuk elemen" in txt:
                for j in range(idx + 1, len(contents)):
                    sub_node = contents[j]
                    if sub_node.name == "b":
                        elemen = sub_node.get_text().strip()
                        break
                continue

            # Rekomendasi Arah (Unsur, Profesi, Bisnis)
            if not node.name and txt.startswith("UNSUR "):
                unsur_name = txt.replace("UNSUR ", "").strip()
                profesi = ""
                bisnis = ""
                for j in range(idx + 1, len(contents)):
                    sub_node = contents[j]
                    sub_txt = sub_node.get_text().strip() if sub_node.name else str(sub_node).strip()
                    if not sub_node.name and sub_txt.startswith("UNSUR "):
                        break
                    if sub_node.name == "b" and "Angka Kombinasi" in sub_txt:
                        break
                    if sub_node.name == "u" and sub_txt.startswith("PROFESI:"):
                        prof_parts = []
                        for k in range(j + 1, len(contents)):
                            k_node = contents[k]
                            k_txt = k_node.get_text().strip() if k_node.name else str(k_node).strip()
                            if k_node.name in ["u", "b"] or k_txt.startswith("UNSUR ") or k_txt.startswith("Dalam numerologi"):
                                break
                            if not k_node.name and k_txt:
                                prof_parts.append(k_txt)
                        profesi = " ".join(prof_parts).strip()
                    elif sub_node.name == "u" and sub_txt.startswith("BISNIS:"):
                        biz_parts = []
                        for k in range(j + 1, len(contents)):
                            k_node = contents[k]
                            k_txt = k_node.get_text().strip() if k_node.name else str(k_node).strip()
                            if k_node.name in ["u", "b"] or k_txt.startswith("UNSUR ") or k_txt.startswith("Dalam numerologi"):
                                break
                            if not k_node.name and k_txt:
                                biz_parts.append(k_txt)
                        bisnis = " ".join(biz_parts).strip()
                rekomendasi_arah.append({
                    "unsur": unsur_name,
                    "profesi": profesi,
                    "bisnis": bisnis
                })
                continue

            # Angka Kombinasi
            if node.name == "b" and ("Angka Kombinasi" in txt or "Angka Tunggal" in txt):
                comb_title = txt
                comb_desc = ""
                for j in range(idx + 1, len(contents)):
                    sub_node = contents[j]
                    if sub_node.name == "b":
                        break
                    if sub_node.name == "form" or (sub_node.name and "Tgl. Lahir" in sub_node.get_text()):
                        break
                    if not sub_node.name:
                        sub_txt = str(sub_node).strip()
                        if sub_txt:
                            if sub_txt.startswith("Catatan:"):
                                break
                            comb_desc = sub_txt
                            break
                kombinasi_angka.append({
                    "kombinasi": comb_title,
                    "deskripsi": comb_desc
                })

        # Find the Holy Tetraktys table
        tetraktys_table = []
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

        if not tanggal_lahir and not angka_akar_title:
            return {"success": False, "error": "Failed to parse Pitagoras numerology results."}

        return {
            "success": True,
            "data": {
                "tanggal_lahir": tanggal_lahir,
                "angka_akar_title": angka_akar_title,
                "angka_akar_val": angka_akar_val,
                "sisi_negatif": sisi_negatif,
                "bisnis_insight": bisnis_insight,
                "elemen": elemen,
                "rekomendasi_arah": rekomendasi_arah,
                "kombinasi_angka": kombinasi_angka,
                "tetraktys_table": tetraktys_table
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Error occurred: {str(e)}"}
