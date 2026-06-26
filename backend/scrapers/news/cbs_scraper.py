import re
import requests
from xml.etree import ElementTree as ET
from html import unescape
from concurrent.futures import ThreadPoolExecutor, as_completed

CATEGORIES = {
    "main":         ("Main",          "https://www.cbsnews.com/latest/rss/main"),
    "us":           ("US",            "https://www.cbsnews.com/latest/rss/us"),
    "world":        ("World",         "https://www.cbsnews.com/latest/rss/world"),
    "politics":     ("Politics",      "https://www.cbsnews.com/latest/rss/politics"),
    "business":     ("Business",      "https://www.cbsnews.com/latest/rss/moneywatch"),
    "technology":   ("Technology",    "https://www.cbsnews.com/latest/rss/technology"),
    "health":       ("Health",        "https://www.cbsnews.com/latest/rss/health"),
    "entertainment":("Entertainment", "https://www.cbsnews.com/latest/rss/entertainment"),
    "science":      ("Science",       "https://www.cbsnews.com/latest/rss/science"),
    "sports":       ("Sports",        "https://www.cbsnews.com/latest/rss/sports"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,*/*;q=0.9",
    "Accept-Language": "en-US,en;q=0.9",
}

RSS_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
}


def _cdata(text: str) -> str:
    t = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', text or '', flags=re.DOTALL)
    return unescape(t).strip()


def _fetch_og_image(url: str) -> str:
    """Fetch CBS article page and return og:image URL."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=10)
        if resp.status_code != 200:
            return ""
        html = resp.text[:8000]
        m = re.search(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)
        if not m:
            m = re.search(r'<meta[^>]+content=["\']([^"\']+)["\']\s+property=["\']og:image["\']', html, re.I)
        return m.group(1).strip() if m else ""
    except Exception:
        return ""


def get_cbs_news(payload):
    category = (payload.get("category") or "main").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, feed_url = CATEGORIES[category]

    try:
        resp = requests.get(feed_url, headers=RSS_HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"CBS RSS returned HTTP {resp.status_code}"}
        xml_bytes = resp.content
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    try:
        root = ET.fromstring(xml_bytes)
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
        desc  = _cdata(item.findtext("description") or "")
        pub   = (item.findtext("pubDate") or "").strip()

        if not link or link in seen or not title:
            continue
        seen.add(link)
        raw_articles.append({"title": title, "url": link, "description": desc[:200], "published": pub})

    # Concurrent fetch og:image for each article
    urls = [a["url"] for a in raw_articles]
    image_map: dict[str, str] = {}
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_map = {executor.submit(_fetch_og_image, url): url for url in urls}
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
            "source": "CBS News",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "CBS News",
            "articles": articles[:25],
            "total": len(articles),
        }
    }
