import re
import requests
from xml.etree import ElementTree as ET
from html import unescape

CATEGORIES = {
    "top":          ("Top News",    "site:thetimes.com"),
    "uk":           ("UK News",     "site:thetimes.com/uk"),
    "world":        ("World",       "site:thetimes.com/world"),
    "politics":     ("Politics",    "site:thetimes.com/politics"),
    "business":     ("Business",    "site:thetimes.com/business"),
    "technology":   ("Technology",  "site:thetimes.com/technology"),
    "health":       ("Health",      "site:thetimes.com/health"),
    "culture":      ("Culture",     "site:thetimes.com/culture"),
    "sport":        ("Sport",       "site:thetimes.com/sport"),
    "comment":      ("Comment",     "site:thetimes.com/comment"),
}

BASE_FEED = "https://news.google.com/rss/search"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
}

TIMES_SOURCES = {"The Times", "The Sunday Times"}


def _cdata(text: str) -> str:
    t = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', text or '', flags=re.DOTALL)
    return unescape(t).strip()


def _clean_title(title: str) -> str:
    return re.sub(r'\s*[-–]\s*The (?:Sunday )?Times\s*$', '', title).strip()


def get_thetimes(payload):
    category = (payload.get("category") or "top").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, query = CATEGORIES[category]

    params = {"q": query, "hl": "en-GB", "gl": "GB", "ceid": "GB:en"}

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

        source = item.find("source")
        source_name = source.text.strip() if source is not None and source.text else ""
        if source_name and not any(n in source_name for n in TIMES_SOURCES):
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
            "source": "The Times",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "The Times",
            "articles": articles[:20],
            "total": len(articles),
        }
    }
