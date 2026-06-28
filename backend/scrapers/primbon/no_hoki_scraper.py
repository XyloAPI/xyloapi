import requests
from bs4 import BeautifulSoup

def get_no_hoki(payload):
    nomer = payload.get("nomer") or payload.get("number") or payload.get("phone")
    if not nomer:
        return {"success": False, "error": "Parameter 'nomer' is required"}
    
    url = "https://www.primbon.com/no_hoki_bagua_shuzi.php"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {
        "nomer": nomer,
        "submit": " Submit! "
    }
    try:
        response = requests.post(url, headers=headers, data=data, timeout=30)
        if response.status_code != 200:
            return {"success": False, "error": f"Failed to fetch data from Primbon (HTTP {response.status_code})"}
        
        soup = BeautifulSoup(response.content, "html.parser")
        
        no_hp = None
        bagua_shuzi = None
        
        for b_tag in soup.find_all("b"):
            text = b_tag.get_text()
            if "No. HP :" in text:
                no_hp = text.split(":", 1)[1].strip()
            elif "Angka Bagua Shuzi :" in text:
                bagua_shuzi = text.split(":", 1)[1].strip()
                
        pos_data = {}
        neg_data = {}
        notes = []
        
        for table in soup.find_all("table"):
            table_text = table.get_text()
            if "ENERGI POSITIF" in table_text and "ENERGI NEGATIF" in table_text:
                cells = table.find_all("td")
                for cell in cells:
                    cell_text = cell.get_text().strip()
                    if "ENERGI POSITIF" in cell_text:
                        lines = [l.strip() for l in cell_text.split("\n") if l.strip()]
                        for line in lines:
                            if "=" in line:
                                key, val = line.split("=", 1)
                                key = key.strip()
                                val = val.strip()
                                if key == "%":
                                    pos_data["persentase"] = val
                                else:
                                    try:
                                        pos_data[key.lower().replace("/", "_")] = int(val)
                                    except ValueError:
                                        pos_data[key.lower().replace("/", "_")] = val
                    elif "ENERGI NEGATIF" in cell_text:
                        lines = [l.strip() for l in cell_text.split("\n") if l.strip()]
                        for line in lines:
                            if "=" in line:
                                key, val = line.split("=", 1)
                                key = key.strip()
                                val = val.strip()
                                if key == "%":
                                    neg_data["persentase"] = val
                                else:
                                    try:
                                        neg_data[key.lower().replace("/", "_")] = int(val)
                                    except ValueError:
                                        neg_data[key.lower().replace("/", "_")] = val
                
                notes_td = table.find("td", colspan="3")
                if notes_td:
                    for br in notes_td.find_all("br"):
                        br.replace_with("\n")
                    lines = [n.strip() for n in notes_td.get_text().strip().split("\n") if n.strip()]
                    notes = [l.replace("* ", "").replace("*", "").strip() for l in lines if l]
                break
                
        if not no_hp:
            return {"success": False, "error": "Failed to parse results from Primbon. Make sure the phone number is valid."}

        return {
            "success": True,
            "data": {
                "nomer": no_hp,
                "bagua_shuzi": bagua_shuzi,
                "energi_positif": pos_data,
                "energi_negatif": neg_data,
                "catatan": notes
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Error occurred: {str(e)}"}
