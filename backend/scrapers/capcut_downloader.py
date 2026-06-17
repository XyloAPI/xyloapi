import requests

def download_capcut(payload):
    url = payload.get("url") or payload.get("URLT") or payload.get("image")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }

    api_url = "https://snapvideotools.com/id/api/snap"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "Origin": "https://snapvideotools.com",
        "Referer": "https://snapvideotools.com/id/capcut-downloader"
    }

    data = {
        "text": url
    }

    try:
        resp = requests.post(api_url, json=data, headers=headers, timeout=20)
        if resp.status_code != 200:
            return {
                "success": False,
                "error": f"CapCut Downloader connection failed with status: {resp.status_code}"
            }
            
        res_json = resp.json()
        if res_json.get("code") != 0 or not res_json.get("data"):
            err_msg = res_json.get("message") or "Failed to parse CapCut download links."
            return {
                "success": False,
                "error": f"CapCut Downloader Error: {err_msg}"
            }
            
        data_block = res_json["data"]
        title = data_block.get("title", "").strip() or "CapCut Video"
        cover = data_block.get("cover", "")
        
        media_urls = data_block.get("mediaUrls") or []
        links = []
        
        for idx, media in enumerate(media_urls):
            media_url = media.get("url")
            if not media_url:
                continue
            # Ensure HTTPS
            if media_url.startswith("http://"):
                media_url = "https://" + media_url[7:]
                
            label = f"DOWNLOAD VIDEO {idx + 1}"
            if idx == 0:
                label = "DOWNLOAD VIDEO (NO WATERMARK)"
            elif idx == 1:
                label = "DOWNLOAD VIDEO (WITH WATERMARK)"
                
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
                "creator": "CapCut User",
                "description": title,
                "cover": cover,
                "links": links
            }
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"CapCut Downloader Error: {str(e)}"
        }

if __name__ == "__main__":
    test_url = "https://www.capcut.com/tv2/ZSmm1R7Sd/"
    res = download_capcut({"url": test_url})
    import json
    print(json.dumps(res, indent=2))
