import requests
from bs4 import BeautifulSoup
import json
import sys

def download_soundcloud(payload):
    url = payload.get("url") or payload.get("URLT") or payload.get("image")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }

    session = requests.Session()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    }

    try:
        # 1. Fetch homepage to extract verification tokens
        home_res = session.get("https://downcloudme.com/", headers=headers, timeout=15)
        soup = BeautifulSoup(home_res.text, "html.parser")
        
        verify_val = ""
        referer_val = ""
        
        verify_input = soup.find("input", {"name": "downloader_verify"})
        if verify_input:
            verify_val = verify_input.get("value")
            
        referer_input = soup.find("input", {"name": "_wp_http_referer"})
        if referer_input:
            referer_val = referer_input.get("value")
            
        # Fallback values if not found on page
        if not verify_val:
            verify_val = "fc49765101"
        if not referer_val:
            referer_val = "/enTc/"
            
        # 2. Post to download-track
        post_url = "https://downcloudme.com/download-track"
        post_data = {
            "downloader_verify": verify_val,
            "_wp_http_referer": referer_val,
            "url": url
        }
        
        post_headers = {
            "User-Agent": headers["User-Agent"],
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Origin": "https://downcloudme.com",
            "Referer": "https://downcloudme.com/",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        post_res = session.post(post_url, data=post_data, headers=post_headers, timeout=25)
        if post_res.status_code != 200:
            return {
                "success": False,
                "error": f"DownCloudMe returned status code {post_res.status_code}"
            }
            
        post_soup = BeautifulSoup(post_res.text, "html.parser")
        
        # Extract title
        title_h3 = post_soup.find("h3")
        title = title_h3.get_text().strip() if title_h3 else "SoundCloud Track"
        
        # Extract cover
        soundcloud_area = post_soup.find("div", {"id": "soundcloud-area"})
        cover = ""
        if soundcloud_area:
            img = soundcloud_area.find("img")
            if img:
                cover = img.get("src")
                
        # Extract download link
        fast_btn = post_soup.find("button", {"id": "fastDownloadBtn"})
        download_url = ""
        if fast_btn:
            download_url = fast_btn.get("data-direct")
            
        if not download_url:
            return {
                "success": False,
                "error": "Unable to extract download URL from DownCloudMe. Make sure the link is valid."
            }
            
        return {
            "success": True,
            "data": {
                "title": title,
                "creator": "SoundCloud Artist",
                "description": "SoundCloud Audio Downloader",
                "duration": "N/A",
                "cover": cover,
                "links": [
                    {
                        "label": "Download Audio (MP3)",
                        "url": download_url
                    }
                ]
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Exception occurred during SoundCloud scraping: {str(e)}"
        }

if __name__ == "__main__":
    test_payload = {"url": "https://soundcloud.com/user-350247217/dewa19-ft-virzha-cintakan"}
    print(json.dumps(download_soundcloud(test_payload), indent=2))
