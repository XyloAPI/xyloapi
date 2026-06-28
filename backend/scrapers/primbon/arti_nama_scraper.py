import requests
from bs4 import BeautifulSoup

def get_arti_nama(payload):
    nama = payload.get("nama") or payload.get("query")
    if not nama:
        return {"success": False, "error": "Parameter 'nama' is required"}

    url = "https://www.primbon.com/arti_nama.php"
    params = {
        "nama1": nama,
        "proses": " Submit! "
    }
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, params=params, headers=headers, timeout=30)
        if response.status_code != 200:
            return {"success": False, "error": f"Failed to fetch data from Primbon (HTTP {response.status_code})"}

        soup = BeautifulSoup(response.content, "html.parser")
        body_div = soup.find("div", id="body")
        if not body_div:
            return {"success": False, "error": "Failed to parse result from Primbon"}

        # Copy soup to not mutate original
        soup_copy = BeautifulSoup(str(body_div), "html.parser")
        body_div_copy = soup_copy.find("div", id="body")
        
        for br in body_div_copy.find_all("br"):
            br.replace_with("\n")
            
        full_text = body_div_copy.get_text()
        
        start_token = "ARTI NAMA"
        end_token = "Nama:"
        
        if start_token in full_text:
            content_part = full_text.split(start_token, 1)[1]
            if end_token in content_part:
                content_part = content_part.split(end_token, 1)[0]
                
            lines = [l.strip() for l in content_part.split("\n") if l.strip()]
            
            meaning = ""
            description = ""
            
            meaning_idx = -1
            for i, line in enumerate(lines):
                if "memiliki arti:" in line:
                    meaning_idx = i
                    parts = line.split("memiliki arti:", 1)
                    meaning = parts[1].strip().strip(".").strip()
                    break
            
            if meaning_idx != -1:
                desc_lines = lines[meaning_idx + 1:]
                filtered_desc_lines = []
                for line in desc_lines:
                    if line.startswith("ARTI NAMA") or line.startswith("Nama:"):
                        break
                    filtered_desc_lines.append(line)
                description = " ".join(filtered_desc_lines).strip()
                
            if not meaning:
                return {"success": False, "error": "No meaning found for the given name"}

            return {
                "success": True,
                "data": {
                    "nama": nama,
                    "arti": meaning,
                    "catatan": description
                }
            }
            
        return {"success": False, "error": "Failed to extract name meaning"}
    except Exception as e:
        return {"success": False, "error": f"Error occurred: {str(e)}"}
