import re
import requests
from bs4 import BeautifulSoup

CATEGORIES = {
    "top-news":      ("Antara Top News",       "https://www.antaranews.com/rss/top-news.xml"),
    "politik":       ("Antara Politik",        "https://www.antaranews.com/rss/politik.xml"),
    "ekonomi":       ("Antara Ekonomi",        "https://www.antaranews.com/rss/ekonomi.xml"),
    "metro":         ("Antara Metro Jakarta",  "https://www.antaranews.com/rss/metro.xml"),
    "olahraga":      ("Antara Olahraga",       "https://www.antaranews.com/rss/olahraga.xml"),
    "hiburan":       ("Antara Hiburan",        "https://www.antaranews.com/rss/hiburan.xml"),
    "tekno":         ("Antara Tekno",          "https://www.antaranews.com/rss/tekno.xml"),
    "otomotif":      ("Antara Otomotif",       "https://www.antaranews.com/rss/otomotif.xml"),
    "lifestyle":     ("Antara Lifestyle",      "https://www.antaranews.com/rss/lifestyle.xml"),
    "warta-bumi":    ("Antara Warta Bumi",     "https://www.antaranews.com/rss/warta-bumi.xml"),
    "humaniora":     ("Antara Humaniora",      "https://www.antaranews.com/rss/humaniora.xml"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
}


def get_antara_news(payload):
    category = (payload.get("category") or "top-news").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, feed_url = CATEGORIES[category]

    try:
        resp = requests.get(feed_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"Antara News returned HTTP {resp.status_code}"}
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
        image = ""
        desc_clean = desc_raw

        if desc_raw:
            try:
                desc_soup = BeautifulSoup(desc_raw, "html.parser")
                img_tag = desc_soup.find("img")
                if img_tag:
                    image = img_tag.get("src") or ""
                    img_tag.decompose()
                desc_clean = desc_soup.get_text(strip=True)
            except Exception:
                pass

        articles.append({
            "title": title,
            "url": link,
            "description": desc_clean,
            "published": pub,
            "image": image,
            "source": "Antara News",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "Antara News",
            "articles": articles,
            "total": len(articles),
        }
    }
