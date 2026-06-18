import re
import requests
from xml.etree import ElementTree as ET
from html import unescape

CATEGORIES = {
    "top":      ("Top Stories",      "https://www.independent.co.uk/rss"),
    "news":     ("General News",     "https://www.independent.co.uk/news/rss"),
    "uk":       ("UK News",          "https://www.independent.co.uk/news/uk/rss"),
    "world":    ("World News",       "https://www.independent.co.uk/news/world/rss"),
    "business": ("Business & Money", "https://www.independent.co.uk/news/business/rss"),
    "politics": ("Politics",         "https://www.independent.co.uk/news/uk/politics/rss"),
    "sport":    ("Sport",            "https://www.independent.co.uk/sport/rss"),
    "tech":     ("Tech",             "https://www.independent.co.uk/tech/rss"),
    "travel":   ("Travel",           "https://www.independent.co.uk/travel/rss"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
}


def _cdata(text: str) -> str:
    t = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', text or '', flags=re.DOTALL)
    return unescape(t).strip()


def _clean_title(title: str) -> str:
    title = re.sub(r'\s*[-|–]\s*The\s*Independent\s*$', '', title, flags=re.I)
    return title.strip()


def get_independent_news(payload):
    category = (payload.get("category") or "top").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, feed_url = CATEGORIES[category]

    try:
        resp = requests.get(feed_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"The Independent returned HTTP {resp.status_code}"}
        xml_bytes = resp.content
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    try:
        root = ET.fromstring(xml_bytes)
    except ET.ParseError as e:
        return {"success": False, "error": f"Failed to parse RSS: {str(e)}"}

    channel = root.find("channel")
    if channel is None:
        return {"success": False, "error": "No channel found"}

    seen = set()
    articles = []
    for item in channel.findall("item"):
        raw_title = _cdata(item.findtext("title") or "")
        title = _clean_title(raw_title)

        url = _cdata(item.findtext("link") or item.findtext("guid") or "")
        pub = (item.findtext("pubDate") or "").strip()
        desc_html = item.findtext("description") or ""
        desc = re.sub(r'<[^>]+>', '', desc_html).strip()[:200]

        # Extract image from media:content attribute
        image = ""
        media_content = item.find("{http://search.yahoo.com/mrss/}content")
        if media_content is not None:
            image = media_content.get("url") or ""

        if not title or url in seen:
            continue
        seen.add(url)

        articles.append({
            "title": title,
            "url": url,
            "description": desc,
            "published": pub,
            "image": image,
            "source": "The Independent",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "The Independent",
            "articles": articles[:20],
            "total": len(articles[:20]),
        }
    }
