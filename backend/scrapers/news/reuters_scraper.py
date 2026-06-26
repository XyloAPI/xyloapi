import re
import requests
from xml.etree import ElementTree as ET
from html import unescape

CATEGORIES = {
    "top":          ("Top News",    "site:reuters.com"),
    "world":        ("World",       "site:reuters.com/world"),
    "business":     ("Business",    "site:reuters.com/business"),
    "markets":      ("Markets",     "site:reuters.com/markets"),
    "technology":   ("Technology",  "site:reuters.com/technology"),
    "science":      ("Science",     "site:reuters.com/science"),
    "sports":       ("Sports",      "site:reuters.com/sports"),
    "lifestyle":    ("Lifestyle",   "site:reuters.com/lifestyle"),
    "legal":        ("Legal",       "site:reuters.com/legal"),
    "health":       ("Health",      "site:reuters.com/health"),
}

BASE_FEED = "https://news.google.com/rss/search"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
}


def _cdata(text: str) -> str:
    t = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', text or '', flags=re.DOTALL)
    return unescape(t).strip()


def _clean_title(title: str) -> str:
    """Remove ' - Reuters' suffix."""
    return re.sub(r'\s*[-–]\s*Reuters\s*$', '', title).strip()


def get_reuters(payload):
    category = (payload.get("category") or "top").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, query = CATEGORIES[category]

    params = {
        "q": query,
        "hl": "en-US",
        "gl": "US",
        "ceid": "US:en",
    }

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

        # Filter Reuters-only
        source = item.find("source")
        source_name = source.text if source is not None else ""
        if source_name and "Reuters" not in source_name:
            continue

        # Google redirect link (no real Reuters URL extractable from description)
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
            "source": "Reuters",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "Reuters",
            "articles": articles[:20],
            "total": len(articles),
        }
    }
