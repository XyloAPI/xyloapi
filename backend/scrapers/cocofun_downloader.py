import requests
from bs4 import BeautifulSoup

def download_cocofun(payload):
    url = payload.get("url") or payload.get("URLT") or payload.get("image")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }
        
    headers = {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8"
    }
    
    try:
        resp = requests.get(url, headers=headers, timeout=15)
        if resp.status_code != 200:
            return {
                "success": False,
                "error": f"CocoFun Downloader connection failed with status: {resp.status_code}"
            }
            
        soup = BeautifulSoup(resp.text, "html.parser")
        
        # Extract video URL
        video_url = ""
        meta_video = soup.find("meta", property="og:video")
        if meta_video:
            video_url = meta_video.get("content", "")
            
        if not video_url:
            source_tag = soup.find("source")
            if source_tag and source_tag.get("src"):
                video_url = source_tag.get("src")
                
        if not video_url:
            video_tag = soup.find("video")
            if video_tag and video_tag.get("src"):
                video_url = video_tag.get("src")
                
        if not video_url:
            # Try parsing from raw HTML via regex
            import re
            matches = re.findall(r'https?://[^\s"\']+\.mp4[^\s"\']*', resp.text)
            if matches:
                video_url = matches[0]
                
        if not video_url:
            return {
                "success": False,
                "error": "Failed to find video stream URL on the CocoFun page."
            }
            
        # Format video URL protocols
        if video_url.startswith("//"):
            video_url = "https:" + video_url
        elif video_url.startswith("http://"):
            video_url = "https://" + video_url[7:]
            
        # Extract title
        title = ""
        meta_title = soup.find("meta", property="og:title")
        if meta_title:
            title = meta_title.get("content", "").strip()
            
        meta_desc = soup.find("meta", property="og:description")
        desc = meta_desc.get("content", "").strip() if meta_desc else ""
        
        # If title is generic CocoFun, try description
        if (not title or title.lower() == "cocofun") and desc:
            title = desc
            
        if not title:
            title = "CocoFun Video"
            
        # Extract cover
        cover = ""
        meta_image = soup.find("meta", property="og:image")
        if meta_image:
            cover = meta_image.get("content", "")
            if cover.startswith("//"):
                cover = "https:" + cover
            elif cover.startswith("http://"):
                cover = "https://" + cover[7:]
                
        links = [
            {
                "label": "DOWNLOAD VIDEO (HD)",
                "url": video_url
            }
        ]
        
        return {
            "success": True,
            "data": {
                "title": title[:100],
                "creator": "CocoFun User",
                "description": desc or title,
                "cover": cover,
                "links": links
            }
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"CocoFun Downloader Error: {str(e)}"
        }

if __name__ == "__main__":
    test_url = "https://coco.fun/share/post/A2KegsxMbh2CaeYwKGK8Kw==?lang=en&pkg=us&share_to=whatsapp&m=bf202807508c091d4ea74db436f966e2&d=c69e0ae6d8fec3cfdf634461f227676021255102b6d21b91d632f8c760494c2b&nt=1"
    res = download_cocofun({"url": test_url})
    import json
    print(json.dumps(res, indent=2))
