import re
import requests
from xml.etree import ElementTree as ET
from html import unescape

FEED_URL = "https://mothership.sg/feed/"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
}

CONTENT_NS = "http://purl.org/rss/1.0/modules/content/"
DC_NS = "http://purl.org/dc/elements/1.1/"


def _cdata(text: str) -> str:
    t = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', text or '', flags=re.DOTALL)
    return unescape(t).strip()


def _extract_primary_image(content_encoded: str) -> str:
    """Extract the primary image from content:encoded HTML."""
    # Mothership marks cover image with class="type:primaryImage"
    m = re.search(r'<img[^>]+class=["\'][^"\']*type:primaryImage[^"\']*["\'][^>]+src=["\']([^"\']+)["\']', content_encoded, re.I)
    if not m:
        m = re.search(r'<img[^>]+src=["\'][^"\']*type:primaryImage[^"\']*["\']', content_encoded, re.I)
    if m:
        return m.group(1)

    # Fallback: first img tag with static.mothership.sg domain
    m = re.search(r'src=["\'](\bhttps://static\.mothership\.sg/[^"\']+)["\']', content_encoded, re.I)
    if m:
        return m.group(1)

    # Fallback: any img src
    m = re.search(r'<img[^>]+src=["\']([^"\']+\.(?:png|jpg|jpeg|webp))["\']', content_encoded, re.I)
    return m.group(1) if m else ""


def get_mothership_news(payload):
    # Mothership only has one feed — category param is ignored but accepted for API consistency
    try:
        resp = requests.get(FEED_URL, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"Mothership RSS returned HTTP {resp.status_code}"}
        xml_bytes = resp.content
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    try:
        # Mothership RSS can contain bare & entities — clean before parsing
        xml_text = xml_bytes.decode('utf-8', errors='replace')
        # Replace unescaped & that aren't already part of &amp; &lt; &gt; &apos; &quot; or &#...;
        xml_text = re.sub(r'&(?!amp;|lt;|gt;|apos;|quot;|#\d+;|#x[0-9a-fA-F]+;)', '&amp;', xml_text)
        root = ET.fromstring(xml_text.encode('utf-8'))
    except ET.ParseError as e:
        return {"success": False, "error": f"Failed to parse RSS: {str(e)}"}

    channel = root.find("channel")
    if channel is None:
        return {"success": False, "error": "No channel found in RSS"}

    articles = []
    for item in channel.findall("item"):
        title   = _cdata(item.findtext("title") or "")
        link    = _cdata(item.findtext("link") or item.findtext("guid") or "")
        desc    = _cdata(item.findtext("description") or "")
        pub     = (item.findtext("pubDate") or "").strip()
        author  = _cdata(item.findtext(f"{{{DC_NS}}}creator") or "")

        # Image from content:encoded primary image
        content_encoded = item.findtext(f"{{{CONTENT_NS}}}encoded") or ""
        image = _extract_primary_image(content_encoded)

        if title and link:
            articles.append({
                "title": title,
                "url": link,
                "description": desc[:200],
                "published": pub,
                "image": image,
                "author": author,
                "source": "Mothership",
            })

    return {
        "success": True,
        "data": {
            "category": "Latest",
            "source": "Mothership",
            "articles": articles[:25],
            "total": len(articles),
        }
    }
