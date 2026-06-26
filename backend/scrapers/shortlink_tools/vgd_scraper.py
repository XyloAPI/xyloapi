from curl_cffi import requests as curl_requests
import requests
import time

def get_vgd_url(payload):
    try:
        url = payload.get("url") or payload.get("link") or ""
        if isinstance(url, list):
            url = url[0] if url else ""
            
        if not url:
            return {"success": False, "error": "Missing required parameter: url or link"}

        api_url = f"https://v.gd/create.php?format=simple&url={requests.utils.quote(url)}"

        # 1. Try to bypass Cloudflare using Nexray API first
        try:
            bypass_url = "https://api.nexray.eu.cc/tools/bypass/cf"
            r = curl_requests.post(bypass_url, json={
                "url": api_url,
                "mode": "waf-session"
            }, timeout=25)
            
            if r.status_code == 200:
                data = r.json()
                if data.get("status"):
                    short_url = data.get("result", "").strip()
                    if short_url.startswith("http://") or short_url.startswith("https://"):
                        return {
                            "success": True,
                            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
                            "data": {
                                "short": short_url,
                                "original": url
                            }
                        }
        except Exception:
            pass

        # 2. Fallback to direct request using curl_cffi
        r = curl_requests.get(api_url, impersonate="chrome120", timeout=15)
        if r.status_code != 200:
            return {"success": False, "error": f"v.gd API returned status code {r.status_code}: {r.text}"}
        
        short_url = r.text.strip()
        if not short_url.startswith("http://") and not short_url.startswith("https://"):
            return {"success": False, "error": f"Invalid response received from v.gd: {short_url}"}

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
