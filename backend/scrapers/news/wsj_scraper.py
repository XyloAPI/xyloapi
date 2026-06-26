import re
import requests
from xml.etree import ElementTree as ET
from html import unescape

CATEGORIES = {
    "top":      ("Top News",  "site:wsj.com"),
    "business": ("Business",  "site:wsj.com/business"),
    "tech":     ("Tech",      "site:wsj.com/tech"),
    "politics": ("Politics",  "site:wsj.com/politics"),
    "opinion":  ("Opinion",   "site:wsj.com/opinion"),
    "world":    ("World",     "site:wsj.com/world"),
    "economy":  ("Economy",   "site:wsj.com/economy"),
    "finance":  ("Finance",   "site:wsj.com/finance"),
    "us":       ("US News",   "site:wsj.com/us-news"),
    "sports":   ("Sports",    "site:wsj.com/sports"),
}

BASE_FEED = "https://news.google.com/rss/search"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
}

WSJ_SOURCE_NAMES = {"Wall Street Journal", "WSJ", "The Wall Street Journal"}


def _cdata(text: str) -> str:
    t = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', text or '', flags=re.DOTALL)
    return unescape(t).strip()


def _clean_title(title: str) -> str:
    """Remove ' - WSJ' or ' - Wall Street Journal' suffix."""
    return re.sub(r'\s*[-–]\s*(?:WSJ|Wall Street Journal)\s*$', '', title).strip()


def get_wsj(payload):
    category = (payload.get("category") or "top").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, query = CATEGORIES[category]

    params = {"q": query, "hl": "en-US", "gl": "US", "ceid": "US:en"}

    try:
        resp = requests.get(BASE_FEED, params=params, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"Google News returned HTTP {resp.status_code}"}
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

        # Filter WSJ-only items
        source = item.find("source")
        source_name = source.text.strip() if source is not None and source.text else ""
        if source_name and not any(n in source_name for n in ["Wall Street Journal", "WSJ"]):
            continue

        glink = _cdata(item.findtext("link") or item.findtext("guid") or "")
        pub = (item.findtext("pubDate") or "").strip()
        desc_html = item.findtext("description") or ""
        desc = re.sub(r'<[^>]+>', '', desc_html).strip()[:200]

        if not title or glink in seen:
            continue
        seen.add(glink)

        articles.append({
            "title": title,
            "url": glink,
            "description": desc,
            "published": pub,
            "image": "",
            "source": "The Wall Street Journal",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "The Wall Street Journal",
            "articles": articles[:20],
            "total": len(articles),
        }
    }
