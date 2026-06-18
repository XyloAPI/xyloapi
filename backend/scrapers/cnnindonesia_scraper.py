import re
import requests
from bs4 import BeautifulSoup

CATEGORIES = {
    "nasional":       ("CNN Indonesia Nasional",       "https://www.cnnindonesia.com/nasional/rss"),
    "internasional":  ("CNN Indonesia Internasional",  "https://www.cnnindonesia.com/internasional/rss"),
    "ekonomi":        ("CNN Indonesia Ekonomi",        "https://www.cnnindonesia.com/ekonomi/rss"),
    "olahraga":       ("CNN Indonesia Olahraga",       "https://www.cnnindonesia.com/olahraga/rss"),
    "teknologi":      ("CNN Indonesia Teknologi",      "https://www.cnnindonesia.com/teknologi/rss"),
    "hiburan":        ("CNN Indonesia Hiburan",        "https://www.cnnindonesia.com/hiburan/rss"),
    "gaya-hidup":     ("CNN Indonesia Gaya Hidup",     "https://www.cnnindonesia.com/gaya-hidup/rss"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
}


def get_cnn_news(payload):
    category = (payload.get("category") or "nasional").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, feed_url = CATEGORIES[category]

    try:
        resp = requests.get(feed_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"CNN Indonesia returned HTTP {resp.status_code}"}
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
                    if image and "w=360" in image:
                        image = image.replace("w=360", "w=730")
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
            "source": "CNN Indonesia",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "CNN Indonesia",
            "articles": articles,
            "total": len(articles),
        }
    }
