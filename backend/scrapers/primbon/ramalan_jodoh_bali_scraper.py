import requests
from bs4 import BeautifulSoup

def get_ramalan_jodoh_bali(payload):
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
    
    url = "https://www.primbon.com/ramalan_jodoh_bali.php"
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
        "submit": " Submit! "
    }
    
    try:
        response = requests.post(url, headers=headers, data=data, timeout=30)
        if response.status_code != 200:
            return {"success": False, "error": f"Failed to fetch data from Primbon (HTTP {response.status_code})"}
            
        soup = BeautifulSoup(response.content, "html.parser")
        
        names = []
        for b_tag in soup.find_all("b"):
            if b_tag.get_text().strip() == "Nama:":
                if b_tag.next_sibling:
                    names.append(str(b_tag.next_sibling).strip())
                    
        wetons = []
        for b_tag in soup.find_all("b"):
            if b_tag.get_text().strip() == "Hari Lahir:":
                i_tag = b_tag.find_next("i")
                if i_tag:
                    wetons.append(i_tag.get_text().strip())
                    
        person1 = {}
        person2 = {}
        if len(names) >= 2 and len(wetons) >= 2:
            person1 = {"nama": names[0], "tgl_lahir": wetons[0]}
            person2 = {"nama": names[1], "tgl_lahir": wetons[1]}
            
        hasil_header = ""
        for b_tag in soup.find_all("b"):
            if "HASILNYA MENURUT" in b_tag.get_text():
                hasil_header = b_tag.get_text().strip()
                break
                
        petung_results = []
        for b_tag in soup.find_all("b"):
            i_tag = b_tag.find("i")
            if i_tag and ("Patemon" in i_tag.get_text() or "I." in i_tag.get_text() or "II." in i_tag.get_text()):
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
                "hasil_header": hasil_header,
                "petung": petung_results,
                "catatan": advice
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Error occurred: {str(e)}"}
