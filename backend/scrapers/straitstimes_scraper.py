import re
import requests
from xml.etree import ElementTree as ET
from html import unescape
from html.parser import HTMLParser

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
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
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

    ns = {
        "dc": "http://purl.org/dc/elements/1.1/",
        "content": "http://purl.org/rss/1.0/modules/content/",
    }

    channel = root.find("channel")
    if channel is None:
        return {"success": False, "error": "No channel found in RSS feed"}

    channel_title = (channel.findtext("title") or "The Straits Times").strip()

    articles = []
    for item in channel.findall("item"):
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or item.findtext("guid") or "").strip()
        pub_date = (item.findtext("pubDate") or "").strip()

        raw_desc = item.findtext("description") or ""
        description = strip_html(raw_desc)

        # Try to get image from enclosure or media tags
        image_url = None
        enclosure = item.find("enclosure")
        if enclosure is not None:
            image_url = enclosure.get("url")

        if not image_url:
            # Try to find image in content:encoded
            content_encoded = item.findtext("{http://purl.org/rss/1.0/modules/content/}encoded") or ""
            img_match = re.search(r'src=["\']([^"\']+?\.(?:jpg|jpeg|png|webp))["\']', content_encoded)
            if img_match:
                image_url = img_match.group(1)

        if title and link:
            articles.append({
                "title": title,
                "url": link,
                "description": description[:200] if description else "",
                "published": pub_date,
                "image": image_url or "",
                "source": "The Straits Times",
            })

    return {
        "success": True,
        "data": {
            "category": CATEGORIES.get(category, category.title()),
            "source": channel_title,
            "articles": articles[:25],
            "total": len(articles),
        }
    }
