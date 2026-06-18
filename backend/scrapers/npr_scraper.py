import re
import requests
from xml.etree import ElementTree as ET
from html import unescape

# NPR topic IDs -> (name, feed_url)
# 1001=News, 1003=Arts, 1004=Books, 1006=Business, 1007=Education,
# 1008=Health, 1009=Law, 1014=National, 1019=Politics, 1045=Science, 1128=World
CATEGORIES = {
    "news":         ("News",           "https://feeds.npr.org/1001/rss.xml"),
    "world":        ("World",          "https://feeds.npr.org/1128/rss.xml"),
    "national":     ("National",       "https://feeds.npr.org/1014/rss.xml"),
    "politics":     ("Politics",       "https://feeds.npr.org/1019/rss.xml"),
    "business":     ("Business",       "https://feeds.npr.org/1006/rss.xml"),
    "technology":   ("Technology",     "https://feeds.npr.org/1045/rss.xml"),
    "science":      ("Science",        "https://feeds.npr.org/1045/rss.xml"),
    "health":       ("Health",         "https://feeds.npr.org/1008/rss.xml"),
    "arts":         ("Arts",           "https://feeds.npr.org/1003/rss.xml"),
    "books":        ("Books",          "https://feeds.npr.org/1004/rss.xml"),
    "education":    ("Education",      "https://feeds.npr.org/1007/rss.xml"),
    "law":          ("Law",            "https://feeds.npr.org/1009/rss.xml"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
}

CONTENT_NS = "http://purl.org/rss/1.0/modules/content/"
DC_NS      = "http://purl.org/dc/elements/1.1/"

# NPR tracking pixel to exclude
TRACKING_IMG = "npr-rss-pixel"


def _cdata(text: str) -> str:
    t = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', text or '', flags=re.DOTALL)
    return unescape(t).strip()


def _extract_image(item: ET.Element) -> str:
    """Extract first non-tracking image from content:encoded CDATA."""
    enc = item.find(f"{{{CONTENT_NS}}}encoded")
    if enc is not None and enc.text:
        imgs = re.findall(r"<img[^>]+src=['\"]([^'\"]+)['\"]", enc.text)
        for img in imgs:
            if TRACKING_IMG not in img:
                return img.strip()
    return ""


def get_npr(payload):
    category = (payload.get("category") or "news").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, feed_url = CATEGORIES[category]

    try:
        resp = requests.get(feed_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"NPR RSS returned HTTP {resp.status_code}"}
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
        image  = _extract_image(item)

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
            "source": "NPR",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "NPR",
            "articles": articles[:20],
            "total": len(articles),
        }
    }
