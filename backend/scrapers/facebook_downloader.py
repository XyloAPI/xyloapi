import requests
from bs4 import BeautifulSoup
import json
import sys

def download_facebook(payload):
    # Support 'url' parameter or fallback to what they sent
    url = payload.get("url") or payload.get("URLz") or payload.get("image")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }

    session = requests.Session()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Content-Type": "application/x-www-form-urlencoded",
        "Origin": "https://fdown.net",
        "Referer": "https://fdown.net/"
    }

    try:
        # 1. Fetch homepage to set initial cookies
        session.get("https://fdown.net/", headers={"User-Agent": headers["User-Agent"]}, timeout=15)
        
        # 2. POST to download.php
        post_data = {
            "URLz": url
        }
        res = session.post("https://fdown.net/download.php", data=post_data, headers=headers, timeout=25)
        if res.status_code != 200:
            return {
                "success": False,
                "error": f"FDown API returned status code {res.status_code}"
            }
            
        soup = BeautifulSoup(res.text, "html.parser")
        
        # Extract title
        title = "Facebook Video"
        title_tag = soup.find(class_="lib-header")
        if title_tag:
            txt = title_tag.get_text().strip()
            if txt and txt != "No video title":
                title = txt
                
        # Extract description and duration
        description = "Facebook Video Downloader"
        duration = "N/A"
        desc_tags = soup.find_all(class_="lib-desc")
        for tag in desc_tags:
            txt = tag.get_text().strip()
            if txt.startswith("Description:"):
                desc_val = txt.replace("Description:", "").strip()
                if desc_val and desc_val != "No video description...":
                    description = desc_val
            elif txt.startswith("Duration:"):
                dur_val = txt.replace("Duration:", "").strip()
                if dur_val:
                    duration = dur_val
                    
        # Extract Cover image
        cover = ""
        img_tag = soup.find("img", class_="lib-img-show")
        if img_tag:
            cover = img_tag.get("src", "")
            
        # Extract SD & HD links
        links = []
        sd_link = soup.find(id="sdlink")
        if sd_link:
            sd_url = sd_link.get("href")
            if sd_url:
                links.append({
                    "label": "Download Normal Quality (SD)",
                    "url": sd_url
                })
                
        hd_link = soup.find(id="hdlink")
        if hd_link:
            hd_url = hd_link.get("href")
            if hd_url:
                links.append({
                    "label": "Download HD Quality (HD)",
                    "url": hd_url
                })
                
        # Check if we got links
        if not links:
            # Let's see if there is an error message on the page
            alert = soup.find("div", class_="alert-danger")
            err_msg = alert.get_text().strip() if alert else "Unable to find video download links. Make sure the video is public."
            return {
                "success": False,
                "error": err_msg
            }
            
        return {
            "success": True,
            "data": {
                "title": title,
                "creator": "Facebook User",
                "description": description,
                "duration": duration,
                "cover": cover,
                "links": links
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Exception occurred during Facebook scraping: {str(e)}"
        }

if __name__ == "__main__":
    test_payload = {"url": "https://www.facebook.com/zha.alshop/videos/ku-rasa-aku-sekarang-lebih-sukaambil-video-yasetelah-di-fb-pro-saat-pulang-libur/2178239252614114/"}
    print(json.dumps(download_facebook(test_payload), indent=2))
