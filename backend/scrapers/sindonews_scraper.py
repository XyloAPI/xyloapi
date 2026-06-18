import re
import requests
from bs4 import BeautifulSoup

CATEGORIES = {
    "latest":        ("Sindonews Terbaru",     "https://www.sindonews.com/feed"),
    "nasional":      ("Sindonews Nasional",    "https://nasional.sindonews.com/rss"),
    "daerah":        ("Sindonews Daerah",      "https://daerah.sindonews.com/rss"),
    "ekbis":         ("Sindonews Ekbis",       "https://ekbis.sindonews.com/rss"),
    "international": ("Sindonews International","https://international.sindonews.com/rss"),
    "sports":        ("Sindonews Sports",      "https://sports.sindonews.com/rss"),
    "tekno":         ("Sindonews Tekno",       "https://tekno.sindonews.com/rss"),
    "otomotif":      ("Sindonews Otomotif",    "https://otomotif.sindonews.com/rss"),
    "lifestyle":     ("Sindonews Lifestyle",    "https://lifestyle.sindonews.com/rss"),
    "kalam":         ("Sindonews Kalam",       "https://kalam.sindonews.com/rss"),
    "edukasi":       ("Sindonews Edukasi",     "https://edukasi.sindonews.com/rss"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
}


def get_sindo_news(payload):
    category = (payload.get("category") or "latest").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, feed_url = CATEGORIES[category]

    try:
        resp = requests.get(feed_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"Sindonews returned HTTP {resp.status_code}"}
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
        desc = item.find("description").get_text(strip=True) if item.find("description") else ""

        image = ""
        content_tag = item.find("content")
        if content_tag and content_tag.get("url"):
            image = content_tag.get("url")
        else:
            media_content = item.find(lambda t: t and t.name == "content" and t.get("url"))
            if media_content:
                image = media_content.get("url")

        articles.append({
            "title": title,
            "url": link,
            "description": desc,
            "published": pub,
            "image": image,
            "source": "Sindonews",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "Sindonews",
            "articles": articles,
            "total": len(articles),
        }
    }
