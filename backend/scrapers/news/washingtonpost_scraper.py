import requests, re
from xml.etree import ElementTree as ET
from html import unescape

# Google News RSS — queries mapped to WaPo categories
CATEGORIES = {
    "top":          ("Top Stories",   "site:washingtonpost.com"),
    "world":        ("World",         "site:washingtonpost.com world"),
    "politics":     ("Politics",      "site:washingtonpost.com politics"),
    "us":           ("US News",       "site:washingtonpost.com national"),
    "business":     ("Business",      "site:washingtonpost.com business economy"),
    "technology":   ("Technology",    "site:washingtonpost.com technology"),
    "health":       ("Health",        "site:washingtonpost.com health science"),
    "climate":      ("Climate",       "site:washingtonpost.com climate environment"),
    "sport":        ("Sport",         "site:washingtonpost.com sports"),
    "entertainment":("Entertainment", "site:washingtonpost.com entertainment culture"),
}

BASE_FEED = "https://news.google.com/rss/search"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
}

# WaPo favicon for image fallback
WAPO_LOGO = "https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/FBQF7L2WBNBWHJSXYWCFQRYBBA.jpg&w=1440"


def _cdata(text: str) -> str:
    t = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', text or '', flags=re.DOTALL)
    return unescape(t).strip()


def _clean_title(title: str) -> str:
    """Remove ' - The Washington Post' suffix from title."""
    return re.sub(r'\s*[-–]\s*The Washington Post\s*$', '', title).strip()


def _extract_wapo_url_from_description(desc: str) -> str:
    """Extract real WaPo URL from Google News description HTML."""
    m = re.search(r'href="(https://www\.washingtonpost\.com/[^"]+)"', desc)
    return m.group(1) if m else ""


def _extract_image_from_description(desc: str) -> str:
    """Try to extract og:image from description if it contains full HTML."""
    m = re.search(r'<img[^>]+src="([^"]+)"', desc)
    return m.group(1) if m else ""


def get_washingtonpost_news(payload):
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

        # Prefer source URL from description HTML
        desc_html = item.findtext("description") or ""
        wapo_url = _extract_wapo_url_from_description(desc_html)
        if not wapo_url:
            # Fallback: Google News redirect link
            wapo_url = _cdata(item.findtext("link") or item.findtext("guid") or "")

        pub = (item.findtext("pubDate") or "").strip()
        desc = re.sub(r'<[^>]+>', '', desc_html).strip()[:200]

        # Filter: only WaPo articles
        source = item.find("source")
        source_name = source.text if source is not None else ""
        if source_name and "Washington Post" not in source_name:
            continue

        if not title or wapo_url in seen:
            continue
        seen.add(wapo_url)

        articles.append({
            "title": title,
            "url": wapo_url,
            "description": desc,
            "published": pub,
            "image": "",
            "source": "The Washington Post",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "The Washington Post",
            "articles": articles[:20],
            "total": len(articles),
        }
    }
