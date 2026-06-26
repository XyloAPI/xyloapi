import re
import requests
from bs4 import BeautifulSoup
from html import unescape
from concurrent.futures import ThreadPoolExecutor, as_completed

CATEGORIES = {
    "news":         ("Kompas TV Berita Utama", "news"),
    "nasional":     ("Kompas TV Nasional",     "nasional"),
    "regional":     ("Kompas TV Regional",     "regional"),
    "internasional": ("Kompas TV Internasional", "internasional"),
    "ekonomi":      ("Kompas TV Ekonomi",      "ekonomi"),
    "olahraga":     ("Kompas TV Olahraga",     "olahraga"),
    "lifestyle":    ("Kompas TV Lifestyle",    "lifestyle"),
    "entertainment": ("Kompas TV Entertainment", "entertainment"),
    "talkshow":     ("Kompas TV Talkshow",     "talkshow"),
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


def get_ktv_news(payload):
    category = (payload.get("category") or "news").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, path_param = CATEGORIES[category]
    base_url = f"https://www.kompas.tv/{path_param}"

    try:
        resp = requests.get(base_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"Kompas TV returned HTTP {resp.status_code}"}
        html_bytes = resp.content
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    try:
        soup = BeautifulSoup(html_bytes, "html.parser")
    except Exception as e:
        return {"success": False, "error": f"Failed to parse HTML: {str(e)}"}

    items = soup.find_all(class_="content-each")
    if not items:
        return {"success": False, "error": "No articles found on Kompas TV index page"}

    parsed_items = []
    for item in items[:20]:
        title_a = item.find("h2", class_="title-news")
        if title_a:
            title_a = title_a.find("a")
        if not title_a:
            # Fallback to any 'a' tag in col-70
            col70 = item.find(class_="col-70")
            if col70:
                title_a = col70.find("a")
        
        if not title_a:
            continue

        href = title_a.get("href")
        if not href:
            continue
        
        # Ensure absolute URL
        if href.startswith("/"):
            href = "https://www.kompas.tv" + href
        elif not href.startswith("http"):
            href = "https://www.kompas.tv/" + href

        title = title_a.get_text(strip=True)

        # Extract image
        img_tag = item.find("img")
        fallback_img = ""
        if img_tag:
            fallback_img = img_tag.get("data-src") or img_tag.get("src") or ""
        
        if fallback_img.startswith("/"):
            fallback_img = "https://www.kompas.tv" + fallback_img

        # Extract date
        date_tag = item.find(class_="time-news")
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
            "source": "Kompas TV",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "Kompas TV",
            "articles": articles,
            "total": len(articles),
        }
    }
