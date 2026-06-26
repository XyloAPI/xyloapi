import requests
from datetime import datetime

BASE_URL = "https://forge-dapi.d3.nhle.com/v2/content/en-us/stories"
IMG_FORMAT = "t_ratio16_9-size60/f_auto"

CATEGORIES = {
    "nhl":          ("NHL News",       {"context.slug": "nhl"}),
    "all":          ("All Stories",    {}),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Referer": "https://www.nhl.com/",
}


def _format_image(thumbnail: dict) -> str:
    """Build a proper 16:9 image URL from the d3.nhle.com template."""
    template = thumbnail.get("templateUrl", "")
    if template:
        return template.replace("{formatInstructions}", IMG_FORMAT)
    return thumbnail.get("thumbnailUrl", "")


def _format_date(iso_date: str) -> str:
    """Convert ISO 8601 to RFC-style for consistency with other scrapers."""
    try:
        dt = datetime.fromisoformat(iso_date.replace("Z", "+00:00"))
        return dt.strftime("%a, %d %b %Y %H:%M:%S +0000")
    except Exception:
        return iso_date


def get_nhl(payload):
    category = (payload.get("category") or "nhl").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, extra_params = CATEGORIES[category]

    params = {"limit": 25, **extra_params}

    try:
        resp = requests.get(BASE_URL, params=params, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"NHL API returned HTTP {resp.status_code}"}
        data = resp.json()
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    items = data.get("items", [])
    if not items:
        return {"success": False, "error": "No items in response"}

    seen = set()
    articles = []
    for item in items:
        title = item.get("title", "").strip()
        slug = item.get("slug", "")
        link = f"https://www.nhl.com/news/{slug}" if slug else ""
        summary = (item.get("summary") or "").strip()[:200]
        pub_raw = item.get("contentDate") or item.get("lastUpdatedDate") or ""
        pub = _format_date(pub_raw)

        thumbnail = item.get("thumbnail") or {}
        image = _format_image(thumbnail)

        # Tags for extra context
        tags = [t.get("title", "") for t in item.get("tags", []) if t.get("title")]
        author = item.get("createdBy", "")

        if not title or link in seen:
            continue
        seen.add(link)

        articles.append({
            "title": title,
            "url": link,
            "description": summary,
            "published": pub,
            "image": image,
            "author": author,
            "tags": tags,
            "source": "NHL",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "NHL",
            "articles": articles[:20],
            "total": len(articles),
        }
    }
