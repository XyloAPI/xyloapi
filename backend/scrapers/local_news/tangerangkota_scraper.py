import requests
from bs4 import BeautifulSoup
import re
import time

CATEGORIES = {
    "latest":            ("Terbaru", "berita/all"),
    "terbaru":           ("Terbaru", "berita/all"),
    "populer":           ("Populer", "berita/all?populer=1"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
}

def clean_text(t):
    if not t:
        return ""
    return re.sub(r'\s+', ' ', t).strip()

def get_tk_news(payload):
    category = (payload.get("category") or "latest").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid categories: {valid}"}

    display_name, category_path = CATEGORIES[category]
    url = f"https://www.tangerangkota.go.id/{category_path}"

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
        return {"success": False, "error": f"Failed to fetch Tangerang Kota: {err_msg}"}

    try:
        soup = BeautifulSoup(resp.content, "html.parser")
        a_tags = soup.find_all("a", href=True)
        seen_hrefs = set()
        articles = []

        for a in a_tags:
            href = a.get("href")
            if "/berita/detail/" not in href:
                continue

            if href.startswith("/"):
                href = f"https://www.tangerangkota.go.id{href}"

            if href in seen_hrefs:
                continue
            seen_hrefs.add(href)

            # 1. Search inside a tag for title
            title = ""
            heading = a.find(["h1", "h2", "h3", "h4", "h5", "h6"])
            if heading:
                title = clean_text(heading.get_text())
            else:
                title = clean_text(a.get_text())

            # 2. Search inside a tag or parent/grandparent wrapper for image
            img_url = ""
            img = a.find("img")
            if img:
                img_url = img.get("src") or img.get("data-src") or ""
            else:
                parent = a.parent
                if parent:
                    sibling_img = parent.find("img")
                    if sibling_img:
                        img_url = sibling_img.get("src") or sibling_img.get("data-src") or ""
                if not img_url and parent and parent.parent:
                    grand_img = parent.parent.find("img")
                    if grand_img:
                        img_url = grand_img.get("src") or grand_img.get("data-src") or ""

            if img_url and img_url.startswith("/"):
                img_url = f"https://www.tangerangkota.go.id{img_url}"

            # 3. Search for date
            date_str = ""
            parent = a.parent
            if parent:
                date_elem = parent.find(class_=re.compile("date"))
                if date_elem:
                    date_str = clean_text(date_elem.get_text())
            if not date_str and parent and parent.parent:
                date_elem = parent.parent.find(class_=re.compile("date"))
                if date_elem:
                    date_str = clean_text(date_elem.get_text())

            # Clean title prefix
            if title.startswith("#"):
                title = re.sub(r'^#\d+', '', title).strip()
            if "dibaca" in title:
                title = title.split("dibaca")[0].strip()

            if not title:
                continue

            desc = title

            articles.append({
                "title": title,
                "url": href,
                "description": desc,
                "published": date_str,
                "image": img_url,
                "source": "Tangerang Kota",
            })

        return {
            "success": True,
            "data": {
                "category": display_name,
                "source": "Tangerang Kota",
                "articles": articles[:20],
                "total": len(articles),
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Parsing failed: {str(e)}"}
