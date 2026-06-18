import re
import requests
from bs4 import BeautifulSoup
from html import unescape
from concurrent.futures import ThreadPoolExecutor, as_completed

CATEGORIES = {
    "news":          ("iNews Utama",         "news"),
    "nasional":      ("iNews Nasional",      "news/nasional"),
    "internasional":  ("iNews Internasional", "news/internasional"),
    "megapolitan":   ("iNews Megapolitan",   "news/megapolitan"),
    "finance":       ("iNews Finance",       "finance"),
    "sport":         ("iNews Sport",         "sport"),
    "soccer":        ("iNews Soccer",        "sport/soccer"),
    "lifestyle":     ("iNews Lifestyle",     "lifestyle"),
    "travel":        ("iNews Travel",        "travel"),
    "otomotif":      ("iNews Otomotif",      "otomotif"),
    "techno":        ("iNews Techno",        "techno"),
    "regional":      ("iNews Regional",      "regional"),
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
        html = resp.text[:30000]

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


def get_inews_news(payload):
    category = (payload.get("category") or "news").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, path_param = CATEGORIES[category]
    base_url = f"https://www.inews.id/{path_param}"

    try:
        resp = requests.get(base_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"iNews returned HTTP {resp.status_code}"}
        html_bytes = resp.content
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    try:
        soup = BeautifulSoup(html_bytes, "html.parser")
    except Exception as e:
        return {"success": False, "error": f"Failed to parse HTML: {str(e)}"}

    items = soup.find_all("article")
    # Filter only articles with class containing cardArticle
    filtered_items = []
    for item in items:
        cls = item.get("class") or []
        if any("cardArticle" in c for c in cls):
            filtered_items.append(item)

    if not filtered_items:
        return {"success": False, "error": "No articles found on iNews index page"}

    parsed_items = []
    for item in filtered_items[:20]:
        title_tag = item.find(class_="cardTitle")
        if not title_tag:
            continue

        a_tag = item.find("a")
        href = a_tag.get("href") if a_tag else ""
        if not href:
            continue

        if href.startswith("/"):
            href = "https://www.inews.id" + href
        elif not href.startswith("http"):
            href = "https://www.inews.id/" + href

        title = title_tag.get_text(strip=True)

        img_tag = item.find("img")
        fallback_img = ""
        if img_tag:
            fallback_img = img_tag.get("src") or img_tag.get("data-src") or ""
        
        if fallback_img.startswith("/"):
            fallback_img = "https://www.inews.id" + fallback_img

        time_tag = item.find(class_="postTime")
        fallback_date = time_tag.get_text(strip=True) if time_tag else ""

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
            "source": "iNews",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "iNews",
            "articles": articles,
            "total": len(articles),
        }
    }
