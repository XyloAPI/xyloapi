import re
import requests
from xml.etree import ElementTree as ET
from html import unescape

CATEGORIES = {
    "top":        ("Most Popular",         "https://www.forbes.com/most-popular/feed/", True),
    "business":   ("Business",             "https://www.forbes.com/business/feed/",     True),
    "innovation": ("Innovation",           "https://www.forbes.com/innovation/feed/",   True),
    "investing":  ("Investing & Money",    "site:forbes.com investing OR stocks OR crypto OR finance", False),
    "leadership": ("Leadership & Careers", "site:forbes.com leadership OR executive OR career OR management", False),
    "lifestyle":  ("Lifestyle & Travel",   "site:forbes.com lifestyle OR travel OR style OR food OR dining", False),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
}


def _cdata(text: str) -> str:
    t = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', text or '', flags=re.DOTALL)
    return unescape(t).strip()


def _clean_title(title: str) -> str:
    title = re.sub(r'\s*[-–|]\s*Forbes\s*$', '', title, flags=re.I)
    return title.strip()


def get_forbes(payload):
    category = (payload.get("category") or "top").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, target, is_native = CATEGORIES[category]

    try:
        if is_native:
            resp = requests.get(target, headers=HEADERS, timeout=15)
            if resp.status_code != 200:
                return {"success": False, "error": f"Forbes returned HTTP {resp.status_code}"}
            xml_bytes = resp.content
        else:
            # Google News RSS search query fallback
            gnews_headers = {"User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"}
            params = {"q": target, "hl": "en-US", "gl": "US", "ceid": "US:en"}
            resp = requests.get("https://news.google.com/rss/search", params=params, headers=gnews_headers, timeout=15)
            if resp.status_code != 200:
                return {"success": False, "error": f"Google News fallback returned HTTP {resp.status_code}"}
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
    media_ns = "http://search.yahoo.com/mrss/"

    for item in channel.findall("item"):
        raw_title = _cdata(item.findtext("title") or "")
        title = _clean_title(raw_title)

        if not is_native:
            source = item.find("source")
            source_name = source.text.strip() if source is not None and source.text else ""
            if source_name and "forbes" not in source_name.lower():
                continue

        url = _cdata(item.findtext("link") or item.findtext("guid") or "")
        pub = (item.findtext("pubDate") or "").strip()
        
        desc_html = item.findtext("description") or ""
        desc = re.sub(r'<[^>]+>', '', desc_html).strip()

        if not title or url in seen:
            continue
        seen.add(url)

        # Retrieve media content if available
        image = ""
        media_content = item.find(f"{{{media_ns}}}content")
        if media_content is not None:
            image = (media_content.get("url") or "").strip()

        articles.append({
            "title": title,
            "url": url,
            "description": desc,
            "published": pub,
            "image": image,
            "source": "Forbes",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "Forbes",
            "articles": articles[:20],
            "total": len(articles[:20]),
        }
    }
