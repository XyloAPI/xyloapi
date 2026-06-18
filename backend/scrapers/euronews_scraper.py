import re
import requests
from xml.etree import ElementTree as ET
from html import unescape

CATEGORIES = {
    "top":      ("Latest News", "https://www.euronews.com/rss"),
    "news":     ("News",        "https://www.euronews.com/rss?level=theme&name=news"),
    "business": ("Business",    "https://www.euronews.com/rss?level=theme&name=business"),
    "sport":    ("Sport",       "https://www.euronews.com/rss?level=theme&name=sport"),
    "next":     ("Next (Tech)", "https://www.euronews.com/rss?level=vertical&name=next"),
    "travel":   ("Travel",      "https://www.euronews.com/rss?level=vertical&name=travel"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
}


def _cdata(text: str) -> str:
    t = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', text or '', flags=re.DOTALL)
    return unescape(t).strip()


def get_euronews(payload):
    category = (payload.get("category") or "top").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, feed_url = CATEGORIES[category]

    try:
        resp = requests.get(feed_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"Euronews returned HTTP {resp.status_code}"}
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

    for item in channel.findall("item"):
        title = _cdata(item.findtext("title") or "")
        url = _cdata(item.findtext("link") or item.findtext("guid") or "")
        pub = (item.findtext("pubDate") or "").strip()
        
        desc_html = item.findtext("description") or ""
        desc = re.sub(r'<[^>]+>', '', desc_html).strip()

        if not title or url in seen:
            continue
        seen.add(url)

        articles.append({
            "title": title,
            "url": url,
            "description": desc,
            "published": pub,
            "image": "",
            "source": "Euronews",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "Euronews",
            "articles": articles[:20],
            "total": len(articles[:20]),
        }
    }
