import re
import requests
from bs4 import BeautifulSoup
from html import unescape
from concurrent.futures import ThreadPoolExecutor, as_completed

CATEGORIES = {
    "news":      ("News",      "news"),
    "ekobis":    ("Ekobis",    "ekobis"),
    "lifestyle":  ("Lifestyle", "lifestyle"),
    "hiburan":   ("Hiburan",   "hiburan"),
    "bola":      ("Bola",      "bola"),
    "cekfakta":  ("Cek Fakta",  "cekfakta"),
    "health":    ("Health",    "health"),
    "tekno":     ("Tekno",     "tekno"),
    "komunitas": ("Komunitas", "komunitas"),
    "milenial":  ("Milenial",  "milenial"),
    "ragam":     ("Ragam",     "ragam"),
    "kolom":     ("Kolom",     "kolom"),
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


def get_terkini_news(payload):
    category = (payload.get("category") or "news").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, path_param = CATEGORIES[category]
    base_url = f"https://terkini.id/{path_param}"

    try:
        resp = requests.get(base_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"Terkini returned HTTP {resp.status_code}"}
        html_bytes = resp.content
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    try:
        soup = BeautifulSoup(html_bytes, "html.parser")
    except Exception as e:
        return {"success": False, "error": f"Failed to parse HTML: {str(e)}"}

    items = soup.find_all("article")
    filtered_items = []
    for item in items:
        cls = item.get("class") or []
        if any("td-headline" in c or "td-newsfeed" in c for c in cls):
            filtered_items.append(item)

    if not filtered_items:
        # Fallback to any article tag with an a tag that has href
        for item in items:
            if item.find("a", href=True):
                filtered_items.append(item)

    if not filtered_items:
        return {"success": False, "error": "No articles found on Terkini index page"}

    parsed_items = []
    for item in filtered_items[:20]:
        h3_tag = item.find("h3")
        a_tag = h3_tag.find("a") if h3_tag else item.find("a", href=True)
        if not a_tag:
            continue

        href = a_tag.get("href") or ""
        if not href:
            continue

        if href.startswith("/"):
            href = "https://terkini.id" + href
        elif not href.startswith("http"):
            href = "https://terkini.id/" + href

        title = a_tag.get("title") or a_tag.get_text(strip=True) or (h3_tag.get_text(strip=True) if h3_tag else "")
        if not title:
            continue

        img_tag = item.find("img")
        fallback_img = ""
        if img_tag:
            fallback_img = img_tag.get("data-src") or img_tag.get("src") or ""
        
        if fallback_img.startswith("/"):
            fallback_img = "https://terkini.id" + fallback_img

        time_tag = item.find(class_="td-meta-date")
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
            "source": "Terkini News",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "Terkini News",
            "articles": articles,
            "total": len(articles),
        }
    }
