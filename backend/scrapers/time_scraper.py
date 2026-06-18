import re
import requests
from xml.etree import ElementTree as ET
from html import unescape
from concurrent.futures import ThreadPoolExecutor, as_completed

FEED_URL = "https://time.com/feed/"

CATEGORIES = {
    "top":          ("Top Stories",  FEED_URL),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
}

ARTICLE_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,*/*",
    "Referer": "https://time.com/",
}

MEDIA_NS   = "http://search.yahoo.com/mrss/"
DC_NS      = "http://purl.org/dc/elements/1.1/"
CONTENT_NS = "http://purl.org/rss/1.0/modules/content/"


def _cdata(text: str) -> str:
    t = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', text or '', flags=re.DOTALL)
    return unescape(t).strip()


def _rss_image(item: ET.Element) -> str:
    """Extract image from media:group/thumbnail if present."""
    mg = item.find(f"{{{MEDIA_NS}}}group")
    if mg is not None:
        mt = mg.find(f"{{{MEDIA_NS}}}thumbnail")
        if mt is not None:
            url = mt.get("url", "")
            if url and "jwplayer" not in url:
                return url
            elif url:
                return url  # JWPlayer poster is still a valid image
    return ""


def _fetch_og_image(url: str) -> str:
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


def get_time_news(payload):
    category = (payload.get("category") or "top").strip().lower()
    # Time.com only has one main feed; accept "top" or any section name gracefully
    display_name = "Top Stories"
    feed_url = FEED_URL

    try:
        resp = requests.get(feed_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"TIME RSS returned HTTP {resp.status_code}"}
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
        title  = _cdata(item.findtext("title") or "")
        link   = _cdata(item.findtext("link") or item.findtext("guid") or "")
        desc   = _cdata(item.findtext("description") or "")[:200]
        pub    = (item.findtext("pubDate") or "").strip()
        author = _cdata(item.findtext(f"{{{DC_NS}}}creator") or "")
        cat    = _cdata(item.findtext("category") or "")
        thumb  = _rss_image(item)

        if not link or link in seen or not title:
            continue
        seen.add(link)
        raw_articles.append({
            "title": title, "url": link, "description": desc,
            "published": pub, "author": author, "category_tag": cat,
            "thumb": thumb
        })

    # Only fetch og:image for articles without a thumbnail
    needs_fetch = [a for a in raw_articles if not a["thumb"]]
    has_thumb   = [a for a in raw_articles if a["thumb"]]

    image_map: dict[str, str] = {a["url"]: a["thumb"] for a in has_thumb}

    if needs_fetch:
        with ThreadPoolExecutor(max_workers=10) as executor:
            future_map = {executor.submit(_fetch_og_image, a["url"]): a["url"] for a in needs_fetch}
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
            "author": a["author"],
            "source": "TIME",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "TIME",
            "articles": articles[:25],
            "total": len(articles),
        }
    }
