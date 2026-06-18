import re
import requests
from xml.etree import ElementTree as ET
from html import unescape

CATEGORIES = {
    "top":     ("Top Stories",  "site:wmtv15news.com"),
    "news":    ("Local News",   "site:wmtv15news.com news OR police OR crash OR road OR community OR arrest"),
    "weather": ("Weather",      "site:wmtv15news.com weather OR storm OR forecast OR rain OR snow OR heat OR warning"),
    "sports":  ("Sports",       "site:wmtv15news.com sports OR football OR basketball OR badger OR badgers"),
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
    title = re.sub(r'\s*[-–|]\s*WMTV\s*15\s*NEWS\s*$', '', title, flags=re.I)
    title = re.sub(r'\s*[-–|]\s*Breaking News,\s*Weather,\s*Sports\s*\|\s*Madison,\s*WI\s*$', '', title, flags=re.I)
    return title.strip()


def get_wmtv(payload):
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
        return {"success": False, "error": f"Failed to parse RSS XML: {str(e)}"}

    channel = root.find("channel")
    if channel is None:
        return {"success": False, "error": "No channel found in RSS XML"}

    seen = set()
    articles = []
    for item in channel.findall("item"):
        raw_title = _cdata(item.findtext("title") or "")
        title = _clean_title(raw_title)

        source = item.find("source")
        source_name = source.text.strip() if source is not None and source.text else ""
        if source_name and "wmtv" not in source_name.lower():
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
            "source": "WMTV 15 News",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "WMTV 15 News",
            "articles": articles[:20],
            "total": len(articles[:20]),
        }
    }
