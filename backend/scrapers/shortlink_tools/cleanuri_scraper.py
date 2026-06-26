import requests
import time

def get_cleanuri_url(payload):
    try:
        url = payload.get("url") or payload.get("link") or ""
        if isinstance(url, list):
            url = url[0] if url else ""
            
        if not url:
            return {"success": False, "error": "Missing required parameter: url or link"}

        api_url = "https://cleanuri.com/api/v1/shorten"

        session = requests.Session()
        session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Content-Type": "application/x-www-form-urlencoded"
        })

        r = session.post(api_url, data={"url": url}, timeout=15)
        if r.status_code != 200:
            try:
                err_data = r.json()
                error_msg = err_data.get("error") or "Failed to shorten URL via CleanURI"
            except Exception:
                error_msg = r.text.strip() or "Failed to shorten URL via CleanURI"
            return {"success": False, "error": f"CleanURI API returned status code {r.status_code}: {error_msg}"}
        
        data = r.json()
        short_url = data.get("result_url")
        if not short_url:
            return {"success": False, "error": "Short URL missing from CleanURI response"}

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
