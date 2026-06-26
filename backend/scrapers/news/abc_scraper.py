import re
import requests
from xml.etree import ElementTree as ET
from html import unescape

# ABC News RSS feeds
CATEGORIES = {
    "top":          ("Top Stories",   "https://feeds.abcnews.com/abcnews/topstories"),
    "us":           ("US News",       "https://feeds.abcnews.com/abcnews/usheadlines"),
    "politics":     ("Politics",      "https://feeds.abcnews.com/abcnews/politicsheadlines"),
    "world":        ("World News",    "https://feeds.abcnews.com/abcnews/worldnewsheadlines"),
    "business":     ("Business",      "https://feeds.abcnews.com/abcnews/moneyheadlines"),
    "technology":   ("Technology",    "https://feeds.abcnews.com/abcnews/technologyheadlines"),
    "health":       ("Health",        "https://feeds.abcnews.com/abcnews/healthheadlines"),
    "entertainment":("Entertainment", "https://feeds.abcnews.com/abcnews/entertainmentheadlines"),
    "sport":        ("Sport",         "https://feeds.abcnews.com/abcnews/sportsheadlines"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
}

MEDIA_NS = "http://search.yahoo.com/mrss/"


def _cdata(text: str) -> str:
    t = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', text or '', flags=re.DOTALL)
    return unescape(t).strip()


def _best_thumbnail(item: ET.Element) -> str:
    """Pick highest-width media:thumbnail from item."""
    thumbnails = item.findall(f"{{{MEDIA_NS}}}thumbnail")
    best_url = ""
    best_width = 0
    for t in thumbnails:
        try:
            w = int(t.get("width", 0))
        except (ValueError, TypeError):
            w = 0
        url = t.get("url", "")
        if url and w > best_width:
            best_width = w
            best_url = url
    # Fallback to first thumbnail
    if not best_url and thumbnails:
        best_url = thumbnails[0].get("url", "")
    return best_url


def get_abc_news(payload):
    category = (payload.get("category") or "top").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, feed_url = CATEGORIES[category]

    try:
        resp = requests.get(feed_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"ABC News RSS returned HTTP {resp.status_code}"}
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
        desc  = _cdata(item.findtext("description") or "")
        pub   = (item.findtext("pubDate") or "").strip()
        cat   = _cdata(item.findtext("category") or "")
        image = _best_thumbnail(item)

        if not link or link in seen:
            continue
        seen.add(link)

        if title:
            articles.append({
                "title": title,
                "url": link,
                "description": desc[:200],
                "published": pub,
                "image": image,
                "category_tag": cat,
                "source": "ABC News",
            })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "ABC News",
            "articles": articles[:25],
            "total": len(articles),
        }
    }
