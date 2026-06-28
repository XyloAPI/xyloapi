import requests
from bs4 import BeautifulSoup

def get_shio(payload):
    shio = payload.get("shio")
    if not shio:
        return {"success": False, "error": "Parameter 'shio' is required"}

    shio_lower = shio.strip().lower()
    valid_shio = ["tikus", "kerbau", "macan", "kelinci", "naga", "ular", "kuda", "kambing", "monyet", "ayam", "anjing", "babi"]

    if shio_lower not in valid_shio:
        return {"success": False, "error": f"Invalid shio name. Choose one of: {', '.join(valid_shio)}"}

    url = f"https://www.primbon.com/shio/{shio_lower}.htm"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers, timeout=20)
        if response.status_code != 200:
            return {"success": False, "error": f"Failed to fetch from Primbon (HTTP {response.status_code})"}

        soup = BeautifulSoup(response.content, "html.parser")
        body_div = soup.find("div", id="body")
        if not body_div:
            return {"success": False, "error": "Failed to parse result from Primbon"}

        # Extract title
        title_tag = body_div.find("h1")
        title = title_tag.get_text().strip() if title_tag else f"SHIO {shio_lower.upper()}"

        # Extract paragraphs
        paragraphs = []
        for content in body_div.contents:
            if not content.name:
                txt = str(content).strip()
                if txt and "BEGIN: CONTENT" not in txt and "END: CONTENT" not in txt:
                    paragraphs.append(txt)
            elif content.name not in ["a", "script", "style", "h1", "br"]:
                txt = content.get_text().strip()
                if txt and "BEGIN: CONTENT" not in txt and "END: CONTENT" not in txt:
                    paragraphs.append(txt)

        # Remove duplicate titles or back links
        paragraphs = [p.replace("\xa0", " ").strip() for p in paragraphs if p]
        paragraphs = [p for p in paragraphs if p and not p.startswith("<<<") and p != title]

        return {
            "success": True,
            "data": {
                "shio": title,
                "penjelasan": paragraphs
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Error occurred: {str(e)}"}
