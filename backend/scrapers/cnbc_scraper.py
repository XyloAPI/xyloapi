import html
import re
import requests
from bs4 import BeautifulSoup

CATEGORIES = {
    "all":          ("CNBC Terbaru",      "https://www.cnbcindonesia.com/rss"),
    "news":         ("CNBC News",         "https://www.cnbcindonesia.com/news/rss"),
    "market":        ("CNBC Market",       "https://www.cnbcindonesia.com/market/rss"),
    "tech":         ("CNBC Tech",         "https://www.cnbcindonesia.com/tech/rss"),
    "syariah":      ("CNBC Syariah",      "https://www.cnbcindonesia.com/syariah/rss"),
    "lifestyle":    ("CNBC Lifestyle",    "https://www.cnbcindonesia.com/lifestyle/rss"),
    "entrepreneur": ("CNBC Entrepreneur", "https://www.cnbcindonesia.com/entrepreneur/rss"),
    "opini":        ("CNBC Opini",        "https://www.cnbcindonesia.com/opini/rss"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
}


def clean_description(desc):
    if not desc:
        return ""
    # Strip HTML tags
    cleaned = re.sub(r'<[^>]+>', '', desc)
    # Unescape HTML entities
    cleaned = html.unescape(cleaned)
    return cleaned.strip()


def get_cnbc_news(payload):
    category = (payload.get("category") or "all").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, feed_url = CATEGORIES[category]

    try:
        resp = requests.get(feed_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"CNBC Indonesia returned HTTP {resp.status_code}"}
        xml_content = resp.content
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    try:
        soup = BeautifulSoup(xml_content, "xml")
    except Exception as e:
        return {"success": False, "error": f"Failed to parse XML: {str(e)}"}

    items = soup.find_all("item")
    articles = []

    for item in items[:20]:
        title = item.find("title").get_text(strip=True) if item.find("title") else ""
        link = item.find("link").get_text(strip=True) if item.find("link") else ""
        pub = item.find("pubDate").get_text(strip=True) if item.find("pubDate") else ""
        desc_raw = item.find("description").get_text(strip=True) if item.find("description") else ""
        desc = clean_description(desc_raw)

        # Extract image URL from enclosure tag
        enclosure = item.find("enclosure")
        image = enclosure.get("url") if enclosure else ""

        articles.append({
            "title": title,
            "url": link,
            "description": desc,
            "published": pub,
            "image": image,
            "source": "CNBC Indonesia",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "CNBC Indonesia",
            "articles": articles,
            "total": len(articles),
        }
    }
