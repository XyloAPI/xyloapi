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

# Quality priority order (highest first)
QUALITY_PRIORITY = ["hls-1080-0", "hls-1080-1", "hls-720", "hls-480", "hls-380"]
QUALITY_LABELS = {
    "hls-1080-0": "1080p (H.264)",
    "hls-1080-1": "1080p (AV1)",
    "hls-720":    "720p (HD)",
    "hls-480":    "480p",
    "hls-380":    "360p",
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

def download_dailymotion(payload):
    url = payload.get("url") or payload.get("URLT") or payload.get("image")
    if not url:
        return {"success": False, "error": "Missing required parameter: 'url'"}

    url = url.strip()

    # Validate it's a Dailymotion URL
    if "dailymotion.com" not in url and "dai.ly" not in url:
        return {"success": False, "error": "Invalid Dailymotion URL."}

    # Call savethevideo API
    try:
        resp = requests.post(
            API_URL,
            headers=HEADERS,
            json={"type": "info", "url": url},
            timeout=20
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

    title = info.get("title") or "Dailymotion Video"
    description = info.get("description", "")
    duration = format_duration(info.get("duration"))
    thumbnail = info.get("thumbnail") or ""
    uploader = info.get("uploader") or ""
    view_count = info.get("view_count")
    like_count = info.get("like_count")

    # Build stats description
    stats_parts = []
    if duration:
        stats_parts.append(f"Duration: {duration}")
    if view_count is not None:
        stats_parts.append(f"{view_count:,} views")
    if like_count is not None:
        stats_parts.append(f"{like_count:,} likes")
    desc_short = " · ".join(stats_parts) if stats_parts else description[:200] if description else ""

    # Extract video formats (video-only streams)
    raw_formats = info.get("formats", [])
    video_formats = [f for f in raw_formats if f.get("vcodec") != "none" and f.get("url")]

    links = []

    # Sort by known priority first, then by tbr descending
    def sort_key(f):
        fid = f.get("format_id", "")
        try:
            idx = QUALITY_PRIORITY.index(fid)
        except ValueError:
            idx = 99
        tbr = f.get("tbr", 0) or 0
        return (idx, -tbr)

    video_formats.sort(key=sort_key)
    seen_ids = set()

    for fmt in video_formats:
        fid = fmt.get("format_id", "")
        if fid in seen_ids:
            continue
        seen_ids.add(fid)

        resolution = fmt.get("resolution") or f"{fmt.get('width', '?')}x{fmt.get('height', '?')}"
        label = QUALITY_LABELS.get(fid) or resolution
        fmt_url = fmt.get("url", "")

        links.append({
            "label": f"DOWNLOAD VIDEO {label}",
            "url": fmt_url
        })

    # Also add audio-only streams
    audio_formats = [f for f in raw_formats if f.get("vcodec") == "none" and f.get("url")]
    if audio_formats:
        # Pick best audio (highest quality note)
        best_audio = None
        for af in audio_formats:
            note = af.get("format_note", "")
            if "high" in note.lower():
                best_audio = af
                break
        if not best_audio:
            best_audio = audio_formats[0]

        links.append({
            "label": "DOWNLOAD AUDIO ONLY (M3U8)",
            "url": best_audio.get("url", "")
        })

    if not links:
        return {"success": False, "error": "No downloadable video formats found."}

    return {
        "success": True,
        "data": {
            "title": title,
            "creator": uploader or "Dailymotion",
            "description": desc_short,
            "cover": thumbnail,
            "duration": duration,
            "links": links
        }
    }
