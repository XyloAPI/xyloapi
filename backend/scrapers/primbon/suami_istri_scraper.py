import requests
from bs4 import BeautifulSoup

def get_suami_istri(payload):
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
    
    url = "https://www.primbon.com/suami_istri.php"
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
            if b_tag.get_text().strip() in ["Suami:", "Istri:"]:
                if b_tag.next_sibling:
                    names.append(str(b_tag.next_sibling).strip())
                    
        wetons = []
        for b_tag in soup.find_all("b"):
            if b_tag.get_text().strip() in ["Suami:", "Istri:"]:
                i_tag = b_tag.find_next("i")
                if i_tag and "Tgl. Lahir:" in i_tag.get_text():
                    wetons.append(i_tag.get_text().replace("Tgl. Lahir:", "").strip())
                    
        person1 = {}
        person2 = {}
        if len(names) >= 2 and len(wetons) >= 2:
            person1 = {"nama": names[0], "tgl_lahir": wetons[0]}
            person2 = {"nama": names[1], "tgl_lahir": wetons[1]}
            
        hasil_header = ""
        for b_tag in soup.find_all("b"):
            if "HASIL RAMALAN MENURUT" in b_tag.get_text():
                hasil_header = b_tag.get_text().strip()
                break
                
        petung_results = []
        target_table = None
        for table in soup.find_all("table"):
            if "Thn" in table.get_text():
                target_table = table
                break
                
        if target_table:
            for tr in target_table.find_all("tr"):
                tds = tr.find_all("td")
                if len(tds) >= 3:
                    range_val = tds[0].get_text().strip()
                    meaning_val = tds[2].get_text().strip()
                    petung_results.append({
                        "range": range_val,
                        "meaning": meaning_val
                    })
                    
        advice = ""
        body_div = soup.find("div", {"id": "body"})
        if body_div:
            text_content = body_div.get_text()
            if "Hasil ramalan tentu saja ada yang baik" in text_content:
                part = text_content.split("Hasil ramalan tentu saja ada yang baik", 1)[1]
                advice = "Hasil ramalan tentu saja ada yang baik" + part.split("\n\n", 1)[0].split("*Jangan", 1)[0]
                advice = advice.strip()
                
        return {
            "success": True,
            "data": {
                "person1": person1,
                "person2": person2,
                "hasil_header": hasil_header,
                "hasil": petung_results,
                "catatan": advice
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Error occurred: {str(e)}"}
