import re
import requests
from bs4 import BeautifulSoup

CATEGORIES = {
    "news":         ("Liputan6 News",        "news"),
    "bisnis":       ("Liputan6 Bisnis",      "bisnis"),
    "bola":         ("Liputan6 Bola",        "bola"),
    "showbiz":      ("Liputan6 Showbiz",     "showbiz"),
    "otomotif":     ("Liputan6 Otomotif",     "otomotif"),
    "tekno":        ("Liputan6 Tekno",        "tekno"),
    "health":       ("Liputan6 Health",       "health"),
    "lifestyle":    ("Liputan6 Lifestyle",    "lifestyle"),
    "global":       ("Liputan6 Global",       "global"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
}


def get_liputan6_news(payload):
    category = (payload.get("category") or "news").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, path_name = CATEGORIES[category]
    url = f"https://www.liputan6.com/{path_name}/indeks"

    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"Liputan6 returned HTTP {resp.status_code}"}
        html_bytes = resp.content
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    try:
        soup = BeautifulSoup(html_bytes, "html.parser")
    except Exception as e:
        return {"success": False, "error": f"Failed to parse HTML: {str(e)}"}

    items = soup.find_all(class_="articles--rows--item")
    articles = []

    for item in items[:20]:
        title_tag = item.find(class_="articles--rows--item__title-link")
        if not title_tag:
            title_tag = item.find("a")
        title = (title_tag.get("title") or title_tag.get_text(strip=True)) if title_tag else ""
        link = title_tag.get("href") if title_tag else ""

        if not link:
            continue

        summary_tag = item.find(class_="articles--rows--item__summary")
        desc = summary_tag.get_text(strip=True) if summary_tag else ""

        img_tag = item.find("img")
        image = ""
        if img_tag:
            image = img_tag.get("src") or img_tag.get("data-src") or ""

        time_tag = item.find(class_="articles--rows--item__time")
        pub = time_tag.get("datetime") if time_tag else ""
        if not pub and time_tag:
            pub = time_tag.get_text(strip=True)

        articles.append({
            "title": title,
            "url": link,
            "description": desc,
            "published": pub,
            "image": image,
            "source": "Liputan6 News",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "Liputan6 News",
            "articles": articles,
            "total": len(articles),
        }
    }
