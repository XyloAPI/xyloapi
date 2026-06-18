import re
import requests
from xml.etree import ElementTree as ET
from html import unescape

CATEGORIES = {
    "latest":       ("Latest",        "https://feeds.foxnews.com/foxnews/latest"),
    "national":     ("National",      "https://feeds.foxnews.com/foxnews/national"),
    "world":        ("World",         "https://feeds.foxnews.com/foxnews/world"),
    "politics":     ("Politics",      "https://feeds.foxnews.com/foxnews/politics"),
    "business":     ("Business",      "https://feeds.foxnews.com/foxnews/business"),
    "technology":   ("Technology",    "https://feeds.foxnews.com/foxnews/tech"),
    "science":      ("Science",       "https://feeds.foxnews.com/foxnews/science"),
    "health":       ("Health",        "https://feeds.foxnews.com/foxnews/health"),
    "entertainment":("Entertainment", "https://feeds.foxnews.com/foxnews/entertainment"),
    "sports":       ("Sports",        "https://feeds.foxnews.com/foxnews/sports"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
}

MEDIA_NS = "http://search.yahoo.com/mrss/"
CONTENT_NS = "http://purl.org/rss/1.0/modules/content/"


def _cdata(text: str) -> str:
    t = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', text or '', flags=re.DOTALL)
    return unescape(t).strip()


def get_foxnews(payload):
    category = (payload.get("category") or "latest").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, feed_url = CATEGORIES[category]

    try:
        resp = requests.get(feed_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"Fox News RSS returned HTTP {resp.status_code}"}
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

        # Image from media:content
        mc = item.find(f"{{{MEDIA_NS}}}content")
        image = mc.get("url", "") if mc is not None else ""
        # Remove tracking params from image URL
        if image and "?" in image:
            image = image.split("?")[0]

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
                "source": "Fox News",
            })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "Fox News",
            "articles": articles[:25],
            "total": len(articles),
        }
    }
