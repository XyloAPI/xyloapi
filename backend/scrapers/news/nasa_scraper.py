import re
import requests
from html import unescape

CATEGORIES = {
    "releases": ("News Releases", "press-release"),
    "news":     ("General News",  "posts"),
    "featured": ("Featured News", "featured-news"),
    "top":      ("News Releases", "press-release"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
}


def _clean_text(html_text: str) -> str:
    if not html_text:
        return ""
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', html_text)
    # Unescape HTML entities
    text = unescape(text)
    # Normalize whitespaces
    return " ".join(text.split()).strip()


def get_nasa(payload):
    category = (payload.get("category") or "top").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, endpoint_type = CATEGORIES[category]

    try:
        if endpoint_type == "featured-news":
            url = "https://www.nasa.gov/wp-json/nasa-apps/v1/featured-news"
            resp = requests.get(url, headers=HEADERS, timeout=15)
            if resp.status_code != 200:
                return {"success": False, "error": f"NASA REST API returned HTTP {resp.status_code}"}
            items = resp.json()
        elif endpoint_type == "posts":
            url = "https://www.nasa.gov/wp-json/wp/v2/posts?categories=1&_embed=1&per_page=20"
            resp = requests.get(url, headers=HEADERS, timeout=15)
            if resp.status_code != 200:
                return {"success": False, "error": f"NASA REST API returned HTTP {resp.status_code}"}
            items = resp.json()
        else: # press-release
            url = "https://www.nasa.gov/wp-json/wp/v2/press-release?_embed=1&per_page=20"
            resp = requests.get(url, headers=HEADERS, timeout=15)
            if resp.status_code != 200:
                return {"success": False, "error": f"NASA REST API returned HTTP {resp.status_code}"}
            items = resp.json()
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    articles = []
    seen = set()

    for item in items:
        if not isinstance(item, dict):
            continue

        if endpoint_type == "featured-news":
            title = _clean_text(item.get("title") or "")
            url = (item.get("permalink") or "").strip()
            desc = _clean_text(item.get("excerpt") or "")
            pub = (item.get("published") or "").strip()
            image = (item.get("featured-image") or "").strip()
        else:
            title = _clean_text(item.get("title", {}).get("rendered") or "")
            url = (item.get("link") or "").strip()
            desc = _clean_text(item.get("excerpt", {}).get("rendered") or "")
            pub = (item.get("date") or "").strip()
            
            # Extract featured image
            image = ""
            embedded = item.get("_embedded", {})
            if isinstance(embedded, dict):
                featured_media = embedded.get("wp:featuredmedia", [])
                if isinstance(featured_media, list) and featured_media:
                    media_item = featured_media[0]
                    if isinstance(media_item, dict):
                        image = (media_item.get("source_url") or "").strip()

        if not title or not url or url in seen:
            continue
        seen.add(url)

        articles.append({
            "title": title,
            "url": url,
            "description": desc,
            "published": pub,
            "image": image,
            "source": "NASA",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "NASA",
            "articles": articles[:20],
            "total": len(articles[:20]),
        }
    }
