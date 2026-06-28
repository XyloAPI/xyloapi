import requests
from bs4 import BeautifulSoup

def get_kecocokan_nama(payload):
    nama = payload.get("nama") or payload.get("query")
    tgl = payload.get("tgl")
    bln = payload.get("bln")
    thn = payload.get("thn")
    
    if not nama or not tgl or not bln or not thn:
        return {"success": False, "error": "Parameters 'nama', 'tgl', 'bln', 'thn' are required"}
        
    url = "https://www.primbon.com/kecocokan_nama.php"
    post_data = {
        "nama": nama,
        "tgl": str(tgl),
        "bln": str(bln),
        "thn": str(thn),
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

        # Extract values
        body_text = body_div.get_text()
        
        # Let's locate numbers
        life_path_number = ""
        destiny_number = ""
        hearts_desire_number = ""
        personality_number = ""
        
        for line in body_text.split("\n"):
            line = line.strip()
            if "Life Path Number" in line:
                life_path_number = line.split(":")[-1].strip()
            elif "Destiny Number" in line:
                destiny_number = line.split(":")[-1].strip()
            elif "Heart's Desire Number" in line:
                hearts_desire_number = line.split(":")[-1].strip()
            elif "Personality Number" in line:
                personality_number = line.split(":")[-1].strip()
        
        # Extract date of birth
        tgl_lahir = ""
        for b in body_div.find_all("b"):
            txt = b.get_text().strip()
            if txt.startswith("Tgl. Lahir:"):
                tgl_lahir = txt.replace("Tgl. Lahir:", "").strip()
                break
        
        # Extract table
        kecocokan_list = []
        rata_rata = ""
        table = body_div.find("table")
        if table:
            for row in table.find_all("tr"):
                cells = [c.get_text().strip() for c in row.find_all(["td", "th"])]
                if len(cells) == 2:
                    label, val = cells[0], cells[1]
                    if label.startswith("RATA-RATA"):
                        rata_rata = val
                    else:
                        kecocokan_list.append({
                            "aspek": label.strip(),
                            "persentase": val
                        })
                        
        # Extract catatan
        catatan = ""
        for div in body_div.find_all("div"):
            txt = div.get_text().strip()
            if "Sebuah nama dianggap cocok" in txt:
                catatan = txt
                break
            
        if not life_path_number and not destiny_number:
            return {"success": False, "error": "Failed to retrieve matching analysis."}
            
        return {
            "success": True,
            "data": {
                "nama": nama,
                "tgl_lahir": tgl_lahir,
                "life_path_number": life_path_number,
                "destiny_number": destiny_number,
                "hearts_desire_number": hearts_desire_number,
                "personality_number": personality_number,
                "kecocokan": kecocokan_list,
                "rata_rata": rata_rata,
                "catatan": catatan
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Error occurred: {str(e)}"}
