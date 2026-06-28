import re
import urllib.parse
from bs4 import BeautifulSoup
from curl_cffi import requests

SITE_URL = "https://commons.wikimedia.org"

def normalize_text(value):
    return re.sub(r'\s+', ' ', str(value or '')).strip()

def absolute_url(value):
    val = normalize_text(value)
    if not val:
        return ""
    if val.startswith("//"):
        val = f"https:{val}"
    try:
        val = urllib.parse.urljoin(SITE_URL, val)
    except Exception:
        pass
        
    # Convert Wikimedia thumbnail to high-resolution original image
    # Example: https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Province_Flag_Map_Indonesia_Map.png/500px-Province_Flag_Map_Indonesia_Map.png
    if "/thumb/" in val:
        temp = val.replace("/thumb/", "/")
        parts = temp.split("/")
        last_part = parts[-1]
        if re.match(r'^\d+px-', last_part):
            return "/".join(parts[:-1])
        return temp
        
    return val

def search_wikimedia(payload):
    query = payload.get("query") or payload.get("q") or payload.get("text")
    if not query:
        return {
            "success": False,
            "error": "Parameter 'query' atau 'text' wajib diisi."
        }

    normalized_query = normalize_text(query)
    if not normalized_query:
        return {
            "success": False,
            "error": "Parameter 'query' atau 'text' wajib diisi."
        }

    try:
        url = f"{SITE_URL}/w/index.php"
        params = {
            "search": normalized_query,
            "title": "Special:MediaSearch",
            "go": "Go",
            "type": "image"
        }
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
            "Referer": SITE_URL
        }
        
        session = requests.Session()
        resp = session.get(url, params=params, headers=headers, impersonate="chrome", timeout=20)
        resp.raise_for_status()
        html = resp.text
        
        soup = BeautifulSoup(html, "html.parser")
        items = soup.select(".sdms-search-results__list-wrapper > div > a")
        
        formatted_results = []
        for element in items:
            img = element.find("img")
            title = normalize_text(img.get("alt") if img else "")
            page_url = absolute_url(element.get("href"))
            
            thumb_attr = img.get("data-src") or img.get("src") if img else ""
            image_url = absolute_url(thumb_attr)
            
            if not title or not page_url or not image_url:
                continue
                
            formatted_results.append({
                "id": page_url.split(":")[-1] if ":" in page_url else "",
                "title": title,
                "description": f"Wikimedia Commons page: {title}",
                "image": image_url,
                "url": page_url,
                "type": "wikimedia",
                "creator": {
                    "name": "Wikimedia Commons",
                    "username": "wikimedia"
                }
            })
            
        if not formatted_results:
            return {
                "success": False,
                "error": f"Pencarian Wikimedia tidak membuahkan hasil untuk '{normalized_query}'."
            }
            
        return {
            "success": True,
            "query": normalized_query,
            "total": len(formatted_results),
            "results": formatted_results,
            "data": formatted_results
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Terjadi kesalahan pada pencarian Wikimedia: {str(e)}"
        }
