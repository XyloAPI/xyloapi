import re
import json
import requests

API_URL = "https://api.v02.savethevideo.com/tasks"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Content-Type": "application/json",
    "Origin": "https://www.savethevideo.com",
    "Referer": "https://www.savethevideo.com/",
}

def download_pornhd(payload):
    url = payload.get("url") or payload.get("URLT") or payload.get("image")
    if not url:
        return {"success": False, "error": "Missing required parameter: 'url'"}

    url = url.strip()

    # Validate it's a PornHD or Faphouse URL
    if "pornhd.com" not in url and "faphouse.com" not in url:
        return {"success": False, "error": "Invalid URL. Must be a pornhd.com or faphouse.com link."}

    # Call savethevideo API
    try:
        resp = requests.post(
            API_URL,
            headers=HEADERS,
            json={"type": "info", "url": url},
            timeout=25
        )
        if resp.status_code != 200:
            return {"success": False, "error": f"API returned status {resp.status_code}"}

        data = resp.json()
    except Exception as e:
        return {"success": False, "error": f"Failed to call extraction API: {str(e)}"}

    if data.get("state") != "completed":
        return {"success": False, "error": f"API task not completed. State: {data.get('state', 'unknown')}"}

    results = data.get("result", [])
    if not results or not isinstance(results, list):
        return {"success": False, "error": "No results returned from API."}

    info = results[0]

    title = info.get("title") or "PornHD Video"
    thumbnail = info.get("thumbnail") or ""
    uploader = info.get("uploader") or ""
    description = info.get("description", "")

    raw_formats = info.get("formats", [])
    links = []
    seen_urls = set()

    for fmt in raw_formats:
        fmt_url = fmt.get("url", "")
        if not fmt_url or fmt_url in seen_urls:
            continue
        seen_urls.add(fmt_url)

        res = fmt.get("resolution") or f"{fmt.get('width', '?')}x{fmt.get('height', '?')}"
        if fmt.get("height"):
            res = f"{fmt.get('height')}p"
            
        links.append({
            "label": f"DOWNLOAD VIDEO {res}",
            "url": fmt_url
        })

    if not links:
        # Fallback to single info url if formats list is empty
        fallback_url = info.get("url", "")
        if fallback_url:
            links.append({
                "label": "DOWNLOAD VIDEO (Direct Link)",
                "url": fallback_url
            })

    if not links:
        return {"success": False, "error": "No downloadable formats found."}

    return {
        "success": True,
        "data": {
            "title": title,
            "creator": uploader or "PornHD",
            "description": description[:200] if description else "",
            "cover": thumbnail,
            "links": links
        }
    }
