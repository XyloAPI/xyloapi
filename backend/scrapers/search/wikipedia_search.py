import re
import urllib.parse
from curl_cffi import requests
from bs4 import BeautifulSoup

DEFAULT_LANG = "id"

def normalize_text(value):
    return re.sub(r'\s+', ' ', str(value or '')).strip()

def get_lang(raw_lang):
    lang = normalize_text(raw_lang or DEFAULT_LANG).lower()
    if re.match(r'^[a-z-]{2,12}$', lang):
        return lang
    return DEFAULT_LANG

def absolute_url(value):
    normalized = normalize_text(value)
    if not normalized:
        return ""
    if normalized.startswith("//"):
        normalized = f"https:{normalized}"
    
    # Convert Wikipedia thumbnail to high-resolution original image
    # Example: https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Indonesia.svg/60px-Flag_of_Indonesia.svg.png
    if "/thumb/" in normalized:
        temp = normalized.replace("/thumb/", "/")
        parts = temp.split("/")
        last_part = parts[-1]
        if re.match(r'^\d+px-', last_part):
            return "/".join(parts[:-1])
        return temp
        
    return normalized

def strip_html(html_str):
    if not html_str:
        return ""
    try:
        soup = BeautifulSoup(f"<div>{html_str}</div>", "html.parser")
        return normalize_text(soup.get_text())
    except Exception:
        return normalize_text(html_str)

def search_wikipedia(payload):
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

    lang_code = payload.get("lang") or payload.get("langCode") or DEFAULT_LANG
    lang = get_lang(lang_code)

    limit = payload.get("limit", 20)
    try:
        limit = int(limit)
    except Exception:
        limit = 20

    try:
        url = f"https://{lang}.wikipedia.org/w/rest.php/v1/search/page"
        params = {
            "q": normalized_query,
            "limit": limit
        }
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
            "Accept-Language": f"{lang},en;q=0.9,id;q=0.8",
            "Referer": f"https://{lang}.wikipedia.org/"
        }
        
        session = requests.Session()
        resp = session.get(url, params=params, headers=headers, impersonate="chrome", timeout=15)
        resp.raise_for_status()
        data = resp.json()
        
        pages = data.get("pages", []) if isinstance(data, dict) else []
        if not pages:
            return {
                "success": False,
                "error": f"Pencarian Wikipedia ({lang}) tidak membuahkan hasil untuk '{normalized_query}'."
            }
            
        formatted_results = []
        for page in pages:
            title = normalize_text(page.get("title"))
            key = page.get("key")
            page_url = f"https://{lang}.wikipedia.org/wiki/{urllib.parse.quote(key)}" if key else ""
            
            if not title or not page_url:
                continue
                
            excerpt = strip_html(page.get("excerpt"))
            desc = normalize_text(page.get("description"))
            
            thumbnail = page.get("thumbnail") or {}
            image_url = absolute_url(thumbnail.get("url"))
            
            full_description = desc
            if excerpt:
                if full_description:
                    full_description += f"\n\n{excerpt}"
                else:
                    full_description = excerpt
            
            formatted_results.append({
                "id": str(page.get("id") or ""),
                "title": title,
                "description": full_description,
                "image": image_url,
                "url": page_url,
                "excerpt": excerpt,
                "type": "wikipedia",
                "creator": {
                    "name": f"Wikipedia ({lang.upper()})",
                    "username": "wikipedia"
                }
            })
            
        if not formatted_results:
            return {
                "success": False,
                "error": f"Pencarian Wikipedia ({lang}) tidak membuahkan hasil untuk '{normalized_query}'."
            }
            
        return {
            "success": True,
            "query": normalized_query,
            "lang": lang,
            "total": len(formatted_results),
            "results": formatted_results,
            "data": formatted_results
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Terjadi kesalahan pada pencarian Wikipedia: {str(e)}"
        }
