import re
import requests
from bs4 import BeautifulSoup

def download_mediafire(payload):
    url = payload.get("url") or payload.get("URLT") or payload.get("image")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }
        
    url = url.strip()
    
    # Apply user's logic: changing trailing 0 to 1
    modified_url = url
    if url.endswith("/0"):
        modified_url = url[:-2] + "/1"
    elif url.endswith("?dl=0"):
        modified_url = url[:-5] + "?dl=1"
        
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    try:
        # Try retrieving the page with the modified URL
        resp = requests.get(modified_url, headers=headers, timeout=10)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "html.parser")
            
            # Find the download button href
            download_btn = soup.find(id="downloadButton")
            download_url = None
            if download_btn and download_btn.get("href"):
                download_url = download_btn.get("href").strip()
            else:
                # Search using regex for download.mediafire.com
                match = re.search(r'https?://[a-zA-Z0-9]+\.mediafire\.com/[a-zA-Z0-9]+/[a-zA-Z0-9]+/?[a-zA-Z0-9_\-\.\%\+]*', resp.text)
                if match:
                    download_url = match.group(0)
                    
            # Extract file title
            title = "MediaFire File"
            og_title = soup.find("meta", property="og:title")
            if og_title and og_title.get("content"):
                title = og_title.get("content")
            else:
                title_tag = soup.find("title")
                if title_tag:
                    title = title_tag.text.strip().replace(" - MediaFire", "")
                    
            if download_url:
                return {
                    "success": True,
                    "data": {
                        "title": title,
                        "creator": "MediaFire",
                        "description": "Successfully generated direct download link from MediaFire.",
                        "cover": "https://www.mediafire.com/favicon.ico",
                        "links": [
                            {
                                "label": "DOWNLOAD FILE (Direct)",
                                "url": download_url
                            },
                            {
                                "label": "Original Web Link",
                                "url": url
                            }
                        ]
                    }
                }
    except Exception:
        pass
        
    # Fallback to direct URL translations if page scraping fails
    fallback_download = url.replace("/file/", "/download/")
    if fallback_download.endswith("/file"):
        fallback_download = fallback_download[:-5]
    elif fallback_download.endswith("/0"):
        fallback_download = fallback_download[:-2] + "/1"
        
    return {
        "success": True,
        "data": {
            "title": "MediaFire Download Link",
            "creator": "MediaFire",
            "description": "Generated fallback direct download link.",
            "cover": "https://www.mediafire.com/favicon.ico",
            "links": [
                {
                    "label": "DOWNLOAD FILE (Direct Link)",
                    "url": fallback_download
                },
                {
                    "label": "Modified Share Link",
                    "url": modified_url
                }
            ]
        }
    }
