import requests
from bs4 import BeautifulSoup
import json
import urllib.parse

def normalize_ig_url(url):
    if "iqsaved.com" in url:
        parsed = urllib.parse.urlparse(url)
        segments = [s for s in parsed.path.split('/') if s]
        if segments:
            shortcode = segments[-1]
            return f"https://www.instagram.com/p/{shortcode}/"
    return url

def download_snapdownloader(payload):
    url = payload.get("url") or payload.get("URLT") or payload.get("image")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }
    url = normalize_ig_url(url)

    api_url = "https://api.igvideodownloader.net/api/contentsite_api/media/parse"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Origin": "https://igvideodownloader.net",
        "Referer": "https://igvideodownloader.net/"
    }

    post_data = {
        "auth": "20250901majwlqo",
        "domain": "api-ak.igvideodownloader.net",
        "origin": "source",
        "link": url
    }

    try:
        res = requests.post(api_url, headers=headers, data=post_data, timeout=30)
        if res.status_code == 200:
            res_json = res.json()
            status = res_json.get("status")
            status_code = res_json.get("status_code")
            msg = res_json.get("msg", "")

            # If parser error, try to parse JSON inside msg
            if status == 0 or status_code == "content_not_found":
                err_text = "The download link not found or video is private."
                if "parse error:" in msg:
                    try:
                        inner_json_str = msg.replace("parse error:", "").strip()
                        inner_json = json.loads(inner_json_str)
                        err_text = inner_json.get("msg") or err_text
                    except Exception:
                        pass
                elif msg:
                    err_text = msg

                # Comply with anonymity rules and improve error message readability
                err_text_lower = err_text.lower()
                if "igvideodownloader" in err_text_lower:
                    err_text = "Instagram Downloader encountered an error parsing the page."
                elif "api status code not 200" in err_text_lower or "not found" in err_text_lower:
                    err_text = "Video is private or unavailable."

                return {
                    "success": False,
                    "error": f"Instagram Downloader Error: {err_text}"
                }

            data_dict = res_json.get("data") or {}
            links = []

            # Parse top-level resources in data (which contain combined video/audio with sound)
            resources = data_dict.get("resources") or []
            for resource in resources:
                dl_url = resource.get("download_url") or resource.get("preview_url")
                if dl_url:
                    m_type = resource.get("type") or "media"
                    quality = resource.get("quality") or ""
                    format_type = resource.get("format") or ""
                    label = f"DOWNLOAD {m_type.upper()} ({format_type.upper()} {quality})".strip()
                    if not any(link["url"] == dl_url for link in links):
                        links.append({
                            "label": label,
                            "url": dl_url
                        })

            if links:
                cover_img = data_dict.get("thumbnail") or res_json.get("thumbnail") or ""
                title = data_dict.get("title") or "Instagram Media Download"
                return {
                    "success": True,
                    "data": {
                        "title": title,
                        "creator": "Instagram User",
                        "description": "Instagram video or image.",
                        "cover": cover_img,
                        "links": links
                    }
                }
            else:
                return {
                    "success": False,
                    "error": "Instagram Downloader Error: No download links could be parsed from the response."
                }
        else:
            return {
                "success": False,
                "error": f"Instagram Downloader connection failed."
            }
    except Exception as e:
        return {
            "success": False,
            "error": "Instagram Downloader encountered an unexpected error."
        }



