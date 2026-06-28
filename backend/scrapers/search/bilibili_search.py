import re
import json
import subprocess
import urllib.parse
from curl_cffi import requests

def normalize_text(value):
    return re.sub(r'\s+', ' ', str(value or '')).strip()

def search_bilibili(payload):
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
        url = f"https://www.bilibili.tv/id/search-result?q={urllib.parse.quote(normalized_query)}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9"
        }
        
        session = requests.Session()
        resp = session.get(url, headers=headers, impersonate="chrome", timeout=15)
        resp.raise_for_status()
        html = resp.text
        
        match = re.search(r'window\.__initialState\s*=\s*(.*?)</script>', html, re.DOTALL)
        if not match:
            return {
                "success": False,
                "error": "Video tidak ditemukan di Bilibili."
            }
            
        raw_state = match.group(1).strip()
        
        # Evaluate using node subprocess
        js_eval_code = f"console.log(JSON.stringify({raw_state}));"
        res = subprocess.run(
            ["node", "-e", js_eval_code],
            capture_output=True,
            text=True,
            encoding="utf-8",
            timeout=10
        )
        
        if res.returncode != 0:
            return {
                "success": False,
                "error": f"Gagal mengevaluasi data Bilibili: {res.stderr}"
            }
            
        data = json.loads(res.stdout)
        
        search_all = data.get("searchAll", {}) or {}
        all_list = search_all.get("allList", []) or []
        
        ugc_section = None
        for item in all_list:
            if item.get("type") == "ugc":
                ugc_section = item
                break
                
        items = ugc_section.get("items", []) if ugc_section else []
        if not items:
            return {
                "success": False,
                "error": "Video tidak ditemukan di Bilibili."
            }
            
        formatted_results = []
        for item in items:
            title = item.get("title") or "Bilibili Video"
            aid = item.get("aid")
            url = f"https://www.bilibili.tv/id/video/{aid}" if aid else ""
            author_name = item.get("author", {}).get("nickname") or "Bilibili Creator"
            
            cover_url = item.get("cover") or ""
            if "@" in cover_url:
                cover_url = cover_url.split("@")[0]
                
            formatted_results.append({
                "id": str(aid or ""),
                "title": title,
                "description": f"Views: {item.get('view') or '0'}\nAuthor: {author_name}",
                "image": cover_url,
                "url": url,
                "duration": item.get("duration") or "",
                "views": item.get("view") or "0",
                "published": "",
                "type": "video",
                "creator": {
                    "name": author_name,
                    "username": author_name
                }
            })
            
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
            "error": f"Terjadi kesalahan pada sistem pencarian: {str(e)}"
        }
