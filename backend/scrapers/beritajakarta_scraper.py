import requests
from bs4 import BeautifulSoup
import re
import time

CATEGORIES = {
    "latest":            ("Terbaru", ""),
    "terbaru":           ("Terbaru", ""),
    "ekonomi":           ("Ekonomi", "rubrik/1/ekonomi"),
    "pembangunan":       ("Pembangunan", "rubrik/2/pembangunan"),
    "pemerintahan":      ("Pemerintahan", "rubrik/4/pemerintahan"),
    "kesra":             ("Kesejahteraan Rakyat", "rubrik/5/kesra"),
    "dprd":              ("DPRD", "dprd"),
    "siaran-pers":       ("Siaran Pers", "siaran-pers"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
}

def clean_text(t):
    if not t:
        return ""
    return re.sub(r'\s+', ' ', t).strip()

def get_bj_news(payload):
    category = (payload.get("category") or "latest").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid categories: {valid}"}

    display_name, category_slug = CATEGORIES[category]

    if not category_slug:
        url = "https://www.beritajakarta.id/"
    else:
        url = f"https://www.beritajakarta.id/{category_slug}"

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
        return {"success": False, "error": f"Failed to fetch Berita Jakarta: {err_msg}"}

    try:
        soup = BeautifulSoup(resp.content, "html.parser")
        a_tags = soup.find_all("a", href=True)
        seen_hrefs = set()
        articles = []

        for a in a_tags:
            href = a.get("href")
            if "/read/" not in href or "/en/read/" in href:
                continue

            if href.startswith("/"):
                href = f"https://www.beritajakarta.id{href}"

            if href in seen_hrefs:
                continue
            seen_hrefs.add(href)

            # Walk up to find container
            container = None
            curr = a
            for _ in range(5):
                if curr.parent is None:
                    break
                curr = curr.parent
                classes = curr.get("class") or []
                if curr.name == "li" or "carousel-item" in classes or "card" in classes or "img-hover" in classes or "col-md-4" in classes:
                    container = curr
                    break

            title = ""
            img_url = ""
            date_str = ""
            cat_label = ""
            desc = ""

            if container:
                # 1. Heading or p containing title
                heading = container.find(["h1", "h2", "h3", "h4", "h5", "h6"])
                if heading:
                    title = clean_text(heading.get_text())
                else:
                    p_tags = container.find_all("p")
                    for p in p_tags:
                        p_classes = p.get("class") or []
                        if "card-text" not in p_classes:
                            title = clean_text(p.get_text())
                            break

                # 2. Image
                img = container.find("img")
                if img:
                    img_url = img.get("src") or img.get("data-src") or ""

                # 3. Date
                small_tags = container.find_all("small")
                for sm in small_tags:
                    txt = clean_text(sm.get_text())
                    if any(day in txt.lower() for day in ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu", "januari", "februari", "maret", "april", "mei", "juni", "juli", "agustus", "september", "oktober", "november", "desember"]):
                        date_str = txt
                        break

                # 4. Category
                badge = container.find(class_="badge")
                if badge:
                    cat_label = clean_text(badge.get_text())

            if not title:
                title = clean_text(a.get_text())
            if not title and container:
                img = container.find("img")
                if img and img.get("alt"):
                    title = clean_text(img.get("alt"))

            if not title:
                continue

            desc = title

            articles.append({
                "title": title,
                "url": href,
                "description": desc,
                "published": date_str,
                "image": img_url,
                "category": cat_label or display_name,
                "source": "Berita Jakarta",
            })

        return {
            "success": True,
            "data": {
                "category": display_name,
                "source": "Berita Jakarta",
                "articles": articles[:20],
                "total": len(articles),
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Parsing failed: {str(e)}"}
