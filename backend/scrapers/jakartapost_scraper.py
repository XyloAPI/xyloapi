import requests
from bs4 import BeautifulSoup
import re

CATEGORIES = {
    "indonesia": ("Indonesia", "https://www.thejakartapost.com/indonesia", ["/indonesia"]),
    "business":  ("Business",  "https://www.thejakartapost.com/business",  ["/business"]),
    "opinion":   ("Opinion",   "https://www.thejakartapost.com/academia/opinion", ["/opinion", "/academia"]),
    "world":     ("World",     "https://www.thejakartapost.com/world",     ["/world"]),
    "culture":   ("Culture",   "https://www.thejakartapost.com/life",      ["/culture", "/life", "weekender.thejakartapost.com"]),
    "sports":    ("Sports",    "https://www.thejakartapost.com/sports",    ["/sports"]),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
}


def get_jakartapost_news(payload):
    category = (payload.get("category") or "indonesia").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, base_url, allowed_prefixes = CATEGORIES[category]

    try:
        resp = requests.get(base_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"The Jakarta Post returned HTTP {resp.status_code}"}
        resp.encoding = resp.apparent_encoding or "utf-8"
        html = resp.text
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    try:
        soup = BeautifulSoup(html, "html.parser")
    except Exception as e:
        return {"success": False, "error": f"Failed to parse HTML: {str(e)}"}

    cards = soup.find_all(class_="listNews")
    articles = []
    seen_urls = set()

    for card in cards:
        # Find the main article link
        link_tag = None
        for a in card.find_all("a", href=True):
            href = a["href"].split("?")[0]
            if re.search(r'/\d{4}/\d{2}/\d{2}/', href):
                # Verify prefix constraints
                matches_prefix = False
                for prefix in allowed_prefixes:
                    if href.startswith(prefix) or href.startswith("https://www.thejakartapost.com" + prefix):
                        matches_prefix = True
                        break
                if matches_prefix:
                    link_tag = a
                    break

        if not link_tag:
            continue

        href = link_tag["href"].split("?")[0]
        if href.startswith("/"):
            url = "https://www.thejakartapost.com" + href
        else:
            url = href

        if url in seen_urls:
            continue

        # Title
        title_tag = card.find(class_="titleNews")
        if title_tag:
            title = title_tag.get_text(strip=True)
        else:
            img_tag = card.find("img")
            if img_tag and img_tag.get("alt"):
                title = img_tag["alt"]
            else:
                title = card.get_text(strip=True)

        # Image
        img_tag = card.find("img")
        image = ""
        if img_tag:
            image = img_tag.get("data-src") or img_tag.get("src") or ""

        # Description
        desc_tag = card.find("p")
        desc = desc_tag.get_text(strip=True) if desc_tag else ""

        # Date/Published parsing
        date_match = re.search(r'/(\d{4})/(\d{2})/(\d{2})/', url)
        published_base = ""
        if date_match:
            published_base = f"{date_match.group(1)}-{date_match.group(2)}-{date_match.group(3)}"

        # Get relative time string
        rel_time = ""
        for s in card.find_all("span", class_="date"):
            classes = s.get("class") or []
            if "today" not in classes:
                rel_time = s.get_text(strip=True)
                break

        published = published_base
        if rel_time:
            published += f" {rel_time}"

        if title and url:
            articles.append({
                "title": title,
                "url": url,
                "description": desc,
                "published": published.strip(),
                "image": image,
                "source": "The Jakarta Post",
            })
            seen_urls.add(url)

    # Limit to 20 articles
    articles = articles[:20]

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "The Jakarta Post",
            "articles": articles,
            "total": len(articles),
        }
    }
