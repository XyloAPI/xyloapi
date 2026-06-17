import re
import requests
from xml.etree import ElementTree as ET
from html import unescape

# BBC RSS feed map: slug → (display name, feed URL)
CATEGORIES = {
    "top":          ("Top Stories",            "https://feeds.bbci.co.uk/news/rss.xml"),
    "world":        ("World",                  "https://feeds.bbci.co.uk/news/world/rss.xml"),
    "uk":           ("UK",                     "https://feeds.bbci.co.uk/news/uk/rss.xml"),
    "business":     ("Business",               "https://feeds.bbci.co.uk/news/business/rss.xml"),
    "politics":     ("Politics",               "https://feeds.bbci.co.uk/news/politics/rss.xml"),
    "technology":   ("Technology",             "https://feeds.bbci.co.uk/news/technology/rss.xml"),
    "science":      ("Science & Environment",  "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml"),
    "health":       ("Health",                 "https://feeds.bbci.co.uk/news/health/rss.xml"),
    "entertainment":("Entertainment & Arts",   "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml"),
    "sport":        ("Sport",                  "https://feeds.bbci.co.uk/sport/rss.xml"),
    "asia":         ("Asia",                   "https://feeds.bbci.co.uk/news/world/asia/rss.xml"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
}

# media namespace
MEDIA_NS = "http://search.yahoo.com/mrss/"


def _cdata(text: str) -> str:
    """Strip CDATA wrapper and HTML entities."""
    t = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', text or '', flags=re.DOTALL)
    return unescape(t).strip()


def _clean_link(url: str) -> str:
    """Remove RSS tracking params from BBC links."""
    return url.split("?")[0] if url else ""


def get_bbc_news(payload):
    category = (payload.get("category") or "top").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {
            "success": False,
            "error": f"Invalid category '{category}'. Valid categories: {valid}"
        }

    display_name, feed_url = CATEGORIES[category]

    try:
        resp = requests.get(feed_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"BBC RSS returned HTTP {resp.status_code}"}
        xml_bytes = resp.content
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    # Parse XML — register media namespace
    try:
        ET.register_namespace("media", MEDIA_NS)
        root = ET.fromstring(xml_bytes)
    except ET.ParseError as e:
        return {"success": False, "error": f"Failed to parse RSS: {str(e)}"}

    channel = root.find("channel")
    if channel is None:
        return {"success": False, "error": "No channel found in RSS"}

    articles = []
    for item in channel.findall("item"):
        title   = _cdata(item.findtext("title") or "")
        link    = _clean_link(_cdata(item.findtext("link") or item.findtext("guid") or ""))
        desc    = _cdata(item.findtext("description") or "")
        pub     = (item.findtext("pubDate") or "").strip()

        # BBC includes media:thumbnail in each item
        thumb = item.find(f"{{{MEDIA_NS}}}thumbnail")
        image = thumb.get("url", "") if thumb is not None else ""

        # Upgrade thumbnail to a larger resolution (240→1024)
        if image:
            image = re.sub(r'/standard/\d+/', '/standard/1024/', image)

        if title and link:
            articles.append({
                "title": title,
                "url": link,
                "description": desc[:200],
                "published": pub,
                "image": image,
                "source": "BBC News",
            })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "BBC News",
            "articles": articles[:25],
            "total": len(articles),
        }
    }
