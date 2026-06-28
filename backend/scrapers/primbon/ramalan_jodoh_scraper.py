import requests
from bs4 import BeautifulSoup

def get_ramalan_jodoh(payload):
    nama1 = payload.get("nama1")
    tgl1 = payload.get("tgl1")
    bln1 = payload.get("bln1")
    thn1 = payload.get("thn1")
    nama2 = payload.get("nama2")
    tgl2 = payload.get("tgl2")
    bln2 = payload.get("bln2")
    thn2 = payload.get("thn2")
    
    if not all([nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2]):
        return {
            "success": False, 
            "error": "All parameters (nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2) are required."
        }
    
    url = "https://www.primbon.com/ramalan_jodoh.php"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {
        "nama1": nama1,
        "tgl1": str(tgl1),
        "bln1": str(bln1),
        "thn1": str(thn1),
        "nama2": nama2,
        "tgl2": str(tgl2),
        "bln2": str(bln2),
        "thn2": str(thn2),
        "submit": "  RAMALAN JODOH \u00bb  "
    }
    
    try:
        response = requests.post(url, headers=headers, data=data, timeout=30)
        if response.status_code != 200:
            return {"success": False, "error": f"Failed to fetch data from Primbon (HTTP {response.status_code})"}
            
        soup = BeautifulSoup(response.content, "html.parser")
        
        person1 = {}
        person2 = {}
        tgl_lahirs = []
        
        for tag in soup.find_all("i"):
            if "Tgl. Lahir:" in tag.get_text():
                name_tag = tag.find_previous("b")
                tgl_lahirs.append({
                    "nama": name_tag.get_text() if name_tag else "",
                    "tgl_lahir": tag.get_text().replace("Tgl. Lahir:", "").strip()
                })
                
        if len(tgl_lahirs) >= 2:
            person1 = tgl_lahirs[0]
            person2 = tgl_lahirs[1]
            
        petung_results = []
        for b_tag in soup.find_all("b"):
            i_tag = b_tag.find("i")
            if i_tag and "Berdasarkan" in i_tag.get_text():
                header = i_tag.get_text().strip()
                detail = ""
                curr = b_tag.next_sibling
                while curr:
                    if curr.name in ["b", "a", "div"]:
                        break
                    if isinstance(curr, str):
                        detail += curr
                    elif curr.name == "br":
                        detail += "\n"
                    else:
                        detail += curr.get_text()
                    curr = curr.next_sibling
                    
                detail_cleaned = [line.strip() for line in detail.split("\n") if line.strip()]
                detail_text = " ".join(detail_cleaned).strip()
                
                if "*" in detail_text:
                    detail_text = detail_text.split("*")[0].strip()
                    
                petung_results.append({
                    "header": header,
                    "detail": detail_text
                })
                
        advice = ""
        for i_tag in soup.find_all("i"):
            if "*Jangan mudah memutuskan" in i_tag.get_text():
                advice = i_tag.get_text().replace("*", "").strip()
                break
                
        return {
            "success": True,
            "data": {
                "person1": person1,
                "person2": person2,
                "petung": petung_results,
                "catatan": advice
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Error occurred: {str(e)}"}
