import re
import requests
from xml.etree import ElementTree as ET
from html import unescape

CATEGORIES = {
    "top":          ("Top Stories",     "https://www.theguardian.com/rss"),
    "world":        ("World",           "https://www.theguardian.com/world/rss"),
    "us":           ("US News",         "https://www.theguardian.com/us-news/rss"),
    "uk":           ("UK News",         "https://www.theguardian.com/uk-news/rss"),
    "politics":     ("Politics",        "https://www.theguardian.com/politics/rss"),
    "business":     ("Business",        "https://www.theguardian.com/business/rss"),
    "technology":   ("Technology",      "https://www.theguardian.com/technology/rss"),
    "science":      ("Science",         "https://www.theguardian.com/science/rss"),
    "environment":  ("Environment",     "https://www.theguardian.com/environment/rss"),
    "sport":        ("Sport",           "https://www.theguardian.com/sport/rss"),
    "culture":      ("Culture",         "https://www.theguardian.com/culture/rss"),
    "society":      ("Society",         "https://www.theguardian.com/society/rss"),
    "opinion":      ("Opinion",         "https://www.theguardian.com/commentisfree/rss"),
    "lifestyle":    ("Life & Style",    "https://www.theguardian.com/lifeandstyle/rss"),
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


def _best_guardian_image(item: ET.Element) -> str:
    """Pick the media:content with the largest width. Use URL as-is (signed CDN URL)."""
    best_url = ""
    best_width = 0
    for mc in item.findall(f"{{{MEDIA_NS}}}content"):
        try:
            w = int(mc.get("width", "0"))
        except ValueError:
            w = 0
        url = mc.get("url", "")
        if url and w > best_width:
            best_width = w
            best_url = url
    return best_url


def _clean_description(html: str) -> str:
    """Strip HTML tags and truncate."""
    text = unescape(re.sub(r'<[^>]+>', ' ', html))
    text = re.sub(r'\s+', ' ', text).strip()
    # Remove trailing "Continue reading..."
    text = re.sub(r'\s*Continue reading\.\.\.\s*$', '', text).strip()
    return text[:200]


def get_guardian(payload):
    category = (payload.get("category") or "top").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, feed_url = CATEGORIES[category]

    try:
        resp = requests.get(feed_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"Guardian RSS returned HTTP {resp.status_code}"}
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
        desc_raw = item.findtext("description") or ""
        desc = _clean_description(_cdata(desc_raw))
        pub  = (item.findtext("pubDate") or item.findtext(f"{{{DC_NS}}}date") or "").strip()
        author = _cdata(item.findtext(f"{{{DC_NS}}}creator") or "")
        image = _best_guardian_image(item)

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
            "source": "The Guardian",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "The Guardian",
            "articles": articles[:25],
            "total": len(articles),
        }
    }
