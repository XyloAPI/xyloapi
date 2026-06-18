import re
import requests
from xml.etree import ElementTree as ET
from html import unescape

CATEGORIES = {
    "latest":       ("Latest News",   "https://rss.punchng.com/v1/category/latest_news"),
    "featured":     ("Featured",      "https://rss.punchng.com/v1/category/featured"),
    "news":         ("General News",  "https://rss.punchng.com/v1/category/news"),
    "politics":     ("Politics",      "https://rss.punchng.com/v1/category/politics"),
    "sports":       ("Sports",        "https://rss.punchng.com/v1/category/sports"),
    "business":     ("Business",      "https://rss.punchng.com/v1/category/business"),
    "metro":        ("Metro Plus",    "https://rss.punchng.com/v1/category/metro_plus"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
}


def _cdata(text: str) -> str:
    t = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', text or '', flags=re.DOTALL)
    return unescape(t).strip()


def _clean_title(title: str) -> str:
    title = re.sub(r'\s*[-|–]\s*Punch\s*Newspapers\s*$', '', title, flags=re.I)
    return title.strip()


def get_punch_news(payload):
    category = (payload.get("category") or "latest").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, feed_url = CATEGORIES[category]

    try:
        resp = requests.get(feed_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"Punch RSS returned HTTP {resp.status_code}"}
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
        desc_raw = item.findtext("description") or ""
        desc_clean = re.sub(r'Read More:\s*https?://\S+', '', desc_raw, flags=re.I)
        desc = re.sub(r'<[^>]+>', '', desc_clean).strip()[:200]

        # Extract image from enclosure
        image = ""
        enclosure = item.find("enclosure")
        if enclosure is not None:
            image = enclosure.get("url") or ""

        if not title or url in seen:
            continue
        seen.add(url)

        articles.append({
            "title": title,
            "url": url,
            "description": desc,
            "published": pub,
            "image": image,
            "source": "The Punch",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "The Punch",
            "articles": articles[:20],
            "total": len(articles[:20]),
        }
    }
