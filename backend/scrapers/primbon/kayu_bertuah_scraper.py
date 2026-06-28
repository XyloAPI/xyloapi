import requests
from bs4 import BeautifulSoup
import re

def get_kayu_bertuah(payload):
    kayu_param = payload.get("kayu", "").strip().lower()
    if not kayu_param:
        return {"success": False, "error": "Parameter 'kayu' is required"}

    url = "https://www.primbon.com/kayu_bertuah.htm"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers, timeout=20)
        if response.status_code != 200:
            return {"success": False, "error": f"Failed to fetch from Primbon (HTTP {response.status_code})"}

        html_decoded = response.content.decode('utf-8', errors='replace')
        soup = BeautifulSoup(html_decoded, "html.parser")
        body_div = soup.find("div", id="body")
        if not body_div:
            return {"success": False, "error": "Failed to parse result from Primbon"}

        woods = []
        current_wood = None

        def slugify(text):
            text = text.lower()
            text = re.sub(r'[^a-z0-9\s-]', '', text)
            text = re.sub(r'[\s-]+', '-', text)
            return text.strip('-')

        for item in body_div.contents:
            if not item:
                continue
            
            if item.name in ["b", "strong"]:
                text = item.get_text().strip()
                if re.match(r'^\d+\.', text) or text in ["12. Minging", "13. Cendana", "15. Dewadaru"]:
                    if current_wood:
                        woods.append(current_wood)
                    
                    clean_title = re.sub(r'^\d+\.\s*', '', text).strip()
                    clean_title = clean_title.replace('\ufffd', '').replace('lHerit', "l'Herit")
                    
                    current_wood = {
                        "nama": clean_title,
                        "deskripsi": []
                    }
            elif current_wood:
                txt = item.get_text().strip() if item.name else str(item).strip()
                if item.name not in ["script", "style", "a", "br", "h1"]:
                    txt_clean = txt.replace("\xa0", " ").strip()
                    txt_clean = txt_clean.replace('\ufffd', '').replace('lHerit', "l'Herit")
                    if txt_clean and "BEGIN: CONTENT" not in txt_clean and "END: CONTENT" not in txt_clean and "adsbygoogle" not in txt_clean:
                        if txt_clean != current_wood["nama"] and not re.match(r'^\d+\.', txt_clean):
                            current_wood["deskripsi"].append(txt_clean)

        if current_wood:
            woods.append(current_wood)

        valid_woods = []
        for idx, w in enumerate(woods):
            if w["nama"] and w["deskripsi"]:
                w["deskripsi"] = " ".join(w["deskripsi"])
                valid_woods.append({
                    "id": idx + 1,
                    "nama": w["nama"],
                    "slug": slugify(w["nama"]),
                    "deskripsi": w["deskripsi"]
                })

        # Match by index
        if kayu_param.isdigit():
            idx_val = int(kayu_param)
            matched = [w for w in valid_woods if w["id"] == idx_val]
            if matched:
                return {"success": True, "data": matched[0]}
        # Match by slug
        matched = [w for w in valid_woods if w["slug"] == kayu_param]
        if matched:
            return {"success": True, "data": matched[0]}
        # Match by partial name (replacing hyphens with space)
        kayu_search = kayu_param.replace("-", " ")
        matched = [w for w in valid_woods if kayu_search in w["nama"].lower()]
        if matched:
            return {"success": True, "data": matched[0]}

        return {"success": False, "error": f"Wood '{kayu_param}' not found."}
    except Exception as e:
        return {"success": False, "error": f"Error occurred: {str(e)}"}
