import re
import requests
from xml.etree import ElementTree as ET
from html import unescape
from concurrent.futures import ThreadPoolExecutor, as_completed

CATEGORIES = {
    "latest":       ("Latest",        "https://www.ms.now/feed/"),
    "news":         ("News",          "https://www.ms.now/category/news/feed/"),
    "politics":     ("Politics",      "https://www.ms.now/category/politics/feed/"),
    "opinion":      ("Opinion",       "https://www.ms.now/category/opinion/feed/"),
    "world":        ("World",         "https://www.ms.now/category/world/feed/"),
    "business":     ("Business",      "https://www.ms.now/category/business/feed/"),
    "health":       ("Health",        "https://www.ms.now/category/health/feed/"),
    "culture":      ("Culture",       "https://www.ms.now/category/culture/feed/"),
    "sports":       ("Sports",        "https://www.ms.now/category/sports/feed/"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
}

ARTICLE_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,*/*",
    "Referer": "https://www.ms.now/",
}

CONTENT_NS = "http://purl.org/rss/1.0/modules/content/"
DC_NS = "http://purl.org/dc/elements/1.1/"


def _sanitize_xml(text: str) -> str:
    """Fix bare & that aren't valid XML entities."""
    return re.sub(r'&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[\da-fA-F]+);)', '&amp;', text)


def _cdata(text: str) -> str:
    t = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', text or '', flags=re.DOTALL)
    return unescape(t).strip()


def _fetch_og_image(url: str) -> str:
    """Fetch MS NOW article page and extract og:image."""
    try:
        resp = requests.get(url, headers=ARTICLE_HEADERS, timeout=10)
        if resp.status_code != 200:
            return ""
        html = resp.text[:8000]
        m = re.search(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)
        if not m:
            m = re.search(r'<meta[^>]+content=["\']([^"\']+)["\']\s+property=["\']og:image["\']', html, re.I)
        return m.group(1).strip() if m else ""
    except Exception:
        return ""


def get_msnow(payload):
    category = (payload.get("category") or "latest").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, feed_url = CATEGORIES[category]

    try:
        resp = requests.get(feed_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"MS NOW RSS returned HTTP {resp.status_code}"}
        xml_text = _sanitize_xml(resp.text)
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    try:
        root = ET.fromstring(xml_text.encode("utf-8"))
    except ET.ParseError as e:
        return {"success": False, "error": f"Failed to parse RSS: {str(e)}"}

    channel = root.find("channel")
    if channel is None:
        return {"success": False, "error": "No channel found in RSS"}

    seen = set()
    raw_articles = []
    for item in channel.findall("item"):
        title = _cdata(item.findtext("title") or "")
        link  = _cdata(item.findtext("link") or item.findtext("guid") or "")
        pub   = (item.findtext("pubDate") or "").strip()
        author = _cdata(item.findtext(f"{{{DC_NS}}}creator") or "")

        # Description from <description> (HTML stripped)
        desc_html = item.findtext("description") or ""
        desc = re.sub(r'<[^>]+>', '', _cdata(desc_html)).strip()[:200]

        if not link or link in seen or not title:
            continue
        seen.add(link)
        raw_articles.append({"title": title, "url": link, "description": desc, "published": pub, "author": author})

    raw_articles = raw_articles[:20]

    # Concurrent fetch og:image
    urls = [a["url"] for a in raw_articles]
    image_map: dict[str, str] = {}
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_map = {executor.submit(_fetch_og_image, u): u for u in urls}
        for future in as_completed(future_map):
            u = future_map[future]
            try:
                image_map[u] = future.result()
            except Exception:
                image_map[u] = ""

    articles = []
    for a in raw_articles:
        articles.append({
            "title": a["title"],
            "url": a["url"],
            "description": a["description"],
            "published": a["published"],
            "image": image_map.get(a["url"], ""),
            "author": a["author"],
            "source": "MS NOW",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "MS NOW",
            "articles": articles,
            "total": len(articles),
        }
    }
