import re
import requests
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.xnxx.com/"
}

def extract_between(text, start, end):
    try:
        pattern = re.escape(start) + r"(.*?)" + re.escape(end)
        match = re.search(pattern, text)
        if match:
            return match.group(1).strip("'\" ")
    except Exception:
        pass
    return None

def download_xnxx(payload):
    url = payload.get("url") or payload.get("URLT") or payload.get("image")
    if not url:
        return {"success": False, "error": "Missing required parameter: 'url'"}

    url = url.strip()
    if "xnxx.com" not in url and "xnxx3.com" not in url:
        return {"success": False, "error": "Invalid XNXX URL."}

    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"Failed to load video page. HTTP status: {resp.status_code}"}
        
        html = resp.text
    except Exception as e:
        return {"success": False, "error": f"Failed to request video page: {str(e)}"}

    # Extract info using regex on html5player JavaScript calls
    title = extract_between(html, "html5player.setVideoTitle(", ");") or "XNXX Video"
    uploader = extract_between(html, "html5player.setUploaderName(", ");") or "XNXX"
    thumb_url = extract_between(html, "html5player.setThumbUrl169(", ");") or extract_between(html, "html5player.setThumbUrl(", ");")
    
    url_low = extract_between(html, "html5player.setVideoUrlLow(", ");")
    url_high = extract_between(html, "html5player.setVideoUrlHigh(", ");")
    url_hls = extract_between(html, "html5player.setVideoHLS(", ");")

    links = []
    if url_high:
        links.append({
            "label": "DOWNLOAD VIDEO (High Quality MP4)",
            "url": url_high
        })
    if url_low:
        links.append({
            "label": "DOWNLOAD VIDEO (Low Quality MP4)",
            "url": url_low
        })
    if url_hls:
        links.append({
            "label": "STREAM VIDEO (HLS M3U8)",
            "url": url_hls
        })

    if not links:
        return {"success": False, "error": "Could not find any video streams on this page."}

    # Extract duration metadata if possible
    duration = None
    soup = BeautifulSoup(html, "lxml")
    metadata_span = soup.find("span", class_="metadata")
    if metadata_span:
        # e.g., "10min"
        duration_text = metadata_span.get_text()
        match = re.search(r"(\d+min|\d+h\d+min)", duration_text)
        if match:
            duration = match.group(1)

    return {
        "success": True,
        "data": {
            "title": title,
            "creator": uploader,
            "cover": thumb_url or "",
            "duration": duration,
            "links": links
        }
    }
