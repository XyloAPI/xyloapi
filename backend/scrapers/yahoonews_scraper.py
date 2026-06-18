import re
import json
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

CATEGORIES = {
    "top":      ("Top Stories", "https://www.yahoo.com/news/"),
    "us":       ("U.S. News",   "https://www.yahoo.com/news/us/"),
    "world":    ("World News",  "https://www.yahoo.com/news/world/"),
    "politics": ("Politics",    "https://www.yahoo.com/news/politics/"),
    "science":  ("Science",     "https://www.yahoo.com/news/science/"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}


def _format_date(iso_date: str) -> str:
    """Format ISO-8601 published time to RFC-like display date."""
    if not iso_date:
        return ""
    try:
        cleaned = iso_date.replace("Z", "+00:00")
        dt = datetime.fromisoformat(cleaned)
        return dt.strftime("%a, %d %b %Y %H:%M:%S %z")
    except Exception:
        return iso_date


def _fetch_article_metadata(url: str) -> dict:
    """Resolve single Yahoo News article page to get published date and description."""
    res = {"published": "", "description": ""}
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
                
        # Fallback to meta tags if missing
        if not res["published"]:
            m = re.search(r'<meta[^>]+property=["\']article:published_time["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)
            if not m:
                m = re.search(r'<meta[^>]+name=["\']article:published_time["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)
            if m:
                res["published"] = _format_date(m.group(1).strip())
                
        if not res["description"]:
            m = re.search(r'<meta[^>]+property=["\']og:description["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)
            if not m:
                m = re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)
            if m:
                res["description"] = m.group(1).strip()
                
    except Exception:
        pass
    return res


def get_yahoonews(payload):
    category = (payload.get("category") or "top").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, target_url = CATEGORIES[category]

    try:
        resp = requests.get(target_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"Yahoo News returned HTTP {resp.status_code}"}
        html_content = resp.content
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    soup = BeautifulSoup(html_content, "html.parser")
    
    raw_articles = []
    seen = set()

    for a in soup.find_all("a", href=True):
        href = a["href"]
        if "/news/" in href and href.endswith(".html"):
            url = href if href.startswith("http") else "https://www.yahoo.com" + href
            if url in seen:
                continue
                
            title = a.get_text(strip=True)
            if not title:
                continue
                
            seen.add(url)
            
            # Find closest wrapper container that wraps this anchor but no other article URLs
            container = a.parent
            while container and container.name != "body":
                other_art_links = []
                for other_a in container.find_all("a", href=True):
                    other_href = other_a["href"]
                    if "/news/" in other_href and other_href.endswith(".html"):
                        other_url = other_href if other_href.startswith("http") else "https://www.yahoo.com" + other_href
                        if other_url != url:
                            other_art_links.append(other_url)
                
                if other_art_links:
                    break
                
                prev_container = container
                container = container.parent
                
            image = ""
            description = ""
            publisher = ""
            
            if prev_container:
                # Find image
                img = prev_container.find("img")
                if img:
                    src = img.get("src") or img.get("data-src") or img.get("srcset") or ""
                    if src and not src.startswith("data:") and "logo" not in src.lower() and "avatar" not in src.lower():
                        image = src
                        
                # Find description
                p = prev_container.find("p")
                if p:
                    description = p.get_text(strip=True)
                    
                # Find publisher/source label
                span = prev_container.find("span", class_=lambda c: c and "text-tertiary" in c)
                if span:
                    publisher = span.get_text(strip=True)
                else:
                    label = prev_container.find(class_=lambda c: c and "label-" in c)
                    if label:
                        publisher = label.get_text(strip=True)

            raw_articles.append({
                "title": title,
                "url": url,
                "image": image,
                "description": description,
                "publisher": publisher or "Yahoo News",
                "published": ""
            })

    # Limit to top 20
    raw_articles = raw_articles[:20]

    # Concurrently resolve description and published date
    metadata_map = {}
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_map = {executor.submit(_fetch_article_metadata, a["url"]): a["url"] for a in raw_articles}
        for future in as_completed(future_map):
            url = future_map[future]
            try:
                metadata_map[url] = future.result()
            except Exception:
                metadata_map[url] = {"published": "", "description": ""}

    articles = []
    for a in raw_articles:
        meta = metadata_map.get(a["url"], {})
        
        desc = meta.get("description") or a["description"]
        pub = meta.get("published") or a["published"]

        articles.append({
            "title": a["title"],
            "url": a["url"],
            "description": desc,
            "published": pub,
            "image": a["image"],
            "source": a["publisher"],
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "Yahoo News",
            "articles": articles,
            "total": len(articles),
        }
    }
