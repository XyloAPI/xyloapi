import re
import json
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

CATEGORIES = {
    "us":           ("U.S. News",      "https://www.newsweek.com/us"),
    "world":        ("World",         "https://www.newsweek.com/world"),
    "opinion":      ("Opinion",       "https://www.newsweek.com/opinion"),
    "business":     ("Business",      "https://www.newsweek.com/business"),
    "tech-science": ("Tech & Science", "https://www.newsweek.com/tech-science"),
    "sports":       ("Sports",        "https://www.newsweek.com/sports"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}


def _clean_image(url: str) -> str:
    """Standardize image URL to 1200px width and remove crop params if possible."""
    if not url:
        return ""
    if "?" in url:
        # Standardize to 1200px width for quality
        return url.split("?")[0] + "?w=1200"
    return url


def _format_date(iso_date: str) -> str:
    """Format ISO-8601 published time to RFC-like display date."""
    if not iso_date:
        return ""
    try:
        # newsweek date format can be 2026-06-17T14:32:11-04:00
        # replace timezone format for python from iso format
        cleaned = iso_date.replace("Z", "+00:00")
        dt = datetime.fromisoformat(cleaned)
        return dt.strftime("%a, %d %b %Y %H:%M:%S %z")
    except Exception:
        return iso_date


def _fetch_article_metadata(url: str) -> dict:
    """Resolve single Newsweek article page to get author, published date, and description."""
    res = {"author": "", "published": "", "description": ""}
    try:
        r = requests.get(url, headers=HEADERS, timeout=8)
        if r.status_code != 200:
            return res
        html = r.text
        
        # Try JSON-LD first
        schema_blocks = re.findall(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', html, re.DOTALL)
        for block in schema_blocks:
            try:
                data = json.loads(block.strip())
                items = data if isinstance(data, list) else [data]
                for item in items:
                    if not isinstance(item, dict):
                        continue
                    if item.get("@type") in ["NewsArticle", "BlogPosting", "ReportageNewsArticle", "Article"]:
                        # Extract author
                        auth = item.get("author")
                        if auth:
                            if isinstance(auth, list) and auth:
                                res["author"] = auth[0].get("name", "")
                            elif isinstance(auth, dict):
                                res["author"] = auth.get("name", "")
                        # Extract date
                        pub = item.get("datePublished") or item.get("dateCreated")
                        if pub:
                            res["published"] = _format_date(pub)
                        # Extract description
                        desc = item.get("description")
                        if desc:
                            res["description"] = desc
            except Exception:
                pass
                
        # Fallback to standard meta tags if missing
        if not res["author"]:
            m = re.search(r'<meta[^>]+name=["\']twitter:creator["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)
            if not m:
                m = re.search(r'<meta[^>]+name=["\']author["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)
            if m:
                res["author"] = m.group(1).strip()
                
        if not res["published"]:
            m = re.search(r'property=["\']article:published_time["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)
            if not m:
                m = re.search(r'name=["\']article:published_time["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)
            if m:
                res["published"] = _format_date(m.group(1).strip())
                
        if not res["description"]:
            m = re.search(r'property=["\']og:description["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)
            if m:
                res["description"] = m.group(1).strip()
                
    except Exception:
        pass
    return res


def get_newsweek(payload):
    category = (payload.get("category") or "us").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, target_url = CATEGORIES[category]

    try:
        resp = requests.get(target_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"Newsweek returned HTTP {resp.status_code}"}
        html_content = resp.content
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    soup = BeautifulSoup(html_content, "html.parser")
    tiles = soup.find_all("div", class_=lambda c: c and ("contentTileContainer" in c or "ContentTile" in c))

    raw_articles = []
    seen = set()

    for tile in tiles:
        links = tile.find_all("a", href=True)
        if not links:
            continue

        art_links = [l for l in links if re.search(r"-\d+$", l["href"])]
        if not art_links:
            continue

        href = art_links[0]["href"]
        url = href if href.startswith("http") else "https://www.newsweek.com" + href

        if url in seen:
            continue
        seen.add(url)

        # Extract title
        title = ""
        for al in art_links:
            txt = al.get_text(strip=True)
            if txt:
                title = txt
                break

        # Extract image
        img_tag = tile.find("img")
        image = ""
        if img_tag:
            image_raw = img_tag.get("src") or img_tag.get("data-src") or ""
            image = _clean_image(image_raw)

        # Extract fallback fields from tile directly
        summary_tag = tile.find(class_=lambda c: c and "summary" in c.lower())
        summary = summary_tag.get_text(strip=True) if summary_tag else ""
        if not summary:
            texts = [t.strip() for t in tile.stripped_strings if t.strip()]
            possible = [t for t in texts if t != title and len(t) > 30 and not t.startswith("By ") and t not in CATEGORIES]
            if possible:
                summary = possible[0]

        author_tag = tile.find(class_=lambda c: c and "author" in c.lower())
        author = author_tag.get_text(strip=True) if author_tag else ""
        if author and author.lower().startswith("by "):
            author = author[3:]

        if title:
            raw_articles.append({
                "title": title,
                "url": url,
                "image": image,
                "description": summary,
                "author": author,
                "published": ""
            })

    # Limit to top 20
    raw_articles = raw_articles[:20]

    # Concurrently fetch metadata for each article to get precise publish date and rich description
    metadata_map = {}
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_map = {executor.submit(_fetch_article_metadata, a["url"]): a["url"] for a in raw_articles}
        for future in as_completed(future_map):
            url = future_map[future]
            try:
                metadata_map[url] = future.result()
            except Exception:
                metadata_map[url] = {"author": "", "published": "", "description": ""}

    articles = []
    for a in raw_articles:
        meta = metadata_map.get(a["url"], {})
        
        # Override with concurrently resolved rich data
        author = meta.get("author") or a["author"]
        desc = meta.get("description") or a["description"]
        pub = meta.get("published") or a["published"]

        articles.append({
            "title": a["title"],
            "url": a["url"],
            "description": desc,
            "published": pub,
            "image": a["image"],
            "author": author,
            "source": "Newsweek",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "Newsweek",
            "articles": articles,
            "total": len(articles),
        }
    }
