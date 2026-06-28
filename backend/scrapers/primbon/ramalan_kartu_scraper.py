import requests
from bs4 import BeautifulSoup
import json
import re

def get_ramalan_kartu(payload):
    name = payload.get("name") or payload.get("nama")
    gender = payload.get("gender") or "m"
    spread = payload.get("spread") or "ac"
    
    if not name:
        return {"success": False, "error": "Parameter 'name' is required"}

    gender = gender.lower()
    if gender not in ["m", "f"]:
        return {"success": False, "error": "Parameter 'gender' must be 'm' (pria) or 'f' (wanita)"}

    url = "https://www.primbon.com/lenormand/ramalan_semua_kartu.php"
    post_data = {
        "name": name,
        "gender": gender,
        "spread": "ac",
        "submit": " Baca Ramalan "
    }
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded",
        "Referer": "https://www.primbon.com/lenormand/"
    }

    try:
        response = requests.post(url, data=post_data, headers=headers, timeout=30)
        if response.status_code != 200:
            return {"success": False, "error": f"Failed to fetch from Primbon (HTTP {response.status_code})"}

        soup = BeautifulSoup(response.content, "html.parser")
        body_div = soup.find("div", id="body")
        if not body_div:
            return {"success": False, "error": "Failed to parse result from Primbon"}

        # Extract nama
        title_nama = ""
        center = body_div.find("center")
        if center:
            h1 = center.find("h1")
            if h1:
                txt = h1.get_text()
                match = re.search(r'Untuk:\s*(.+)', txt, re.DOTALL)
                if match:
                    title_nama = match.group(1).strip()

        # Extract ringkasan (positif/negatif)
        ringkasan = ""
        for node in body_div.contents:
            txt = node.get_text().strip() if node.name else str(node).strip()
            if "kartu positif" in txt and "kartu negatif" in txt:
                ringkasan = " ".join(txt.split())
                break

        # Extract cards from the grid table
        kartu_list = []
        target_table = None
        for c in body_div.find_all("center"):
            tbl = c.find("table")
            if tbl and tbl.find("img", src=True):
                first_img = tbl.find("img")
                if first_img and "images/" in first_img.get("src", ""):
                    target_table = tbl
                    break

        if target_table:
            card_ajax_base = "https://www.primbon.com/lenormand/card.php"
            card_headers = {
                "User-Agent": headers["User-Agent"],
                "Referer": url
            }
            
            for tr in target_table.find_all("tr"):
                for td in tr.find_all("td"):
                    a = td.find("a")
                    img = td.find("img")
                    if not a or not img:
                        continue
                    onclick = a.get("onclick", "")
                    match = re.search(r"tampil_kartu\('(\d+)','(\d+)'\)", onclick)
                    if match:
                        num = match.group(1)
                        map_val = match.group(2)
                        img_src = img.get("src", "")
                        full_img = f"https://www.primbon.com/lenormand/{img_src}"
                        
                        card_res = requests.get(f"{card_ajax_base}?num={num}&map={map_val}", headers=card_headers, timeout=15)
                        if card_res.status_code == 200:
                            try:
                                card_data = json.loads(card_res.text)
                                nama_kartu = card_data[0] if len(card_data) > 0 else ""
                                keterangan = BeautifulSoup(card_data[1], "html.parser").get_text().strip() if len(card_data) > 1 else ""
                                raw_img_path = card_data[2].replace("\\/", "/") if len(card_data) > 2 else ""
                                kartu_img = f"https://www.primbon.com/lenormand/{raw_img_path}" if raw_img_path else full_img
                                
                                kartu_list.append({
                                    "num": num,
                                    "jarak": int(map_val),
                                    "nama": nama_kartu,
                                    "keterangan": keterangan,
                                    "thumbnail": full_img,
                                    "gambar": kartu_img
                                })
                            except Exception:
                                kartu_list.append({
                                    "num": num,
                                    "jarak": int(map_val),
                                    "thumbnail": full_img
                                })

        if not title_nama and not kartu_list:
            return {"success": False, "error": "Failed to parse Ramalan Kartu results."}

        return {
            "success": True,
            "data": {
                "nama": title_nama,
                "ringkasan": ringkasan,
                "total_kartu": len(kartu_list),
                "kartu": kartu_list
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Error occurred: {str(e)}"}
