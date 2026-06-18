import re
import requests
from xml.etree import ElementTree as ET
from html import unescape

CATEGORIES = {
    "home":         ("Home Page",     "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml"),
    "world":        ("World",         "https://rss.nytimes.com/services/xml/rss/nyt/World.xml"),
    "us":           ("US",            "https://rss.nytimes.com/services/xml/rss/nyt/US.xml"),
    "politics":     ("Politics",      "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml"),
    "business":     ("Business",      "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml"),
    "technology":   ("Technology",    "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml"),
    "science":      ("Science",       "https://rss.nytimes.com/services/xml/rss/nyt/Science.xml"),
    "health":       ("Health",        "https://rss.nytimes.com/services/xml/rss/nyt/Health.xml"),
    "arts":         ("Arts",          "https://rss.nytimes.com/services/xml/rss/nyt/Arts.xml"),
    "opinion":      ("Opinion",       "https://rss.nytimes.com/services/xml/rss/nyt/Opinion.xml"),
    "climate":      ("Climate",       "https://rss.nytimes.com/services/xml/rss/nyt/Climate.xml"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
}

MEDIA_NS  = "http://search.yahoo.com/mrss/"
DC_NS     = "http://purl.org/dc/elements/1.1/"


def _cdata(text: str) -> str:
    t = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', text or '', flags=re.DOTALL)
    return unescape(t).strip()


def _best_media_image(item: ET.Element) -> str:
    """Get image URL from media:content, prefer largest."""
    mc = item.find(f"{{{MEDIA_NS}}}content")
    if mc is not None:
        url = mc.get("url", "")
        # NYT images: swap suffix for a cleaner large version
        if url:
            # Remove NYT size suffix like -mediumSquareAt3X, -superJumbo etc.
            url = re.sub(r'-(?:mediumSquareAt3X|superJumbo|jumbo|mediumFlexible|articleLarge|popup|blog480|blog427|blog533|slide|thumbnail|moth|filmstrip|square320|square640|tmagArticle|hpSmall|hpMedium|hpLarge)\b', '', url)
            return url
    return ""


def get_nytimes(payload):
    category = (payload.get("category") or "home").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, feed_url = CATEGORIES[category]

    try:
        resp = requests.get(feed_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"NYT RSS returned HTTP {resp.status_code}"}
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
        author = _cdata(item.findtext(f"{{{DC_NS}}}creator") or "")
        image = _best_media_image(item)

        if not link or link in seen or not title:
            continue
        seen.add(link)

        articles.append({
            "title": title,
            "url": link,
            "description": desc[:200],
            "published": pub,
            "image": image,
            "author": author,
            "source": "The New York Times",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "The New York Times",
            "articles": articles[:25],
            "total": len(articles),
        }
    }
