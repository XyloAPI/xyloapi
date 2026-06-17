import re
import json
import requests
from html import unescape
from concurrent.futures import ThreadPoolExecutor, as_completed

# Al Jazeera category pages
CATEGORIES = {
    "news":       ("News",       "/news/"),
    "sport":      ("Sport",      "/sport/"),
    "economy":    ("Economy",    "/economy/"),
    "features":   ("Features",   "/features/"),
    "opinion":    ("Opinion",    "/opinion/"),
    "video":      ("Video",      "/videos/"),
    "liveblog":   ("Live",       "/liveblog/"),
}

BASE_URL = "https://www.aljazeera.com"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,*/*;q=0.9",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.aljazeera.com/",
}


def _og(html: str, prop: str) -> str:
    m = re.search(rf'<meta[^>]+property=["\']og:{prop}["\']\s+content=["\']([^"\']+)["\']', html, re.I)
    if not m:
        m = re.search(rf'<meta[^>]+content=["\']([^"\']+)["\']\s+property=["\']og:{prop}["\']', html, re.I)
    return unescape(m.group(1).strip()) if m else ""


def _extract_listing_urls(html: str) -> list:
    """Extract unique article URLs from AJ category page."""
    # AJ article URLs: /news/YYYY/M/D/slug, /economy/..., /sports/..., etc.
    pattern = re.compile(
        r'href="(/(?:news|sports?|economy|features?|opinion|opinions?|video|newsfeed|liveblog)'
        r'/(?:\d{4}/\d+/\d+/|liveblog/\d{4}/\d+/\d+/)[^"#?]+)"'
    )
    seen = set()
    urls = []
    for m in pattern.finditer(html):
        path = m.group(1).rstrip('/')
        if path not in seen:
            seen.add(path)
            urls.append(BASE_URL + path)
    return urls[:20]


def _fetch_article(url: str) -> dict:
    """Fetch AJ article and extract og: + JSON-LD metadata."""
    empty = {"url": url, "title": "", "image": "", "description": "", "published": ""}
    try:
        resp = requests.get(url, headers=HEADERS, timeout=10)
        if resp.status_code != 200:
            return empty
        html = resp.text[:12000]

        # JSON-LD for datePublished + image
        published = ""
        image = _og(html, "image")
        ld_m = re.search(
            r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
            html, re.DOTALL
        )
        if ld_m:
            try:
                data = json.loads(ld_m.group(1))
                if isinstance(data, list):
                    data = next((d for d in data if 'Article' in str(d.get('@type', ''))), data[0] if data else {})
                published = data.get('datePublished', '')
                if not image:
                    img = data.get('image', '')
                    if isinstance(img, dict):
                        image = img.get('url', img.get('contentUrl', ''))
                    elif isinstance(img, list) and img:
                        first = img[0]
                        image = first.get('url', first.get('contentUrl', '')) if isinstance(first, dict) else first
            except Exception:
                pass

        return {
            "url": url,
            "title": _og(html, "title"),
            "image": image,
            "description": _og(html, "description")[:200],
            "published": published,
        }
    except Exception:
        return empty


def get_aljazeera_news(payload):
    category = (payload.get("category") or "news").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, url_path = CATEGORIES[category]
    page_url = BASE_URL + url_path

    try:
        resp = requests.get(page_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"Al Jazeera returned HTTP {resp.status_code}"}
        html = resp.text
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    article_urls = _extract_listing_urls(html)
    if not article_urls:
        return {"success": False, "error": "No articles found on page."}

    # Concurrent fetch
    ordered = [None] * len(article_urls)
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_map = {
            executor.submit(_fetch_article, url): idx
            for idx, url in enumerate(article_urls)
        }
        for future in as_completed(future_map):
            idx = future_map[future]
            try:
                ordered[idx] = future.result()
            except Exception:
                ordered[idx] = {"url": article_urls[idx], "title": "", "image": "", "description": "", "published": ""}

    articles = []
    for item in ordered:
        if item and item.get("title"):
            item["source"] = "Al Jazeera"
            articles.append(item)

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "Al Jazeera",
            "articles": articles,
            "total": len(articles),
        }
    }
