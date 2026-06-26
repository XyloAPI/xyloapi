import requests
import json
from bs4 import BeautifulSoup

CATEGORIES = {
    "latest":   ("Terbaru", "latest"),
    "news":     ("News", "news"),
    "arena":    ("Arena (Olahraga)", "arena"),
    "hangout":  ("Hangout", "hangout"),
    "ototekno": ("Ototekno", "ototekno"),
    "empati":   ("Empati", "empati"),
    "gallery":  ("Gallery", "gallery"),
    "kanal":    ("Kanal", "kanal"),
    "market":   ("Market (Ekonomi)", "market"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
}


def get_inilah_news(payload):
    category = (payload.get("category") or "latest").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, category_slug = CATEGORIES[category]

    if category_slug == "latest":
        url = "https://www.inilah.com/"
    else:
        url = f"https://www.inilah.com/categories/{category_slug}"

    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"Inilah.com returned HTTP {resp.status_code}"}
        html_content = resp.content
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    soup = BeautifulSoup(html_content, "html.parser")
    script = soup.find("script", id="__NEXT_DATA__")
    if not script:
        return {"success": False, "error": "Could not parse Inilah.com content layout."}

    try:
        data = json.loads(script.string)
    except Exception as e:
        return {"success": False, "error": f"JSON parsing failed: {str(e)}"}

    queries = data.get("props", {}).get("pageProps", {}).get("dehydratedState", {}).get("queries", [])
    seen_slugs = set()
    articles = []

    for q in queries:
        query_key = q.get("queryKey")
        if not query_key or not isinstance(query_key, list):
            continue
        if "posts" not in query_key:
            continue

        state = q.get("state", {})
        q_data = state.get("data", {})

        raw_items = []
        if isinstance(q_data, dict):
            if "data" in q_data:
                if isinstance(q_data["data"], list):
                    raw_items = q_data["data"]
                elif isinstance(q_data["data"], dict) and "data" in q_data["data"]:
                    raw_items = q_data["data"]["data"]
        elif isinstance(q_data, list):
            raw_items = q_data

        for item in raw_items:
            if not isinstance(item, dict):
                continue
            attrs = item.get("attributes")
            if not attrs:
                continue

            title = attrs.get("title")
            slug = attrs.get("slug")
            if not title or not slug:
                continue

            if slug in seen_slugs:
                continue
            seen_slugs.add(slug)

            # Image extraction
            image_url = ""
            assets = attrs.get("assets", {})
            if isinstance(assets, dict) and "data" in assets and assets["data"]:
                asset_data = assets["data"][0]
                if isinstance(asset_data, dict):
                    asset_attrs = asset_data.get("attributes", {})
                    formats = asset_attrs.get("formats", {})
                    if isinstance(formats, dict):
                        for size in ["large", "medium", "small", "thumbnail"]:
                            if size in formats and formats[size].get("url"):
                                image_url = formats[size]["url"]
                                break
                    if not image_url:
                        image_url = asset_attrs.get("url") or ""

            # Description extraction: caption, alternativeText, fallback to title
            desc = ""
            if isinstance(assets, dict) and "data" in assets and assets["data"]:
                asset_data = assets["data"][0]
                if isinstance(asset_data, dict):
                    asset_attrs = asset_data.get("attributes", {})
                    desc = asset_attrs.get("caption") or asset_attrs.get("alternativeText") or ""
            if not desc:
                desc = title

            published = attrs.get("publishedAt") or attrs.get("createdAt") or ""

            articles.append({
                "title": title.strip(),
                "url": f"https://www.inilah.com/{slug}",
                "description": desc.strip(),
                "published": published,
                "image": image_url,
                "source": "Inilah.com",
            })

    # Limit to 20 articles
    articles = articles[:20]

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "Inilah.com",
            "articles": articles,
            "total": len(articles),
        }
    }
