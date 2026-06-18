import re
import requests
from xml.etree import ElementTree as ET
from html import unescape
from concurrent.futures import ThreadPoolExecutor, as_completed

RSS_NS = "http://purl.org/rss/1.0/"
DC_NS  = "http://purl.org/dc/elements/1.1/"

CATEGORIES = {
    "top":         ("Top News",    "https://rss.dw.com/rdf/rss-en-top"),
    "all":         ("All News",    "https://rss.dw.com/rdf/rss-en-all"),
    "world":       ("World",       "https://rss.dw.com/rdf/rss-en-world"),
    "africa":      ("Africa",      "https://rss.dw.com/rdf/rss-en-africa"),
    "science":     ("Science",     "https://rss.dw.com/rdf/rss-en-science"),
    "sports":      ("Sports",      "https://rss.dw.com/rdf/rss-en-sports"),
    "environment": ("Environment", "https://rss.dw.com/rdf/rss-en-environment"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
}

ARTICLE_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,*/*",
    "Referer": "https://www.dw.com/",
}


def _cdata(text: str) -> str:
    t = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', text or '', flags=re.DOTALL)
    return unescape(t).strip()


def _clean_link(url: str) -> str:
    """Strip maca tracking parameters from DW URLs."""
    return url.split('?')[0] if url else url


def _fetch_og_image(url: str) -> str:
    """Fetch DW article page and extract og:image."""
    try:
        resp = requests.get(url, headers=ARTICLE_HEADERS, timeout=10)
        if resp.status_code != 200:
            return ""
        html = resp.text[:25000]  # DW needs more HTML (React Helmet)
        # og:image with data-rh or standard
        m = re.search(r'property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)
        if not m:
            m = re.search(r'content=["\']([^"\']+)["\']\s+property=["\']og:image["\']', html, re.I)
        if m:
            return m.group(1).strip()
        # Fallback: static.dw.com direct URL ending in _6.jpg
        s = re.search(r'https://static\.dw\.com/image/\d+_6\.jpg', html)
        return s.group(0) if s else ""
    except Exception:
        return ""


def get_dw(payload):
    category = (payload.get("category") or "top").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, feed_url = CATEGORIES[category]

    try:
        resp = requests.get(feed_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"DW RSS returned HTTP {resp.status_code}"}
        xml_bytes = resp.content
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    try:
        root = ET.fromstring(xml_bytes)
    except ET.ParseError as e:
        return {"success": False, "error": f"Failed to parse RSS: {str(e)}"}

    seen = set()
    raw_articles = []
    for item in root.findall(f"{{{RSS_NS}}}item"):
        title = _cdata(item.findtext(f"{{{RSS_NS}}}title") or "")
        raw_link = _cdata(item.findtext(f"{{{RSS_NS}}}link") or "")
        link = _clean_link(raw_link)
        desc = _cdata(item.findtext(f"{{{RSS_NS}}}description") or "")[:200]
        pub = (item.findtext(f"{{{DC_NS}}}date") or "").strip()

        if not link or link in seen or not title:
            continue
        seen.add(link)
        raw_articles.append({"title": title, "url": link, "description": desc, "published": pub})

    raw_articles = raw_articles[:20]

    # Concurrent og:image fetch
    image_map: dict[str, str] = {}
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_map = {executor.submit(_fetch_og_image, a["url"]): a["url"] for a in raw_articles}
        for future in as_completed(future_map):
            url = future_map[future]
            try:
                image_map[url] = future.result()
            except Exception:
                image_map[url] = ""

    articles = []
    for a in raw_articles:
        articles.append({
            "title": a["title"],
            "url": a["url"],
            "description": a["description"],
            "published": a["published"],
            "image": image_map.get(a["url"], ""),
            "source": "DW",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "DW",
            "articles": articles,
            "total": len(articles),
        }
    }
