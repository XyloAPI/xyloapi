import requests
from bs4 import BeautifulSoup

CATEGORIES = {
    "news":       ("News",       "peristiwa"),
    "politik":    ("Politik",    "politik"),
    "ekonomi":    ("Ekonomi",    "uang"),
    "artis":      ("Artis",      "artis"),
    "trending":   ("Trending",   "trending"),
    "tekno":      ("Tekno",      "teknologi"),
    "otomotif":   ("Otomotif",   "otomotif"),
    "dunia":      ("Dunia",      "dunia"),
    "lifestyle":  ("Lifestyle",  "gaya"),
    "sehat":      ("Sehat",      "sehat"),
    "sport":      ("Sport",      "bolasport"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
}


def get_merdeka_news(payload):
    category = (payload.get("category") or "news").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, path_param = CATEGORIES[category]
    base_url = f"https://www.merdeka.com/{path_param}"

    try:
        resp = requests.get(base_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"Merdeka returned HTTP {resp.status_code}"}
        resp.encoding = resp.apparent_encoding or "utf-8"
        html = resp.text
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    try:
        soup = BeautifulSoup(html, "html.parser")
    except Exception as e:
        return {"success": False, "error": f"Failed to parse HTML: {str(e)}"}

    items = soup.find_all(class_="item")
    articles = []

    for item in items:
        # Title
        title_a = item.find(class_="item-title")
        if title_a:
            title_a = title_a.find("a") or title_a
        title = title_a.get_text(strip=True) if title_a else ""

        # Link
        link_a = item.find("a", href=True)
        url = link_a["href"] if link_a else ""
        if url:
            if url.startswith("/"):
                url = "https://www.merdeka.com" + url
            elif not url.startswith("http"):
                url = "https://www.merdeka.com/" + url

        # Image
        img_tag = item.find("img")
        image = img_tag.get("src") or img_tag.get("data-src") or ""

        # Description
        desc_tag = item.find(class_="item-description")
        desc = desc_tag.get_text(strip=True) if desc_tag else ""

        # Publish Date
        time_tag = item.find("time")
        published = ""
        if time_tag:
            published = time_tag.get("datetime") or time_tag.get_text(strip=True) or ""

        if title and url:
            articles.append({
                "title": title,
                "url": url,
                "description": desc,
                "published": published,
                "image": image,
                "source": "Merdeka News",
            })

    # Limit to 20 articles
    articles = articles[:20]

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "Merdeka News",
            "articles": articles,
            "total": len(articles),
        }
    }
