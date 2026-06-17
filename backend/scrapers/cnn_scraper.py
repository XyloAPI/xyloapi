import re
import json
import requests
from html import unescape
from concurrent.futures import ThreadPoolExecutor, as_completed

# CNN category page map: slug → (display name, URL)
CATEGORIES = {
    "top":          ("Top Stories",   "https://edition.cnn.com/"),
    "world":        ("World",         "https://edition.cnn.com/world"),
    "us":           ("US",            "https://edition.cnn.com/us"),
    "business":     ("Business",      "https://edition.cnn.com/business"),
    "politics":     ("Politics",      "https://edition.cnn.com/politics"),
    "health":       ("Health",        "https://edition.cnn.com/health"),
    "entertainment":("Entertainment", "https://edition.cnn.com/entertainment"),
    "sport":        ("Sport",         "https://edition.cnn.com/sport"),
    "technology":   ("Technology",    "https://edition.cnn.com/business/tech"),
    "travel":       ("Travel",        "https://edition.cnn.com/travel"),
    "asia":         ("Asia",          "https://edition.cnn.com/asia"),
    "europe":       ("Europe",        "https://edition.cnn.com/europe"),
    "middleeast":   ("Middle East",   "https://edition.cnn.com/middleeast"),
}

BASE_URL = "https://edition.cnn.com"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://edition.cnn.com/",
}


def _extract_listing_links(html: str) -> list:
    """Extract unique article URLs from CNN category listing page."""
    # CNN article links have date-based pattern: /YYYY/MM/DD/...
    pattern = re.compile(r'href="(/\d{4}/\d{2}/\d{2}/[^"#?]+)"')
    seen = set()
    urls = []
    for m in pattern.finditer(html):
        path = m.group(1).rstrip('/')
        if path not in seen:
            seen.add(path)
            urls.append(BASE_URL + path)
    return urls[:20]


def _parse_jsonld(html: str) -> dict:
    """Extract first NewsArticle JSON-LD block."""
    m = re.search(
        r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        html, re.DOTALL
    )
    if not m:
        return {}
    try:
        data = json.loads(m.group(1))
        if isinstance(data, list):
            # Find the NewsArticle entry
            for item in data:
                if isinstance(item, dict) and 'NewsArticle' in str(item.get('@type', '')):
                    return item
            data = data[0] if data else {}
        return data if isinstance(data, dict) else {}
    except (json.JSONDecodeError, Exception):
        return {}


def _extract_image(ld: dict) -> str:
    """Get best image URL from JSON-LD image field."""
    img = ld.get('image', '')
    if isinstance(img, str):
        return img
    if isinstance(img, dict):
        return img.get('url', img.get('contentUrl', ''))
    if isinstance(img, list) and img:
        first = img[0]
        if isinstance(first, str):
            return first
        if isinstance(first, dict):
            return first.get('contentUrl', first.get('url', ''))
    return ''


def _fetch_article(url: str) -> dict:
    """Fetch a CNN article page and extract metadata via JSON-LD."""
    empty = {"url": url, "title": "", "image": "", "description": "", "published": ""}
    try:
        resp = requests.get(url, headers=HEADERS, timeout=10)
        if resp.status_code != 200:
            return empty
        html = resp.text

        ld = _parse_jsonld(html)
        title = unescape(ld.get('headline', '') or ld.get('name', ''))
        description = unescape(ld.get('description', ''))[:200]
        published = ld.get('datePublished', '')
        image = _extract_image(ld)

        return {
            "url": url,
            "title": title.strip(),
            "image": image,
            "description": description.strip(),
            "published": published,
        }
    except Exception:
        return empty


def get_cnn_news(payload):
    category = (payload.get("category") or "top").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {
            "success": False,
            "error": f"Invalid category '{category}'. Valid categories: {valid}"
        }

    display_name, page_url = CATEGORIES[category]

    try:
        resp = requests.get(page_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"CNN returned HTTP {resp.status_code}"}
        html = resp.text
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    article_urls = _extract_listing_links(html)
    if not article_urls:
        return {"success": False, "error": "No articles found on page."}

    # Concurrent fetch article meta
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
                ordered[idx] = {
                    "url": article_urls[idx], "title": "",
                    "image": "", "description": "", "published": ""
                }

    articles = []
    for item in ordered:
        if item and item.get("title"):
            item["source"] = "CNN"
            articles.append(item)

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "CNN",
            "articles": articles,
            "total": len(articles),
        }
    }
