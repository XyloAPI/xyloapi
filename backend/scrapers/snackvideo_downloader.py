import base64
import requests
from bs4 import BeautifulSoup

def decode_snackvideo_url(url: str) -> str:
    if not url:
        return ""
    
    parts = url.split("getsnackvideo/")
    if len(parts) <= 1:
        return url
        
    base64_part = parts[1]
    
    # Strip m/ or p/ prefixes
    if base64_part.startswith("m/"):
        base64_part = base64_part[2:]
    elif base64_part.startswith("p/"):
        base64_part = base64_part[2:]
        
    # Strip any query parameters
    base64_part = base64_part.split("?")[0]
    
    try:
        # Pad base64 string
        missing_padding = len(base64_part) % 4
        if missing_padding:
            base64_part += '=' * (4 - missing_padding)
            
        decoded = base64.b64decode(base64_part).decode("utf-8", errors="ignore")
        
        # Check for recursive base64 encoding (e.g. getsnackvideo/p/...)
        if "getsnackvideo/p/" in decoded:
            sub_part = decoded.split("getsnackvideo/p/")[1]
            # Strip any query parameters in sub part
            sub_part = sub_part.split("?")[0]
            sub_missing = len(sub_part) % 4
            if sub_missing:
                sub_part += '=' * (4 - sub_missing)
            decoded = base64.b64decode(sub_part).decode("utf-8", errors="ignore")
            
        if decoded.startswith("http://"):
            decoded = "https://" + decoded[7:]
            
        return decoded
    except Exception:
        if url.startswith("http://"):
            return "https://" + url[7:]
        return url

def download_snackvideo(payload):
    url = payload.get("url") or payload.get("URLT") or payload.get("image")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }

    session = requests.Session()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Origin": "https://getsnackvideo.com",
        "Referer": "https://getsnackvideo.com/id"
    }

    try:
        # 1. Fetch main page to establish cookies
        session.get("https://getsnackvideo.com/id", headers=headers, timeout=10)
        
        # 2. Post to results endpoint
        post_headers = headers.copy()
        post_headers["Content-Type"] = "application/x-www-form-urlencoded"
        
        data = {
            "id": url,
            "locale": "id"
        }
        
        resp = session.post("https://getsnackvideo.com/results", data=data, headers=post_headers, timeout=20)
        
        if resp.status_code != 200:
            return {
                "success": False,
                "error": f"SnackVideo Downloader connection failed with status: {resp.status_code}"
            }
            
        soup = BeautifulSoup(resp.text, "html.parser")
        
        # 3. Parse download blocks
        blocks = soup.find_all("div", class_="download-block")
        if not blocks:
            # Check if there is an error message on the page
            err_alert = soup.find("div", class_="alert-danger") or soup.find("div", class_="error")
            err_msg = err_alert.text.strip() if err_alert else "Failed to parse video download links."
            return {
                "success": False,
                "error": f"SnackVideo Downloader Error: {err_msg}"
            }
            
        # Parse description from parent of download blocks
        description = ""
        parent = blocks[0].parent
        texts = [str(c).strip() for c in parent.contents if not c.name and str(c).strip()]
        if texts:
            description = " ".join(texts)
            
        title = description or "SnackVideo"
        
        links = []
        cover = ""
        
        for block in blocks:
            text = block.text.strip().lower()
            for a in block.find_all("a"):
                raw_href = a.get("href")
                if not raw_href:
                    continue
                decoded_href = decode_snackvideo_url(raw_href)
                
                if "tanpa tanda air" in text or "without watermark" in text or "hd" in text:
                    links.append({
                        "label": "DOWNLOAD VIDEO (HD)",
                        "url": decoded_href
                    })
                elif "mp3" in text or "music" in text or "audio" in text:
                    links.append({
                        "label": "DOWNLOAD AUDIO (MP3)",
                        "url": decoded_href
                    })
                elif "thumbnail" in text or "cover" in text:
                    cover = decoded_href
                    links.append({
                        "label": "DOWNLOAD THUMBNAIL (COVER)",
                        "url": decoded_href
                    })
                    
        return {
            "success": True,
            "data": {
                "title": title[:100] if title else "SnackVideo Post",
                "creator": "SnackVideo User",
                "description": description,
                "cover": cover,
                "links": links
            }
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"SnackVideo Downloader Error: {str(e)}"
        }

if __name__ == "__main__":
    test_url = "https://s.snackvideo.com/p/dwlMd51U"
    res = download_snackvideo({"url": test_url})
    import json
    print(json.dumps(res, indent=2))
