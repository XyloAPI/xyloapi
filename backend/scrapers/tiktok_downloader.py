import requests
from bs4 import BeautifulSoup
import urllib.parse
import json
import sys

try:
    from musicaldown_downloader import download_musicaldown
except ImportError:
    import musicaldown_downloader
    download_musicaldown = musicaldown_downloader.download_musicaldown

try:
    from ssstik_downloader import download_ssstik
except ImportError:
    import ssstik_downloader
    download_ssstik = ssstik_downloader.download_ssstik

try:
    from tikwm_downloader import download_tikwm
except ImportError:
    import tikwm_downloader
    download_tikwm = tikwm_downloader.download_tikwm

def _download_tikdown(url):
    session = requests.Session()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
    }

    try:
        # 1. Fetch homepage to capture cookies
        session.get("https://tikdown.net/", headers=headers, timeout=15)

        # 2. Perform the POST request to download.php
        post_headers = {
            "User-Agent": headers["User-Agent"],
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Origin": "https://tikdown.net",
            "Referer": "https://tikdown.net/",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        data = {"URLT": url}
        
        post_res = session.post("https://tikdown.net/download.php", headers=post_headers, data=data, timeout=30)
        if post_res.status_code != 200:
            return {
                "success": False,
                "error": f"TikDown server returned status code {post_res.status_code}"
            }

        html = post_res.text
        soup = BeautifulSoup(html, "html.parser")

        # Check for error message in the response
        body_text = soup.body.get_text() if soup.body else ""
        if "Oops!" in body_text or "couldn't fetch the video" in body_text:
            return {
                "success": False,
                "error": "Oops! Couldn't fetch the requested TikTok video. Please ensure the video is public and the link is correct."
            }

        # 3. Parse get.php form elements
        get_form = soup.find("form", action=lambda x: x and ("get.php" in x))
        if not get_form:
            return {
                "success": False,
                "error": "Failed to parse download options form from TikDown response."
            }

        token_id_input = get_form.find("input", {"name": "token_id"})
        token_id = token_id_input.get("value") if token_id_input else ""

        options = get_form.find_all("option")
        formats = {}
        for opt in options:
            opt_id = opt.get("id")
            val = opt.get("value")
            if opt_id and val:
                formats[opt_id] = val

        if not token_id or not formats:
            return {
                "success": False,
                "error": "Failed to extract tokens or download formats from TikDown."
            }

        # Construct download URLs
        links = {}
        base_get_url = "https://tikdown.net/get.php"
        
        if "hdvw" in formats:
            links["nowatermark"] = f"{base_get_url}?token={urllib.parse.quote(formats['hdvw'])}&token_id={urllib.parse.quote(token_id)}"
        if "hdv" in formats:
            links["watermark"] = f"{base_get_url}?token={urllib.parse.quote(formats['hdv'])}&token_id={urllib.parse.quote(token_id)}"
        if "mp3" in formats:
            links["audio"] = f"{base_get_url}?token={urllib.parse.quote(formats['mp3'])}&token_id={urllib.parse.quote(token_id)}"

        # 4. Extract Video Meta Info
        creator = "Unknown"
        title = "TikTok Video"
        description = ""
        duration = "N/A"
        cover_img = ""

        # Find cover image
        bg_light_div = soup.find(class_="bg-light")
        if bg_light_div:
            img = bg_light_div.find("img")
            if img:
                cover_img = img.get("src", "")

        # Find details in table rows
        rows = soup.find_all("tr")
        for row in rows:
            cols = row.find_all("td")
            if len(cols) >= 2:
                label_text = cols[0].get_text(strip=True).lower()
                val_text = cols[1].get_text(strip=True)
                if "creator" in label_text:
                    creator = val_text
                elif "title" in label_text:
                    title = val_text
                elif "description" in label_text:
                    description = val_text
                elif "duration" in label_text:
                    duration = val_text

        return {
            "success": True,
            "data": {
                "title": title,
                "creator": creator,
                "description": description,
                "duration": duration,
                "cover": cover_img,
                "links": links
            }
        }

    except Exception as e:
        return {
            "success": False,
            "error": f"Exception occurred during TikDown scraping: {str(e)}"
        }

def download_tiktok(payload):
    url = payload.get("url") or payload.get("URLT") or payload.get("image")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }

    # 1. Try primary downloader (TikDown)
    try:
        result = _download_tikdown(url)
        if result.get("success"):
            return result
        sys.stderr.write(f"TikDown failed: {result.get('error')}. Attempting SSSTik fallback...\n")
    except Exception as e:
        sys.stderr.write(f"TikDown raised exception: {str(e)}. Attempting SSSTik fallback...\n")

    # 2. Try secondary downloader (SSSTik)
    try:
        result = download_ssstik(payload)
        if result.get("success"):
            return result
        sys.stderr.write(f"SSSTik failed: {result.get('error')}. Attempting TikWM fallback...\n")
    except Exception as e:
        sys.stderr.write(f"SSSTik raised exception: {str(e)}. Attempting TikWM fallback...\n")

    # 3. Try tertiary downloader (TikWM)
    try:
        result = download_tikwm(payload)
        if result.get("success"):
            return result
        sys.stderr.write(f"TikWM failed: {result.get('error')}. Attempting MusicalDown fallback...\n")
    except Exception as e:
        sys.stderr.write(f"TikWM raised exception: {str(e)}. Attempting MusicalDown fallback...\n")

    # 4. Try quaternary downloader (MusicalDown)
    return download_musicaldown(payload)

if __name__ == "__main__":
    # Test stub
    test_payload = {"url": "https://www.tiktok.com/@scout2015/video/6718335390845095173"}
    print(json.dumps(download_tiktok(test_payload), indent=2))
