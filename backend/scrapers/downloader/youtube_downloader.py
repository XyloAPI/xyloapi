import requests
import re
import json
import sys
from concurrent.futures import ThreadPoolExecutor

def extract_youtube_id(url):
    patterns = [
        r"(?:youtube\.com\/(?:watch\?.*v=|embed\/|v\/|shorts\/)|youtu\.be\/)([\w-]{11})"
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

def fetch_oembed_info(video_id):
    # Fetch title and other info from oembed API
    url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    try:
        res = requests.get(url, headers=headers, timeout=10)
        if res.status_code == 200:
            data = res.json()
            return {
                "title": data.get("title", "YouTube Video"),
                "creator": data.get("author_name", "YouTube Creator"),
                "cover": data.get("thumbnail_url", f"https://i.ytimg.com/vi/{video_id}/0.jpg")
            }
    except Exception:
        pass
    
    return {
        "title": "YouTube Video",
        "creator": "YouTube Creator",
        "cover": f"https://i.ytimg.com/vi/{video_id}/0.jpg"
    }

def fetch_single_format(validate_key, video_id, fmt, quality, bitrate):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Origin": "https://iframe.y2meta-uk.com",
        "Referer": "https://iframe.y2meta-uk.com/",
        "Content-Type": "application/x-www-form-urlencoded",
        "accept": "*/*"
    }
    if validate_key:
        headers["key"] = validate_key

    payload = {
        "link": f"https://youtu.be/{video_id}",
        "format": fmt,
        "audioBitrate": str(bitrate),
        "videoQuality": str(quality),
        "filenameStyle": "pretty",
        "vCodec": "h264"
    }

    try:
        res = requests.post("https://cnv.cx/v2/converter", data=payload, headers=headers, timeout=12)
        if res.status_code == 200:
            data = res.json()
            if data and data.get("url"):
                return {
                    "format": fmt,
                    "quality": quality,
                    "bitrate": bitrate,
                    "url": data["url"]
                }
    except Exception:
        pass
    return None

def fetch_vidssave(video_id):
    url = "https://api.vidssave.com/api/contentsite_api/media/parse"
    params = {
        "auth": "20250901majwlqo",
        "domain": "api-ak.vidssave.com",
        "origin": "cache",
        "link": f"https://www.youtube.com/watch?v={video_id}"
    }
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    try:
        res = requests.get(url, params=params, headers=headers, timeout=12)
        if res.status_code == 200:
            data = res.json()
            if data.get("status") == 1 and data.get("data"):
                return data["data"]
    except Exception:
        pass
    return None

def download_youtube(payload):
    url = payload.get("url") or payload.get("URLT") or payload.get("image")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }

    video_id = extract_youtube_id(url)
    if not video_id:
        return {
            "success": False,
            "error": "Invalid YouTube URL format."
        }

    # 1. Fetch metadata
    meta = fetch_oembed_info(video_id)

    # 2. Try primary downloader (vidssave)
    vidssave_data = fetch_vidssave(video_id)
    best_video = None
    best_audio = None
    title = meta["title"]
    creator = meta["creator"]
    cover = meta["cover"]

    if vidssave_data:
        title = vidssave_data.get("title") or title
        cover = vidssave_data.get("thumbnail") or cover
        resources = vidssave_data.get("resources", [])
        
        # Select best video
        video_qualities = ["1440P", "1080P", "720P", "480P", "360P", "240P"]
        for q in video_qualities:
            found = next((r for r in resources if r.get("type") == "video" and r.get("quality", "").upper() == q), None)
            if found and found.get("download_url"):
                best_video = {
                    "label": f"Download Video ({q.lower()})",
                    "url": found["download_url"]
                }
                break

        # Select best audio
        audio_qualities = ["320KBPS", "256KBPS", "192KBPS", "128KBPS", "LOW"]
        for q in audio_qualities:
            found = next((r for r in resources if r.get("type") == "audio" and r.get("quality", "").upper() == q), None)
            if found and found.get("download_url"):
                best_audio = {
                    "label": f"Download Audio ({q.lower() if 'kbps' in q.lower() else '128kbps MP3'})",
                    "url": found["download_url"]
                }
                break

    # 3. Fallback to cnv.cx if any format is missing
    if not best_video or not best_audio:
        validate_key = None
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Origin": "https://iframe.y2meta-uk.com",
            "Referer": "https://iframe.y2meta-uk.com/"
        }
        try:
            key_res = requests.get("https://cnv.cx/v2/sanity/key", headers=headers, timeout=10)
            if key_res.status_code == 200:
                validate_key = key_res.json().get("key")
        except Exception:
            pass

        tasks = []
        if not best_video:
            tasks.extend([("mp4", 1080, 128), ("mp4", 720, 128), ("mp4", 360, 128)])
        if not best_audio:
            tasks.extend([("mp3", 720, 320), ("mp3", 720, 128)])

        results = []
        if tasks:
            try:
                with ThreadPoolExecutor(max_workers=5) as executor:
                    futures = [executor.submit(fetch_single_format, validate_key, video_id, t[0], t[1], t[2]) for t in tasks]
                    for fut in futures:
                        res = fut.result()
                        if res:
                            results.append(res)
            except Exception:
                pass

        if not best_video:
            for q in [1080, 720, 360]:
                found = next((r for r in results if r["format"] == "mp4" and r["quality"] == q), None)
                if found:
                    best_video = {
                        "label": f"Download Video ({q}p)",
                        "url": found["url"]
                    }
                    break

            if not best_video:
                best_video = {
                    "label": "Download Video (720p)",
                    "url": f"https://conv.mp3youtube.cc/download/{video_id}"
                }

        if not best_audio:
            for b in [320, 128]:
                found = next((r for r in results if r["format"] == "mp3" and r["bitrate"] == b), None)
                if found:
                    best_audio = {
                        "label": f"Download Audio ({b}kbps MP3)",
                        "url": found["url"]
                    }
                    break

            if not best_audio:
                best_audio = {
                    "label": "Download Audio (128kbps MP3)",
                    "url": f"https://conv.mp3youtube.cc/download/{video_id}"
                }

    final_links = [best_video, best_audio]

    return {
        "success": True,
        "data": {
            "title": title,
            "creator": creator,
            "description": "YouTube Media Downloader",
            "duration": "N/A",
            "cover": cover,
            "links": final_links
        }
    }

if __name__ == "__main__":
    # Test script execution
    test_payload = {"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
    print(json.dumps(download_youtube(test_payload), indent=2))
