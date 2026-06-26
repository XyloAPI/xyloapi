import requests
from bs4 import BeautifulSoup
import json
import sys

def download_x(payload):
    url = payload.get("url") or payload.get("URLT") or payload.get("image")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }

    # Replace x.com with twitter.com if necessary, since some scrapers prefer twitter.com
    # Actually, tweeload handles x.com fine, but let's keep it robust.
    session = requests.Session()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    }

    try:
        # 1. Fetch homepage to get cookies
        session.get("https://tweeload.com/", headers=headers, timeout=15)
        
        # 2. Post to download endpoint
        post_url = "https://tweeload.com/en/download"
        post_data = {
            "url": url
        }
        
        post_headers = {
            "User-Agent": headers["User-Agent"],
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Origin": "https://tweeload.com",
            "Referer": "https://tweeload.com/",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        post_res = session.post(post_url, data=post_data, headers=post_headers, timeout=25)
        if post_res.status_code != 200:
            return {
                "success": False,
                "error": f"Tweeload returned status code {post_res.status_code}"
            }
            
        soup = BeautifulSoup(post_res.text, "html.parser")
        wrapper = soup.find("div", class_="download__wrapper")
        
        if not wrapper:
            # Check for not found section
            not_found = soup.find("section", class_="not__found__section")
            error_msg = "We couldn't find any media inside this tweet or it is from a private account."
            if not_found:
                h3_tag = not_found.find("h3")
                if h3_tag:
                    error_msg = h3_tag.get_text().strip()
            return {
                "success": False,
                "error": error_msg
            }
            
        # Extract user info
        user_name = "Twitter User"
        user_handle = "@"
        profile_div = soup.find("div", class_="download__item__profile_pic")
        if profile_div:
            span_tags = profile_div.find_all("span")
            if len(span_tags) >= 1:
                user_name = span_tags[0].get_text().strip()
            if len(span_tags) >= 2:
                user_handle = span_tags[1].get_text().strip()
                
        # Find cover/avatar image
        avatar = ""
        if profile_div:
            img = profile_div.find("img")
            if img:
                avatar = img.get("src")
                if avatar.startswith("/"):
                    avatar = "https://tweeload.com" + avatar
                    
        # Extract download rows from the table
        links = []
        table = soup.find("table")
        if table:
            rows = table.find_all("tr")
            for row in rows:
                cols = row.find_all("td")
                if len(cols) >= 2:
                    res_text = cols[0].get_text().strip()
                    a_tag = cols[1].find("a")
                    if a_tag:
                        dl_url = a_tag.get("href")
                        if dl_url:
                            links.append({
                                "label": f"Download ({res_text})",
                                "url": dl_url
                            })
                            
        if not links:
            return {
                "success": False,
                "error": "No download links could be extracted from Tweeload."
            }
            
        return {
            "success": True,
            "data": {
                "title": f"Tweet by {user_name} ({user_handle})",
                "creator": f"{user_name} ({user_handle})",
                "description": "Twitter / X Media Downloader",
                "duration": "N/A",
                "cover": avatar,
                "links": links
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Exception occurred during Twitter/X scraping: {str(e)}"
        }

if __name__ == "__main__":
    test_payload = {"url": "https://x.com/hiro1233548/status/2066776236693803197?s=20"}
    print(json.dumps(download_x(test_payload), indent=2))
