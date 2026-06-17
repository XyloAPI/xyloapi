import re
import requests
from html import unescape
from concurrent.futures import ThreadPoolExecutor, as_completed

# Category slug → (display name, URL path)
CATEGORIES = {
    "singapore":     ("Singapore",     "/singapore"),
    "asia":          ("Asia",          "/asia"),
    "world":         ("World",         "/world"),
    "business":      ("Business",      "/business"),
    "sport":         ("Sport",         "/sport"),
    "technology":    ("Technology",    "/technology"),
    "lifestyle":     ("Lifestyle",     "/lifestyle"),
    "entertainment": ("Entertainment", "/entertainment"),
    "commentary":    ("Commentary",    "/commentary"),
    "cna-insider":   ("CNA Insider",   "/cna-insider"),
}

BASE_URL = "https://www.channelnewsasia.com"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.channelnewsasia.com/",
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
    """Fetch a single article page and extract all og: meta tags."""
    empty = {"title": "", "image": "", "description": "", "published": "", "url": url}
    try:
        resp = requests.get(url, headers=HEADERS, timeout=10)
        if resp.status_code != 200:
            return empty
        # Only need the first 6KB — all <meta> tags are in <head>
        html = resp.text[:6000]

        published = ""
        pub_m = re.search(
            r'<meta\s+property=["\']article:published_time["\']\s+content=["\']([^"\']+)["\']',
            html, re.I
        )
        if pub_m:
            published = pub_m.group(1).strip()

        return {
            "url": url,
            "title": _og(html, "title"),
            "image": _og(html, "image"),
            "description": _og(html, "description")[:200],
            "published": published,
        }
    except Exception:
        return empty


def _extract_article_urls(html: str) -> list:
    """Extract unique article URLs from a CNA category listing page."""
    pattern = re.compile(r'href="(/[a-z][a-z0-9-]*/[a-z0-9-]+-(\d{6,}))"')
    seen_ids = set()
    urls = []
    for m in pattern.finditer(html):
        article_id = m.group(2)
        if article_id not in seen_ids:
            seen_ids.add(article_id)
            urls.append(BASE_URL + m.group(1))
    return urls[:20]


def get_cna_news(payload):
    category = (payload.get("category") or "singapore").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {
            "success": False,
            "error": f"Invalid category '{category}'. Valid categories: {valid}"
        }

    display_name, url_path = CATEGORIES[category]
    page_url = BASE_URL + url_path

    try:
        resp = requests.get(page_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"CNA returned HTTP {resp.status_code}"}
        html = resp.text
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    article_urls = _extract_article_urls(html)
    if not article_urls:
        return {"success": False, "error": "No articles found on page."}

    # Fetch all article pages concurrently
    ordered_results = [None] * len(article_urls)
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_map = {
            executor.submit(_fetch_article, url): idx
            for idx, url in enumerate(article_urls)
        }
        for future in as_completed(future_map):
            idx = future_map[future]
            try:
                ordered_results[idx] = future.result()
            except Exception:
                ordered_results[idx] = {
                    "url": article_urls[idx],
                    "title": "",
                    "image": "",
                    "description": "",
                    "published": "",
                }

    # Filter out empty titles and add source field
    articles = []
    for item in ordered_results:
        if item and item.get("title"):
            item["source"] = "Channel NewsAsia"
            articles.append(item)

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "Channel NewsAsia",
            "articles": articles,
            "total": len(articles),
        }
    }
