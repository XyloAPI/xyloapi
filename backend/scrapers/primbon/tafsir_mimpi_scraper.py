import requests
from bs4 import BeautifulSoup

def get_tafsir_mimpi(payload):
    mimpi = payload.get("mimpi") or payload.get("query")
    if not mimpi:
        return {"success": False, "error": "Parameter 'mimpi' is required"}
    
    url = "https://www.primbon.com/tafsir_mimpi.php"
    params = {
        "mimpi": mimpi,
        "submit": " Submit "
    }
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"
    }
    try:
        response = requests.get(url, params=params, headers=headers, timeout=30)
        if response.status_code != 200:
            return {"success": False, "error": f"Failed to fetch data from Primbon (HTTP {response.status_code})"}
        
        soup = BeautifulSoup(response.content, "html.parser")
        
        body_text = soup.get_text()
        if "Tidak ditemukan tafsir mimpi" in body_text:
            return {
                "success": True,
                "data": {
                    "mimpi": mimpi,
                    "hasil": [],
                    "message": f"Tidak ditemukan tafsir mimpi '{mimpi}'"
                }
            }
            
        results = []
        target_i = None
        for tag in soup.find_all("i"):
            if "Hasil pencarian untuk kata kunci:" in tag.get_text():
                target_i = tag
                break
                
        if target_i:
            parent = target_i.parent.parent
            for br in parent.find_all("br"):
                br.replace_with("\n")
                
            full_text = parent.get_text()
            start_token = "Hasil pencarian untuk kata kunci:"
            end_token = "Solusi -"
            
            if start_token in full_text:
                content_part = full_text.split(start_token, 1)[1]
                if end_token in content_part:
                    content_part = content_part.split(end_token, 1)[0]
                    
                lines = [l.strip() for l in content_part.split("\n") if l.strip()]
                # Skip the search query line if it's the first one
                if lines and (lines[0].startswith(mimpi) or lines[0].lower() == mimpi.lower()):
                    lines = lines[1:]
                    
                for line in lines:
                    line = line.strip()
                    if "=" in line:
                        mimpi_val, arti_val = line.split("=", 1)
                        results.append({
                            "mimpi": mimpi_val.strip(),
                            "arti": arti_val.strip()
                        })
                    elif line.startswith("Mimpi"):
                        results.append({
                            "mimpi": line,
                            "arti": ""
                        })
                        
        return {
            "success": True,
            "data": {
                "mimpi": mimpi,
                "hasil": results
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Error occurred: {str(e)}"}
