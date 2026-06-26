import re
import requests
from xml.etree import ElementTree as ET
from html import unescape

CATEGORIES = {
    "home":          ("Home",          "https://feeds.skynews.com/feeds/rss/home.xml"),
    "uk":            ("UK",            "https://feeds.skynews.com/feeds/rss/uk.xml"),
    "world":         ("World",         "https://feeds.skynews.com/feeds/rss/world.xml"),
    "us":            ("US",            "https://feeds.skynews.com/feeds/rss/us.xml"),
    "business":      ("Business",      "https://feeds.skynews.com/feeds/rss/business.xml"),
    "politics":      ("Politics",      "https://feeds.skynews.com/feeds/rss/politics.xml"),
    "technology":    ("Technology",    "https://feeds.skynews.com/feeds/rss/technology.xml"),
    "entertainment": ("Entertainment", "https://feeds.skynews.com/feeds/rss/entertainment.xml"),
    "strange":       ("Strange News",  "https://feeds.skynews.com/feeds/rss/strange.xml"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
}

MEDIA_NS = "http://search.yahoo.com/mrss/"


def _cdata(text: str) -> str:
    t = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', text or '', flags=re.DOTALL)
    return unescape(t).strip()


def get_skynews(payload):
    category = (payload.get("category") or "home").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, feed_url = CATEGORIES[category]

    try:
        resp = requests.get(feed_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"Sky News RSS returned HTTP {resp.status_code}"}
        xml_bytes = resp.content
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    try:
        ET.register_namespace("media", MEDIA_NS)
        root = ET.fromstring(xml_bytes)
    except ET.ParseError as e:
        return {"success": False, "error": f"Failed to parse RSS: {str(e)}"}

    channel = root.find("channel")
    if channel is None:
        return {"success": False, "error": "No channel found in RSS"}

    seen = set()
    articles = []
    for item in channel.findall("item"):
        title = _cdata(item.findtext("title") or "")
        link  = _cdata(item.findtext("link") or item.findtext("guid") or "")
        desc  = _cdata(item.findtext("description") or "")[:200]
        pub   = (item.findtext("pubDate") or "").strip()

        # media:thumbnail has 1920x1080 image directly in RSS
        mt = item.find(f"{{{MEDIA_NS}}}thumbnail")
        image = mt.get("url", "") if mt is not None else ""

        # Fallback: enclosure
        if not image:
            enc = item.find("enclosure")
            if enc is not None:
                image = enc.get("url", "")

        if not link or link in seen or not title:
            continue
        seen.add(link)

        articles.append({
            "title": title,
            "url": link,
            "description": desc,
            "published": pub,
            "image": image,
            "source": "Sky News",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "Sky News",
            "articles": articles[:20],
            "total": len(articles),
        }
    }
