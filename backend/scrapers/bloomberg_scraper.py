import re
import requests
from xml.etree import ElementTree as ET
from html import unescape

CATEGORIES = {
    "markets":      ("Markets",       "https://feeds.bloomberg.com/markets/news.rss"),
    "technology":   ("Technology",    "https://feeds.bloomberg.com/technology/news.rss"),
    "politics":     ("Politics",      "https://feeds.bloomberg.com/politics/news.rss"),
    "economics":    ("Economics",     "https://feeds.bloomberg.com/economics/news.rss"),
    "industries":   ("Industries",    "https://feeds.bloomberg.com/industries/news.rss"),
    "green":        ("Green",         "https://feeds.bloomberg.com/green/news.rss"),
    "bview":        ("Bloomberg View","https://feeds.bloomberg.com/bview/news.rss"),
    "businessweek": ("Businessweek",  "https://feeds.bloomberg.com/businessweek/news.rss"),
    "pursuits":     ("Pursuits",      "https://feeds.bloomberg.com/pursuits/news.rss"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
}

MEDIA_NS = "http://search.yahoo.com/mrss/"
DC_NS    = "http://purl.org/dc/elements/1.1/"


def _cdata(text: str) -> str:
    t = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', text or '', flags=re.DOTALL)
    return unescape(t).strip()


def get_bloomberg(payload):
    category = (payload.get("category") or "markets").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, feed_url = CATEGORIES[category]

    try:
        resp = requests.get(feed_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"Bloomberg RSS returned HTTP {resp.status_code}"}
        xml_bytes = resp.content
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    try:
        root = ET.fromstring(xml_bytes)
    except ET.ParseError as e:
        return {"success": False, "error": f"Failed to parse RSS: {str(e)}"}

    channel = root.find("channel")
    if channel is None:
        return {"success": False, "error": "No channel found in RSS"}

    seen = set()
    articles = []
    for item in channel.findall("item"):
        title  = _cdata(item.findtext("title") or "")
        link   = _cdata(item.findtext("link") or item.findtext("guid") or "")
        desc   = _cdata(item.findtext("description") or "")[:200]
        pub    = (item.findtext("pubDate") or "").strip()
        author = _cdata(item.findtext(f"{{{DC_NS}}}creator") or "")

        # media:content has direct image URL (1200x)
        mc = item.find(f"{{{MEDIA_NS}}}content")
        image = mc.get("url", "") if mc is not None else ""

        if not link or link in seen or not title:
            continue
        seen.add(link)

        articles.append({
            "title": title,
            "url": link,
            "description": desc,
            "published": pub,
            "image": image,
            "author": author,
            "source": "Bloomberg",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "Bloomberg",
            "articles": articles[:25],
            "total": len(articles),
        }
    }
