import re
import requests
from xml.etree import ElementTree as ET
from html import unescape

CATEGORIES = {
    "top":           ("Top Stories",    "https://www.masslive.com/arc/outboundfeeds/rss/"),
    "news":          ("Local News",     "https://www.masslive.com/arc/outboundfeeds/rss/category/news/"),
    "sports":        ("Sports",         "https://www.masslive.com/arc/outboundfeeds/rss/category/sports/"),
    "politics":      ("Politics",       "https://www.masslive.com/arc/outboundfeeds/rss/category/politics/"),
    "business":      ("Business",       "https://www.masslive.com/arc/outboundfeeds/rss/category/business/"),
    "entertainment": ("Entertainment",  "https://www.masslive.com/arc/outboundfeeds/rss/category/entertainment/"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
}


def _cdata(text: str) -> str:
    t = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', text or '', flags=re.DOTALL)
    return unescape(t).strip()


def get_masslive(payload):
    category = (payload.get("category") or "top").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, feed_url = CATEGORIES[category]

    try:
        resp = requests.get(feed_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"MassLive returned HTTP {resp.status_code}"}
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

        # Retrieve media content
        image = ""
        media_content = item.find(f"{{{media_ns}}}content")
        if media_content is not None:
            img_candidate = media_content.get("url") or ""
            # Verify it's an image
            if "image" in media_content.get("type", "") or any(img_candidate.lower().split('?')[0].endswith(ext) for ext in [".jpg", ".jpeg", ".png", ".webp"]):
                image = img_candidate

        articles.append({
            "title": title,
            "url": url,
            "description": desc,
            "published": pub,
            "image": image,
            "source": "MassLive",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "MassLive",
            "articles": articles[:20],
            "total": len(articles[:20]),
        }
    }
