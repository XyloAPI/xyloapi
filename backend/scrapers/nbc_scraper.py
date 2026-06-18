import re
import requests
from xml.etree import ElementTree as ET
from html import unescape

CATEGORIES = {
    "top":      ("Top Stories",   "https://feeds.nbcnews.com/nbcnews/public/news"),
    "us":       ("U.S. News",     "https://feeds.nbcnews.com/nbcnews/public/us"),
    "world":    ("World News",    "https://feeds.nbcnews.com/nbcnews/public/world"),
    "politics": ("Politics",      "https://feeds.nbcnews.com/nbcnews/public/politics"),
    "business": ("Business",      "https://feeds.nbcnews.com/nbcnews/public/business"),
    "health":   ("Health",        "https://feeds.nbcnews.com/nbcnews/public/health"),
    "tech":     ("Technology",    "https://feeds.nbcnews.com/nbcnews/public/tech"),
    "science":  ("Science",       "https://feeds.nbcnews.com/nbcnews/public/science"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
}


def _cdata(text: str) -> str:
    t = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', text or '', flags=re.DOTALL)
    return unescape(t).strip()


def get_nbc(payload):
    category = (payload.get("category") or "top").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, feed_url = CATEGORIES[category]

    try:
        resp = requests.get(feed_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"NBC News returned HTTP {resp.status_code}"}
        xml_bytes = resp.content
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    try:
        root = ET.fromstring(xml_bytes)
    except ET.ParseError as e:
        return {"success": False, "error": f"Failed to parse RSS XML: {str(e)}"}

    channel = root.find("channel")
    if channel is None:
        return {"success": False, "error": "No channel found in RSS XML"}

    seen = set()
    articles = []
    media_ns = "http://search.yahoo.com/mrss/"

    for item in channel.findall("item"):
        title = _cdata(item.findtext("title") or "")
        url = _cdata(item.findtext("link") or item.findtext("guid") or "")
        pub = (item.findtext("pubDate") or "").strip()
        
        desc_html = item.findtext("description") or ""
        desc = re.sub(r'<[^>]+>', '', desc_html).strip()

        if not title or url in seen:
            continue
        seen.add(url)

        # Retrieve media thumbnails
        image = ""
        thumb = item.find(f"{{{media_ns}}}thumbnail")
        if thumb is not None:
            image = thumb.get("url") or ""
            
        if not image:
            content = item.find(f"{{{media_ns}}}content")
            if content is not None:
                img_candidate = content.get("url") or ""
                # Make sure it's an image and not an m3u8 or video stream
                if "image" in content.get("medium", "") or any(img_candidate.endswith(ext) for ext in [".jpg", ".jpeg", ".png", ".webp"]):
                    image = img_candidate

        # Determine source
        source_name = "NBC News"
        if "telemundo.com" in url:
            source_name = "Telemundo Deportes"

        articles.append({
            "title": title,
            "url": url,
            "description": desc,
            "published": pub,
            "image": image,
            "source": source_name,
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "NBC News",
            "articles": articles[:20],
            "total": len(articles[:20]),
        }
    }
