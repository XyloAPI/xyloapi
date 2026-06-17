import base64
import requests
from bs4 import BeautifulSoup

def calculate_hash(url: str, salt: str = "aio-dl") -> str:
    url_b64 = base64.b64encode(url.encode("utf-8")).decode("utf-8")
    salt_b64 = base64.b64encode(salt.encode("utf-8")).decode("utf-8")
    length_part = str(len(url) + 1000)
    return f"{url_b64}{length_part}{salt_b64}"

def download_douyin(payload):
    url = payload.get("url") or payload.get("URLT") or payload.get("image")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }

    session = requests.Session()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        # 1. Fetch main page to establish cookies and get token
        resp = session.get("https://snapdouyin.app/", headers=headers, timeout=15)
        if resp.status_code != 200:
            return {
                "success": False,
                "error": f"Douyin Downloader failed to reach home page: {resp.status_code}"
            }
            
        soup = BeautifulSoup(resp.text, "html.parser")
        token_input = soup.find("input", id="token")
        if not token_input or not token_input.get("value"):
            return {
                "success": False,
                "error": "Douyin Downloader: CSRF token not found on home page."
            }
            
        token = token_input.get("value")
        computed_hash = calculate_hash(url)
        
        # 2. Post to api endpoint
        api_url = "https://snapdouyin.app/wp-json/mx-downloader/video-data/"
        post_headers = headers.copy()
        post_headers["Content-Type"] = "application/x-www-form-urlencoded"
        post_headers["Origin"] = "https://snapdouyin.app"
        post_headers["Referer"] = "https://snapdouyin.app/"
        post_headers["X-Requested-With"] = "XMLHttpRequest"
        
        data = {
            "url": url,
            "token": token,
            "hash": computed_hash
        }
        
        resp_api = session.post(api_url, data=data, headers=post_headers, timeout=25)
        if resp_api.status_code != 200:
            return {
                "success": False,
                "error": f"Douyin Downloader API connection failed: {resp_api.status_code}"
            }
            
        res_json = resp_api.json()
        if "error" in res_json or not res_json.get("medias"):
            err_msg = res_json.get("error") or "Failed to parse Douyin download links."
            return {
                "success": False,
                "error": f"Douyin Downloader Error: {err_msg}"
            }
            
        title = res_json.get("title", "").strip() or "Douyin Video"
        cover = res_json.get("thumbnail", "")
        medias = res_json.get("medias") or []
        
        links = []
        for media in medias:
            media_url = media.get("url")
            if not media_url:
                continue
                
            if media_url.startswith("http://"):
                media_url = "https://" + media_url[7:]
                
            quality = media.get("quality", "").upper()
            ext = media.get("extension", "").upper()
            size_str = media.get("formattedSize") or ""
            
            label = f"DOWNLOAD {ext} ({quality})"
            if size_str:
                label += f" ({size_str})"
                
            links.append({
                "label": label,
                "url": media_url
            })
            
        if cover.startswith("http://"):
            cover = "https://" + cover[7:]
            
        return {
            "success": True,
            "data": {
                "title": title[:100],
                "creator": "Douyin User",
                "description": title,
                "cover": cover,
                "links": links
            }
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Douyin Downloader Error: {str(e)}"
        }

if __name__ == "__main__":
    test_url = "https://www.douyin.com/video/7256984651137289483"
    res = download_douyin({"url": test_url})
    import json
    print(json.dumps(res, indent=2))
