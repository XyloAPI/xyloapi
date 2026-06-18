import re
import requests
from bs4 import BeautifulSoup
from html import unescape
from datetime import datetime, timezone
from concurrent.futures import ThreadPoolExecutor, as_completed

CATEGORIES = {
    "news":            ("Berita Utama",   "berita-utama"),
    "terbaru":         ("Terbaru",        "terbaru"),
    "asia":            ("Asia",           "asia"),
    "indonesia":       ("Indonesia",      "indonesia"),
    "lifestyle":       ("Lifestyle",      "lifestyle"),
    "trending":        ("Trending",       "trending"),
    "pilihan-editor":  ("Pilihan Editor", "liputan-khusus-id"),
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
        html = resp.text[:40000]

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


def get_cna_news(payload):
    category = (payload.get("category") or "indonesia").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, path_param = CATEGORIES[category]
    base_url = f"https://www.cna.id/{path_param}"

    try:
        resp = requests.get(base_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"CNA returned HTTP {resp.status_code}"}
        html_bytes = resp.content
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    try:
        soup = BeautifulSoup(html_bytes, "html.parser")
    except Exception as e:
        return {"success": False, "error": f"Failed to parse HTML: {str(e)}"}

    links = soup.find_all("a", href=True)
    unique_articles = {}

    for l in links:
        href = l["href"]
        if "/topic/" in href:
            continue
        # Select links ending in a hyphen followed by at least 4 digits
        if re.search(r'-\d{4,}$', href):
            if href.startswith("/"):
                href = "https://www.cna.id" + href
            elif not href.startswith("http"):
                href = "https://www.cna.id/" + href

            title = l.get_text(strip=True)
            img_tag = l.find("img")
            img = ""
            if img_tag:
                img = img_tag.get("src") or img_tag.get("data-src") or ""

            # Try to extract fallback date from card-object container
            fallback_date = ""
            parent = l.find_parent(class_="card-object") or l.find_parent(class_="list-object")
            if parent:
                ts_tag = parent.find(attrs={"data-lastupdated": True})
                if ts_tag:
                    try:
                        epoch = int(ts_tag.get("data-lastupdated"))
                        fallback_date = datetime.fromtimestamp(epoch, tz=timezone.utc).isoformat()
                    except Exception:
                        pass
                
                if not fallback_date:
                    time_tag = parent.find(class_=re.compile(r'timestamp|timeago'))
                    if time_tag:
                        fallback_date = time_tag.get_text(strip=True)

            if href not in unique_articles:
                unique_articles[href] = {
                    "url": href,
                    "title": title,
                    "image": img,
                    "fallback_date": fallback_date
                }
            else:
                if title:
                    unique_articles[href]["title"] = title
                if img:
                    unique_articles[href]["image"] = img
                if fallback_date and not unique_articles[href]["fallback_date"]:
                    unique_articles[href]["fallback_date"] = fallback_date

    # Convert to list and slice up to 20
    parsed_items = list(unique_articles.values())[:20]

    if not parsed_items:
        return {"success": False, "error": "No articles found on CNA index page"}

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
        title = orig["title"] or "Berita CNA.id"

        image = (item.get("image") or orig["image"]) if item else orig["image"]
        desc = item.get("description")[:200] if item and item.get("description") else ""
        pub = (item.get("published") or orig["fallback_date"]) if item else orig["fallback_date"]

        articles.append({
            "title": title,
            "url": url,
            "description": desc,
            "published": pub,
            "image": image,
            "source": "CNA Indonesia",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "CNA Indonesia",
            "articles": articles,
            "total": len(articles),
        }
    }
