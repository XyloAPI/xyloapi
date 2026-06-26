import requests
import time

def get_short_url(payload):
    try:
        url = payload.get("url") or payload.get("link") or ""
        if isinstance(url, list):
            url = url[0] if url else ""
            
        if not url:
            return {"success": False, "error": "Missing required parameter: url or link"}

        api_url = f"https://tinyurl.com/api-create.php?url={requests.utils.quote(url)}"

        session = requests.Session()
        session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        })

        r = session.get(api_url, timeout=15)
        if r.status_code != 200:
            return {"success": False, "error": f"TinyURL API returned status code {r.status_code}"}
        
        short_url = r.text.strip()
        if not short_url.startswith("http://") and not short_url.startswith("https://"):
            return {"success": False, "error": f"Invalid response received from TinyURL: {short_url}"}

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
