import requests
from bs4 import BeautifulSoup
import re
import time

CATEGORIES = {
    "latest":            ("Terbaru", ""),
    "terbaru":           ("Terbaru", ""),
    "ekonomi":           ("Ekonomi", "ekonomi"),
    "politik-dan-hukum": ("Politik dan Hukum", "politik-dan-hukum"),
    "humaniora":         ("Humaniora", "humaniora"),
    "megapolitan":       ("Megapolitan", "megapolitan"),
    "nusantara":         ("Nusantara", "nusantara"),
    "internasional":     ("Internasional", "internasional"),
    "olahraga":          ("Olahraga", "olahraga"),
    "teknologi":         ("Teknologi", "teknologi"),
    "hiburan":           ("Hiburan", "hiburan"),
    "premium":           ("Premium", "premium"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
}

def clean_text(t):
    if not t:
        return ""
    return re.sub(r'\s+', ' ', t).strip()

def get_mi_news(payload):
    category = (payload.get("category") or "latest").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid categories: {valid}"}

    display_name, category_slug = CATEGORIES[category]

    if not category_slug:
        url = "https://mediaindonesia.com/"
    else:
        url = f"https://mediaindonesia.com/{category_slug}"

    resp = None
    last_err = ""
    for attempt in range(3):
        try:
            resp = requests.get(url, headers=HEADERS, timeout=15)
            if resp.status_code == 200:
                break
        except Exception as e:
            last_err = str(e)
            time.sleep(1.5)

    if not resp or resp.status_code != 200:
        err_msg = f"HTTP {resp.status_code}" if resp else last_err
        return {"success": False, "error": f"Failed to fetch Media Indonesia: {err_msg}"}

    try:
        soup = BeautifulSoup(resp.content, "html.parser")
        a_tags = soup.find_all("a", href=True)
        seen_hrefs = set()
        articles = []

        for a in a_tags:
            href = a.get("href")
            # Ensure absolute URL
            if not href.startswith("http"):
                continue

            # Detect format category/id/slug
            match = re.search(r'/(\d{4,9})/', href)
            if not match:
                continue

            if href in seen_hrefs:
                continue
            seen_hrefs.add(href)

            title = a.get("title") or a.get_text(strip=True)
            img_url = ""
            date_str = ""
            desc = ""

            # Locate the container class "item" or "card"
            item_div = None
            curr = a
            for _ in range(5):
                if curr.parent is None:
                    break
                curr = curr.parent
                if curr.name == "div" and ("item" in curr.get("class", []) or "card" in curr.get("class", [])):
                    item_div = curr
                    break

            if item_div:
                img = item_div.find("img")
                if img:
                    img_url = img.get("data-src") or img.get("src") or ""
                date_div = item_div.find(class_="date")
                if date_div:
                    date_str = clean_text(date_div.get_text())
                p_tag = item_div.find("p")
                if p_tag:
                    desc = clean_text(p_tag.get_text())

            if not title:
                title = a.get_text(strip=True)
            if not desc:
                desc = title

            # Extra cleanup for #goog_rewarded or other hash links
            href = href.split("#")[0]

            articles.append({
                "title": clean_text(title),
                "url": href,
                "description": desc,
                "published": date_str,
                "image": img_url,
                "source": "Media Indonesia",
            })

        return {
            "success": True,
            "data": {
                "category": display_name,
                "source": "Media Indonesia",
                "articles": articles[:20],
                "total": len(articles),
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Parsing failed: {str(e)}"}
