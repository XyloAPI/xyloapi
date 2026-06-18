import re
import requests
from bs4 import BeautifulSoup
from html import unescape
from concurrent.futures import ThreadPoolExecutor, as_completed

CATEGORIES = {
    "news":         ("Kompas News",        "news"),
    "nasional":     ("Kompas Nasional",    "nasional"),
    "regional":     ("Kompas Regional",    "regional"),
    "megapolitan":  ("Kompas Megapolitan", "megapolitan"),
    "money":        ("Kompas Money",        "money"),
    "tekno":        ("Kompas Tekno",        "tekno"),
    "bola":         ("Kompas Bola",         "bola"),
    "otomotif":     ("Kompas Otomotif",     "otomotif"),
    "lifestyle":    ("Kompas Lifestyle",    "lifestyle"),
    "travel":       ("Kompas Travel",       "travel"),
    "global":       ("Kompas Global",       "global"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
}


def _og(html: str, prop: str) -> str:
    m = re.search(
        rf'<meta\s+property=["\']og:{prop}["\']\s+content=["\']([^"\']+)["\']',
        html, re.I
    )
    if not m:
        m = re.search(
            rf'<meta\s+content=["\']([^"\']+)["\']\s+property=["\']og:{prop}["\']',
            html, re.I
        )
    return unescape(m.group(1).strip()) if m else ""


def _fetch_article(url: str) -> dict:
    try:
        resp = requests.get(url, headers=HEADERS, timeout=8)
        if resp.status_code != 200:
            return {}
        html = resp.text[:15000]

        desc = _og(html, "description")
        image = _og(html, "image")

        pub = ""
        pub_m = re.search(
            r'property=["\']article:published_time["\'][^>]+content=["\']([^"\']+)["\']',
            html, re.I
        )
        if pub_m:
            pub = pub_m.group(1).strip()
        else:
            pub_m = re.search(r'"datePublished"\s*:\s*"([^"]+)"', html)
            if pub_m:
                pub = pub_m.group(1).strip()

        return {
            "url": url,
            "description": desc,
            "image": image,
            "published": pub
        }
    except Exception:
        return {}


def get_kompas_news(payload):
    category = (payload.get("category") or "news").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, site_param = CATEGORIES[category]
    base_url = "https://indeks.kompas.com/"
    params = {"site": site_param}

    try:
        resp = requests.get(base_url, params=params, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"Kompas returned HTTP {resp.status_code}"}
        html_bytes = resp.content
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    try:
        soup = BeautifulSoup(html_bytes, "html.parser")
    except Exception as e:
        return {"success": False, "error": f"Failed to parse HTML: {str(e)}"}

    items = soup.find_all(class_="articleItem")
    if not items:
        return {"success": False, "error": "No articles found in Kompas index page"}

    parsed_items = []
    for item in items[:20]:
        link_tag = item.find("a", class_="article-link")
        if not link_tag:
            continue
        href = link_tag.get("href")
        if not href:
            continue

        title_tag = item.find(class_="articleTitle")
        title = title_tag.get_text(strip=True) if title_tag else ""

        img_tag = item.find("img")
        fallback_img = img_tag.get("src") or img_tag.get("data-src") if img_tag else ""

        date_tag = item.find(class_="articlePost-date")
        fallback_date = date_tag.get_text(strip=True) if date_tag else ""

        parsed_items.append({
            "title": title,
            "url": href,
            "fallback_image": fallback_img,
            "fallback_date": fallback_date,
        })

    if not parsed_items:
        return {"success": False, "error": "No valid article links extracted from index list"}

    ordered_results = [None] * len(parsed_items)
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_map = {
            executor.submit(_fetch_article, item["url"]): idx
            for idx, item in enumerate(parsed_items)
        }
        for future in as_completed(future_map):
            idx = future_map[future]
            try:
                ordered_results[idx] = future.result()
            except Exception:
                ordered_results[idx] = {}

    articles = []
    for idx, item in enumerate(ordered_results):
        orig = parsed_items[idx]
        url = orig["url"]
        title = orig["title"]

        image = (item.get("image") or orig["fallback_image"]) if item else orig["fallback_image"]
        desc = item.get("description")[:200] if item and item.get("description") else ""
        pub = (item.get("published") or orig["fallback_date"]) if item else orig["fallback_date"]

        articles.append({
            "title": title,
            "url": url,
            "description": desc,
            "published": pub,
            "image": image,
            "source": "Kompas News",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "Kompas News",
            "articles": articles,
            "total": len(articles),
        }
    }
