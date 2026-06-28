import requests
from bs4 import BeautifulSoup

def get_ramalan_cinta(payload):
    nama1 = payload.get("nama1")
    tanggal1 = payload.get("tanggal1") or payload.get("tgl1")
    bulan1 = payload.get("bulan1") or payload.get("bln1")
    tahun1 = payload.get("tahun1") or payload.get("thn1")
    nama2 = payload.get("nama2")
    tanggal2 = payload.get("tanggal2") or payload.get("tgl2")
    bulan2 = payload.get("bulan2") or payload.get("bln2")
    tahun2 = payload.get("tahun2") or payload.get("thn2")
    
    if not all([nama1, tanggal1, bulan1, tahun1, nama2, tanggal2, bulan2, tahun2]):
        return {
            "success": False, 
            "error": "All parameters (nama1, tanggal1, bulan1, tahun1, nama2, tanggal2, bulan2, tahun2) are required."
        }
    
    url = "https://www.primbon.com/ramalan_cinta.php"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {
        "nama1": nama1,
        "tanggal1": str(tanggal1),
        "bulan1": str(bulan1),
        "tahun1": str(tahun1),
        "nama2": nama2,
        "tanggal2": str(tanggal2),
        "bulan2": str(bulan2),
        "tahun2": str(tahun2),
        "submit": " Submit! "
    }
    
    try:
        response = requests.post(url, headers=headers, data=data, timeout=30)
        if response.status_code != 200:
            return {"success": False, "error": f"Failed to fetch data from Primbon (HTTP {response.status_code})"}
            
        soup = BeautifulSoup(response.content, "html.parser")
        
        body_div = soup.find("div", {"id": "body"})
        if not body_div:
            return {"success": False, "error": "Unable to find main body in Primbon response."}
            
        b_tags = body_div.find_all("b")
        names_list = []
        positives = ""
        negatives = ""
        
        for b in b_tags:
            txt = b.get_text().strip()
            if txt.startswith("Sisi Positif Anda"):
                positives = str(b.next_sibling).strip().strip(":").strip() if b.next_sibling else ""
            elif txt.startswith("Sisi Negatif Anda"):
                negatives = str(b.next_sibling).strip().strip(":").strip() if b.next_sibling else ""
            elif txt not in ["RAMALAN CINTA", "Membaca Ramalan Percintaan Anda", "Melihat Tingkat Kecocokan Cinta", "Menilai Sisi Positif dan Negatif dalam Hubungan", "Mengapa Memilih Ramalan Cinta Berdasarkan Numerologi?", "Bagaimana Memulai?", "Tips Menggunakan Ramalan Cinta Numerologi dengan Bijak"]:
                if b.find_parent("h1") or b.find_parent("u") or b.find_parent("li"):
                    continue
                nxt = b.next_sibling
                while nxt and nxt.name == "br":
                    nxt = nxt.next_sibling
                if nxt and "Tgl. Lahir" in str(nxt):
                    date_val = str(nxt).replace("Tgl. Lahir :", "").strip()
                    if "<!--" in date_val:
                        date_val = date_val.split("<!--")[0].strip()
                    names_list.append({
                        "nama": txt,
                        "tgl_lahir": date_val
                    })
                    
        person1 = names_list[0] if len(names_list) >= 1 else {}
        person2 = names_list[1] if len(names_list) >= 2 else {}
        
        prediction = ""
        negative_b = None
        for b in b_tags:
            if b.get_text().strip().startswith("Sisi Negatif Anda"):
                negative_b = b
                break
                
        if negative_b:
            curr = negative_b.next_sibling
            while curr:
                if curr.name == "table" or (curr.name == "a" and "button" in curr.get("class", [])):
                    break
                if isinstance(curr, str):
                    txt = curr.strip()
                    if txt and not txt.startswith(":") and len(txt) > 20:
                        prediction = txt
                curr = curr.next_sibling
                
        return {
            "success": True,
            "data": {
                "person1": person1,
                "person2": person2,
                "positif": positives,
                "negatif": negatives,
                "catatan": prediction
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Error occurred: {str(e)}"}
