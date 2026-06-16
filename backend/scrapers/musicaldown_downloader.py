import requests
from bs4 import BeautifulSoup
import urllib.parse
import json

def download_musicaldown(payload):
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
        # 1. Fetch homepage to get cookie session and form tokens
        res = session.get("https://musicaldown.com/id", headers=headers, timeout=15)
        if res.status_code != 200:
            return {
                "success": False,
                "error": f"Failed to load MusicalDown homepage. Status code: {res.status_code}"
            }

        soup = BeautifulSoup(res.text, "html.parser")
        form = soup.find("form")
        if not form:
            return {
                "success": False,
                "error": "Form elements not found on MusicalDown homepage."
            }

        action = form.get("action", "/id/download")
        submit_url = f"https://musicaldown.com{action}" if action.startswith("/") else action

        # Find dynamic input names and value
        post_data = {}
        text_input_name = None
        hidden_token_name = None
        hidden_token_value = None

        for inp in form.find_all("input"):
            inp_type = inp.get("type")
            inp_name = inp.get("name")
            inp_val = inp.get("value", "")

            if inp_type == "text":
                text_input_name = inp_name
            elif inp_type == "hidden":
                if inp_name == "verify":
                    post_data[inp_name] = inp_val
                else:
                    hidden_token_name = inp_name
                    hidden_token_value = inp_val

        if not text_input_name:
            return {
                "success": False,
                "error": "Could not identify text URL input name on MusicalDown."
            }

        post_data[text_input_name] = url
        if hidden_token_name:
            post_data[hidden_token_name] = hidden_token_value

        # 2. Submit form to retrieve download details
        post_headers = {
            "User-Agent": headers["User-Agent"],
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Origin": "https://musicaldown.com",
            "Referer": "https://musicaldown.com/id",
            "Content-Type": "application/x-www-form-urlencoded"
        }

        post_res = session.post(submit_url, headers=post_headers, data=post_data, timeout=30)
        if post_res.status_code != 200:
            return {
                "success": False,
                "error": f"Failed to submit URL to MusicalDown. Status code: {post_res.status_code}"
            }

        result_html = post_res.text
        if "tidak valid" in result_html.lower() or "video is private" in result_html.lower() or "submitted video url" in result_html.lower():
            return {
                "success": False,
                "error": "Invalid TikTok URL or private video. Please check the link and try again."
            }

        result_soup = BeautifulSoup(result_html, "html.parser")

        # 3. Parse download URLs
        links = {}
        for a in result_soup.find_all("a"):
            href = a.get("href")
            text = a.get_text(strip=True)
            if href:
                if text == "Download MP4":
                    links["nowatermark"] = href
                elif text == "Download MP4 [HD]":
                    links["hd"] = href
                elif text == "Download MP4 [Watermark]":
                    links["watermark"] = href
                elif text == "Download MP3":
                    links["audio"] = href

        if not links:
            return {
                "success": False,
                "error": "No download links found in the MusicalDown response."
            }

        # 4. Parse meta details
        creator = "Unknown"
        title = "TikTok Video"
        description = ""
        cover_img = ""

        # Cover image / thumbnail (normally the first image)
        img = result_soup.find("img")
        if img:
            cover_img = img.get("src", "")

        # Creator (under h2 starting with @)
        for h2 in result_soup.find_all("h2"):
            h2_text = h2.get_text(strip=True)
            if h2_text.startswith("@"):
                creator = h2_text
                break

        # Description (paragraph next to creator or in container)
        for p in result_soup.find_all("p"):
            p_text = p.get_text(strip=True)
            # Exclude FAQ and general page info paragraphs
            if p_text and not p_text.startswith("MusicallyDown") and not p_text.startswith("Download Unlimited") and not p_text.startswith("We're the Fastest") and not p_text.startswith("Yes, you can") and not p_text.startswith("It depends on") and not p_text.startswith("No, MusicallyDown") and len(p_text) < 300:
                description = p_text
                title = p_text
                break

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
            "error": f"Exception occurred during MusicalDown scraping: {str(e)}"
        }

if __name__ == "__main__":
    import sys
    test_payload = {"url": "https://www.tiktok.com/@scout2015/video/6718335390845095173"}
    print(json.dumps(download_musicaldown(test_payload), indent=2))
