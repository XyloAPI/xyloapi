import re
import requests
from bs4 import BeautifulSoup
from html import unescape
from concurrent.futures import ThreadPoolExecutor, as_completed

CATEGORIES = {
    "news":         ("Detik News",       "https://news.detik.com/indeks"),
    "finance":      ("Detik Finance",    "https://finance.detik.com/indeks"),
    "inet":         ("Detik Inet",       "https://inet.detik.com/indeks"),
    "hot":          ("Detik Hot",        "https://hot.detik.com/indeks"),
    "sport":        ("Detik Sport",      "https://sport.detik.com/indeks"),
    "health":       ("Detik Health",     "https://health.detik.com/indeks"),
    "travel":       ("Detik Travel",     "https://travel.detik.com/indeks"),
    "oto":          ("Detik Oto",        "https://oto.detik.com/indeks"),
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

        title = _og(html, "title")
        image = _og(html, "image")
        desc = _og(html, "description")

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
            "title": title,
            "image": image,
            "description": desc,
            "published": pub
        }
    except Exception:
        return {}


def get_detik_news(payload):
    category = (payload.get("category") or "news").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, feed_url = CATEGORIES[category]

    try:
        resp = requests.get(feed_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"Detik returned HTTP {resp.status_code}"}
        html_bytes = resp.content
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    try:
        soup = BeautifulSoup(html_bytes, "html.parser")
    except Exception as e:
        return {"success": False, "error": f"Failed to parse HTML: {str(e)}"}

    links = soup.find_all("a", href=lambda h: h and re.search(r'/d-\d+', h))
    urls = []
    seen = set()
    for l in links:
        href = l.get("href")
        if href and href not in seen:
            seen.add(href)
            urls.append(href)

    urls = urls[:20]
    if not urls:
        return {"success": False, "error": "No articles found in current index list"}

    ordered_results = [None] * len(urls)
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_map = {
            executor.submit(_fetch_article, url): idx
            for idx, url in enumerate(urls)
        }
        for future in as_completed(future_map):
            idx = future_map[future]
            try:
                ordered_results[idx] = future.result()
            except Exception:
                ordered_results[idx] = {}

    articles = []
    for idx, item in enumerate(ordered_results):
        url = urls[idx]
        title = item.get("title") if item else ""
        if not title:
            slug = url.split("/")[-1]
            title = slug.replace("-", " ").title()

        image = item.get("image") if item else ""
        desc = item.get("description")[:200] if item and item.get("description") else ""
        pub = item.get("published") if item else ""

        articles.append({
            "title": title,
            "url": url,
            "description": desc,
            "published": pub,
            "image": image,
            "source": "Detik News",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "Detik News",
            "articles": articles,
            "total": len(articles),
        }
    }
