import re
from curl_cffi import requests

def normalize_text(value):
    return re.sub(r'\s+', ' ', str(value or '')).strip()

def search_github(payload):
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
        url = "https://api.github.com/search/repositories"
        params = {
            "q": normalized_query,
            "sort": "stars",
            "order": "desc",
            "per_page": 15
        }
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
            "Accept": "application/vnd.github+json"
        }
        
        session = requests.Session()
        resp = session.get(url, params=params, headers=headers, impersonate="chrome", timeout=15)
        resp.raise_for_status()
        data = resp.json()
        
        items = data.get("items", [])
        if not items:
            return {
                "success": False,
                "error": f"Pencarian GitHub tidak membuahkan hasil untuk '{normalized_query}'."
            }
            
        formatted_results = []
        for item in items:
            owner = item.get("owner") or {}
            owner_name = normalize_text(owner.get("login")) or "Unknown"
            repo_desc = normalize_text(item.get("description")) or "Tidak ada deskripsi"
            lang = normalize_text(item.get("language")) or "Unknown"
            
            formatted_results.append({
                "id": str(item.get("id") or ""),
                "title": normalize_text(item.get("full_name")) or "Unknown Repo",
                "description": f"Language: {lang} | ⭐️ {item.get('stargazers_count', 0):,} | 🍴 {item.get('forks_count', 0):,}\n\n{repo_desc}",
                "image": owner.get("avatar_url") or "",
                "url": item.get("html_url") or "",
                "views": f"{item.get('stargazers_count', 0):,} stars",
                "published": normalize_text(item.get("updated_at")[:10]) if item.get("updated_at") else "",
                "creator": {
                    "name": owner_name,
                    "username": owner_name
                }
            })
            
        return {
            "success": True,
            "query": normalized_query,
            "total": data.get("total_count", len(formatted_results)),
            "results": formatted_results,
            "data": formatted_results
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Terjadi kesalahan pada pencarian GitHub: {str(e)}"
        }
