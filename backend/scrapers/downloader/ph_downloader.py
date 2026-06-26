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

def format_duration(seconds):
    if not seconds:
        return None
    try:
        seconds = int(seconds)
        m, s = divmod(seconds, 60)
        h, m = divmod(m, 60)
        if h:
            return f"{h}:{m:02d}:{s:02d}"
        return f"{m}:{s:02d}"
    except Exception:
        return None

def download_ph(payload):
    url = payload.get("url") or payload.get("URLT") or payload.get("image")
    if not url:
        return {"success": False, "error": "Missing required parameter: 'url'"}

    url = url.strip()

    # Validate it's a Pornhub URL
    if "pornhub.com" not in url and "pornhubpremium.com" not in url:
        return {"success": False, "error": "Invalid Pornhub URL."}

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

    title = info.get("title") or "Pornhub Video"
    duration = format_duration(info.get("duration"))
    thumbnail = info.get("thumbnail") or ""
    uploader = info.get("uploader") or ""
    view_count = info.get("view_count")
    like_count = info.get("like_count")

    # Build description
    stats_parts = []
    if duration:
        stats_parts.append(f"Duration: {duration}")
    if view_count is not None:
        stats_parts.append(f"{view_count:,} views")
    if like_count is not None:
        stats_parts.append(f"{like_count:,} likes")
    desc_short = " · ".join(stats_parts) if stats_parts else ""

    raw_formats = info.get("formats", [])
    links = []

    # Sort formats to display better options (priority to direct https over hls/m3u8, and higher resolution first)
    # Direct mp4 links have protocol="https", HLS has protocol="m3u8_native"
    def sort_key(f):
        # Prefer direct https
        proto = f.get("protocol", "")
        proto_score = 0 if proto == "https" else 1
        
        # Parse resolution height
        height = f.get("height") or 0
        try:
            height = int(height)
        except ValueError:
            height = 0
            
        return (proto_score, -height)

    sorted_formats = sorted(raw_formats, key=sort_key)
    seen_urls = set()

    for fmt in sorted_formats:
        fmt_url = fmt.get("url", "")
        if not fmt_url or fmt_url in seen_urls:
            continue
        seen_urls.add(fmt_url)

        res = fmt.get("resolution") or f"{fmt.get('width', '?')}x{fmt.get('height', '?')}"
        if fmt.get("height"):
            res = f"{fmt.get('height')}p"
            
        proto = fmt.get("protocol", "https")
        label_suffix = " (Direct MP4)" if proto == "https" else " (HLS M3U8)"
        
        links.append({
            "label": f"DOWNLOAD VIDEO {res}{label_suffix}",
            "url": fmt_url
        })

    if not links:
        return {"success": False, "error": "No downloadable formats found."}

    return {
        "success": True,
        "data": {
            "title": title,
            "creator": uploader or "Pornhub",
            "description": desc_short,
            "cover": thumbnail,
            "duration": duration,
            "links": links
        }
    }
