import re
import requests
from bs4 import BeautifulSoup

CATEGORIES = {
    "nasional":  ("Tempo Nasional",      "https://rss.tempo.co/nasional"),
    "bisnis":    ("Tempo Bisnis",        "https://rss.tempo.co/bisnis"),
    "metro":     ("Tempo Metro",         "https://rss.tempo.co/metro"),
    "dunia":     ("Tempo Dunia",         "https://rss.tempo.co/dunia"),
    "bola":      ("Tempo Bola",          "https://rss.tempo.co/bola"),
    "tekno":     ("Tempo Tekno",         "https://rss.tempo.co/tekno"),
    "otomotif":  ("Tempo Otomotif",      "https://rss.tempo.co/otomotif"),
    "seleb":     ("Tempo Seleb",         "https://rss.tempo.co/seleb"),
    "gaya":      ("Tempo Gaya Hidup",    "https://rss.tempo.co/gaya"),
    "kolom":     ("Tempo Kolom",         "https://rss.tempo.co/kolom"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
}


def get_tempo_news(payload):
    category = (payload.get("category") or "nasional").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, feed_url = CATEGORIES[category]

    try:
        resp = requests.get(feed_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"Tempo returned HTTP {resp.status_code}"}
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

        img_tag = item.find("img")
        image = img_tag.get_text(strip=True) if img_tag else ""

        articles.append({
            "title": title,
            "url": link,
            "description": desc,
            "published": pub,
            "image": image,
            "source": "Tempo",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "Tempo",
            "articles": articles,
            "total": len(articles),
        }
    }
