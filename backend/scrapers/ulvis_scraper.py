import requests
import time

def get_ulvis_url(payload):
    try:
        url = payload.get("url") or payload.get("link") or ""
        if isinstance(url, list):
            url = url[0] if url else ""
            
        if not url:
            return {"success": False, "error": "Missing required parameter: url or link"}

        api_url = f"https://ulvis.net/API/write/get?url={requests.utils.quote(url)}"

        session = requests.Session()
        session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        })

        r = session.get(api_url, timeout=15)
        if r.status_code != 200:
            return {"success": False, "error": f"ulvis.net API returned status code {r.status_code}: {r.text}"}
        
        data = r.json()
        if not data.get("success"):
            return {"success": False, "error": data.get("error", {}).get("msg") or "Failed to shorten URL via ulvis.net"}

        short_url = data.get("data", {}).get("url")
        if not short_url:
            return {"success": False, "error": "Short URL missing from ulvis.net response"}

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "short": short_url,
                "original": url
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Failed to shorten URL: {str(e)}"}
