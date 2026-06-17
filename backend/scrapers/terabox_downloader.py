from curl_cffi import requests
from bs4 import BeautifulSoup
import json

def download_terabox(payload):
    url = payload.get("url")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }

    session = requests.Session()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
    }

    landing_url = "https://flowvideoplayer.com/"
    
    # 1. Fetch the home page to get CSRF token and cookies
    try:
        resp = session.get(landing_url, headers=headers, impersonate="chrome120", timeout=12)
        if resp.status_code != 200:
            return {
                "success": False,
                "error": f"Failed to load flowvideoplayer.com (Status Code: {resp.status_code})"
            }
        
        soup = BeautifulSoup(resp.text, "html.parser")
        csrf_token = ""
        meta_csrf = soup.find("meta", attrs={"name": "csrf-token"})
        if meta_csrf:
            csrf_token = meta_csrf.get("content")
            
        if not csrf_token:
            return {
                "success": False,
                "error": "Could not extract CSRF token from flowvideoplayer.com"
            }
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to retrieve flowvideoplayer landing page: {str(e)}"
        }

    # 2. Make the POST request to get video links
    post_headers = {
        "User-Agent": headers["User-Agent"],
        "X-CSRF-TOKEN": csrf_token,
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": "https://flowvideoplayer.com",
        "Referer": "https://flowvideoplayer.com/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
    }
    
    post_url = "https://flowvideoplayer.com/telegram/bot/search/video"
    post_payload = {"url": url}
    
    try:
        resp_post = session.post(post_url, json=post_payload, headers=post_headers, impersonate="chrome120", timeout=15)
        if resp_post.status_code != 200:
            return {
                "success": False,
                "error": f"flowvideoplayer API returned HTTP status {resp_post.status_code}"
            }
        
        data = resp_post.json()
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to query flowvideoplayer API: {str(e)}"
        }

    if not data or not data.get("status"):
        return {
            "success": False,
            "error": data.get("message") or "Unable to retrieve videos from Terabox link."
        }

    response_list = data.get("response") or []
    if not response_list:
        return {
            "success": False,
            "error": "No files or videos found for this Terabox URL."
        }

    links = []
    cover = None
    first_title = None
    total_size_bytes = 0

    for idx, item in enumerate(response_list):
        file_name = item.get("file_name") or f"Terabox File {idx + 1}"
        file_size = item.get("file_size") or "Unknown Size"
        stream_url = item.get("fast_stream_url")
        thumbnail = item.get("thumbnail")
        
        if idx == 0:
            first_title = file_name
            cover = thumbnail

        if item.get("file_size_bytes"):
            try:
                total_size_bytes += int(item.get("file_size_bytes"))
            except ValueError:
                pass

        # Even if fast_stream_url is empty, we list it so we see it
        # If it is populated, we add the download link
        if stream_url:
            links.append({
                "label": f"DOWNLOAD VIDEO: {file_name} ({file_size})",
                "url": stream_url
            })
        else:
            # Fallback label in case stream url is empty (like for doc/image files)
            links.append({
                "label": f"FILE PREVIEW (No stream link): {file_name} ({file_size})",
                "url": thumbnail or url
            })

    # Fallback cover
    if not cover:
        cover = "https://www.terabox.com/static/images/logo/logo-en.png"

    # Format human readable total size
    total_size_str = ""
    if total_size_bytes > 0:
        if total_size_bytes >= 1024 * 1024 * 1024:
            total_size_str = f"{total_size_bytes / (1024*1024*1024):.2f} GB"
        else:
            total_size_str = f"{total_size_bytes / (1024*1024):.2f} MB"

    return {
        "success": True,
        "data": {
            "title": first_title or "Terabox Files",
            "creator": "Terabox",
            "description": f"Total files: {len(response_list)}" + (f" | Total Size: {total_size_str}" if total_size_str else ""),
            "cover": cover,
            "links": links
        }
    }
