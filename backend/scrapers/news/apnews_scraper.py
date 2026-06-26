import re
import requests
from html import unescape
from concurrent.futures import ThreadPoolExecutor, as_completed

CATEGORIES = {
    "top":          ("Top Stories",   "https://apnews.com/"),
    "world":        ("World News",    "https://apnews.com/world-news"),
    "us":           ("US News",       "https://apnews.com/us-news"),
    "politics":     ("Politics",      "https://apnews.com/politics"),
    "business":     ("Business",      "https://apnews.com/business"),
    "technology":   ("Technology",    "https://apnews.com/technology"),
    "health":       ("Health",        "https://apnews.com/health"),
    "entertainment":("Entertainment", "https://apnews.com/entertainment"),
    "sports":       ("Sports",        "https://apnews.com/sports"),
    "science":      ("Science",       "https://apnews.com/science"),
    "oddities":     ("Oddities",      "https://apnews.com/oddities"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,*/*;q=0.9",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://apnews.com/",
}


def _og(html: str, prop: str) -> str:
    m = re.search(rf'<meta\s+property=["\']og:{prop}["\']\s+content=["\']([^"\']+)["\']', html, re.I)
    if not m:
        m = re.search(rf'<meta\s+content=["\']([^"\']+)["\']\s+property=["\']og:{prop}["\']', html, re.I)
    return unescape(m.group(1).strip()) if m else ""


def _extract_links_with_titles(html: str) -> list:
    """Extract article URL + inline title from AP News listing page."""
    # AP News puts title directly in <a href> text
    pattern = re.compile(
        r'<a\s+(?:class="[^"]*"\s+)?href=["\']'
        r'(https://apnews\.com/article/([a-z0-9-]+))'
        r'["\'][^>]*>\s*([^<]{15,}?)\s*(?:</a>|<(?!/))',
        re.DOTALL
    )
    seen = set()
    results = []
    for m in pattern.finditer(html):
        url = m.group(1)
        article_id = m.group(2)
        raw_title = re.sub(r'\s+', ' ', m.group(3)).strip()
        title = unescape(raw_title)

        if article_id in seen or not title or len(title) < 15:
            continue
        # Skip navigation/UI text
        if any(kw in title.lower() for kw in ['cookie', 'privacy', 'sign in', 'subscribe', 'more stories']):
            continue
        seen.add(article_id)
        results.append({"url": url, "title": title})

    return results[:20]


def _fetch_article(url: str) -> dict:
    """Fetch AP News article page for og:image, description, published."""
    empty = {"url": url, "image": "", "description": "", "published": ""}
    try:
        resp = requests.get(url, headers=HEADERS, timeout=10)
        if resp.status_code != 200:
            return empty
        html = resp.text[:10000]

        pub_m = re.search(
            r'<meta\s+property=["\']article:published_time["\']\s+content=["\']([^"\']+)["\']',
            html, re.I
        )
        if not pub_m:
            pub_m = re.search(r'"datePublished"\s*:\s*"([^"]+)"', html)

        return {
            "url": url,
            "image": _og(html, "image"),
            "description": _og(html, "description")[:200],
            "published": pub_m.group(1).strip() if pub_m else "",
        }
    except Exception:
        return empty


def get_apnews(payload):
    category = (payload.get("category") or "top").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, page_url = CATEGORIES[category]

    try:
        resp = requests.get(page_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"AP News returned HTTP {resp.status_code}"}
        html = resp.text
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    link_items = _extract_links_with_titles(html)
    if not link_items:
        return {"success": False, "error": "No articles found on page."}

    urls = [item["url"] for item in link_items]

    # Concurrent fetch meta for each article
    meta_map: dict[str, dict] = {}
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_map = {executor.submit(_fetch_article, url): url for url in urls}
        for future in as_completed(future_map):
            url = future_map[future]
            try:
                meta_map[url] = future.result()
            except Exception:
                meta_map[url] = {"url": url, "image": "", "description": "", "published": ""}

    articles = []
    for item in link_items:
        meta = meta_map.get(item["url"], {})
        articles.append({
            "title": item["title"],
            "url": item["url"],
            "description": meta.get("description", ""),
            "published": meta.get("published", ""),
            "image": meta.get("image", ""),
            "source": "AP News",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "AP News",
            "articles": articles,
            "total": len(articles),
        }
    }
