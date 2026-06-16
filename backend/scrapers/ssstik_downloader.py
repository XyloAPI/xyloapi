import requests
from bs4 import BeautifulSoup
import re
import json

def download_ssstik(payload):
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
        "Accept-Language": "en-US,en;q=0.5",
    }

    try:
        # 1. Fetch homepage to get s_furl and s_tt
        res = session.get("https://ssstik.io/id", headers=headers, timeout=15)
        if res.status_code != 200:
            return {
                "success": False,
                "error": f"Failed to load ssstik homepage. Status code: {res.status_code}"
            }

        html = res.text
        furl_match = re.search(r"s_furl\s*=\s*'([^']+)'", html)
        tt_match = re.search(r"s_tt\s*=\s*'([^']+)'", html)

        if not furl_match or not tt_match:
            return {
                "success": False,
                "error": "Failed to extract dynamic form attributes from ssstik."
            }

        s_furl = furl_match.group(1)
        s_tt = tt_match.group(1)

        # 2. Submit htmx form POST
        post_url = f"https://ssstik.io/{s_furl}?url=dl"
        post_headers = {
            "User-Agent": headers["User-Agent"],
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "HX-Request": "true",
            "HX-Trigger": "_gcaptcha_pt",
            "HX-Target": "target",
            "HX-Current-URL": "https://ssstik.io/id",
            "Origin": "https://ssstik.io",
            "Referer": "https://ssstik.io/id"
        }

        post_data = {
            "id": url,
            "locale": "id",
            "tt": s_tt
        }

        post_res = session.post(post_url, headers=post_headers, data=post_data, timeout=30)
        if post_res.status_code != 200:
            return {
                "success": False,
                "error": f"Failed to submit url to ssstik. Status code: {post_res.status_code}"
            }

        result_html = post_res.text
        if "id-error" in result_html or "invalid url" in result_html.lower() or "not found" in result_html.lower():
            return {
                "success": False,
                "error": "Invalid TikTok URL. Please check the link and try again."
            }

        soup = BeautifulSoup(result_html, "html.parser")

        # 3. Parse download URLs
        links = {}
        for a in soup.find_all("a"):
            href = a.get("href")
            classes = a.get("class", [])
            if href:
                if "without_watermark" in classes:
                    links["nowatermark"] = href
                elif "music" in classes:
                    links["audio"] = href

        if not links:
            return {
                "success": False,
                "error": "No download links found in the ssstik response."
            }

        # 4. Parse meta details
        creator = "Unknown"
        title = "TikTok Video"
        description = ""
        cover_img = ""

        # Cover / Avatar
        img = soup.find("img")
        if img:
            cover_img = img.get("src", "")

        # Creator
        h2 = soup.find("h2")
        if h2:
            creator = h2.get_text(strip=True)

        # Description
        p = soup.find("p", class_="maintext")
        if p:
            description = p.get_text(strip=True)
            title = description
        else:
            # Fallback to any paragraph tag
            p_any = soup.find("p")
            if p_any:
                description = p_any.get_text(strip=True)
                title = description

        return {
            "success": True,
            "data": {
                "title": title,
                "creator": creator,
                "description": description,
                "duration": "N/A",
                "cover": cover_img,
                "links": links
            }
        }

    except Exception as e:
        return {
            "success": False,
            "error": f"Exception occurred during ssstik scraping: {str(e)}"
        }

if __name__ == "__main__":
    test_payload = {"url": "https://www.tiktok.com/@scout2015/video/6718335390845095173"}
    print(json.dumps(download_ssstik(test_payload), indent=2))
