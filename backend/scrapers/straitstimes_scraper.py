import re
import requests
from xml.etree import ElementTree as ET
from html import unescape
from html.parser import HTMLParser
from concurrent.futures import ThreadPoolExecutor, as_completed

# Available categories and their RSS endpoints
CATEGORIES = {
    "singapore": "Singapore",
    "asia":      "Asia",
    "world":     "World",
    "business":  "Business",
    "sport":     "Sport",
    "life":      "Life & Style",
    "opinion":   "Opinion",
    "multimedia": "Multimedia",
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}


class _HTMLStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self.result = []

    def handle_data(self, data):
        self.result.append(data)

    def get_data(self):
        return "".join(self.result).strip()


def strip_html(text):
    s = _HTMLStripper()
    try:
        s.feed(unescape(text or ""))
        return s.get_data()
    except Exception:
        return re.sub(r"<[^>]+>", "", unescape(text or "")).strip()


def _fetch_og_image(url: str) -> str:
    """Fetch og:image meta tag from an article page. Returns empty string on failure."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=8)
        if resp.status_code != 200:
            return ""
        html = resp.text

        # Fast regex — og:image is always in <head>, no need to parse full DOM
        m = re.search(
            r'<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']',
            html, re.IGNORECASE
        )
        if not m:
            m = re.search(
                r'<meta\s+content=["\']([^"\']+)["\']\s+property=["\']og:image["\']',
                html, re.IGNORECASE
            )
        return m.group(1).strip() if m else ""
    except Exception:
        return ""


def get_straitstimes_news(payload):
    category = (payload.get("category") or "singapore").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {
            "success": False,
            "error": f"Invalid category '{category}'. Valid categories: {valid}"
        }

    rss_url = f"https://www.straitstimes.com/news/{category}/rss.xml"

    try:
        resp = requests.get(rss_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"RSS feed returned HTTP {resp.status_code}"}
        xml_content = resp.content
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    # Parse XML
    try:
        root = ET.fromstring(xml_content)
    except ET.ParseError as e:
        return {"success": False, "error": f"Failed to parse RSS XML: {str(e)}"}

    channel = root.find("channel")
    if channel is None:
        return {"success": False, "error": "No channel found in RSS feed"}

    channel_title = (channel.findtext("title") or "The Straits Times").strip()

    # Build article list from RSS (no images yet)
    articles = []
    for item in channel.findall("item"):
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or item.findtext("guid") or "").strip()
        pub_date = (item.findtext("pubDate") or "").strip()
        raw_desc = item.findtext("description") or ""
        description = strip_html(raw_desc)

        if title and link:
            articles.append({
                "title": title,
                "url": link,
                "description": description[:200] if description else "",
                "published": pub_date,
                "image": "",
                "source": "The Straits Times",
            })

    articles = articles[:20]  # limit to 20 for speed

    # Concurrently fetch og:image for each article (max 10 workers)
    urls = [a["url"] for a in articles]
    images = [""] * len(urls)

    with ThreadPoolExecutor(max_workers=10) as executor:
        future_to_idx = {
            executor.submit(_fetch_og_image, url): idx
            for idx, url in enumerate(urls)
        }
        for future in as_completed(future_to_idx):
            idx = future_to_idx[future]
            try:
                images[idx] = future.result()
            except Exception:
                images[idx] = ""

    for i, article in enumerate(articles):
        article["image"] = images[i]

    return {
        "success": True,
        "data": {
            "category": CATEGORIES.get(category, category.title()),
            "source": channel_title,
            "articles": articles,
            "total": len(articles),
        }
    }
