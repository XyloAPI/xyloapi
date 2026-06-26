from curl_cffi import requests
from bs4 import BeautifulSoup
import re
import time

CATEGORIES = {
    "latest":       ("Berita Terbaru", ""),
    "terbaru":      ("Berita Terbaru", "terbaru"),
    "utama":        ("Berita Utama", "utama"),
    "kolom":        ("Kolom Opini", "kolom"),
    "profil":       ("Profil Tokoh / Firma", "profil"),
    "kabar-kampus": ("Kabar Kampus", "kabar-kampus"),
    "isu-hangat":   ("Isu Hangat", "isu-hangat"),
    "jeda":         ("Jeda", "jeda"),
}

def clean_text(t):
    if not t:
        return ""
    return re.sub(r'\s+', ' ', t).strip()

def get_hukumonline_news(payload):
    category = (payload.get("category") or "latest").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid categories: {valid}"}

    display_name, category_slug = CATEGORIES[category]

    if not category_slug:
        url = "https://www.hukumonline.com/berita/"
    else:
        url = f"https://www.hukumonline.com/berita/{category_slug}/"

    resp = None
    last_err = ""
    for attempt in range(3):
        try:
            resp = requests.get(url, impersonate="chrome120", timeout=25)
            if resp.status_code == 200:
                break
            elif resp.status_code == 429:
                # Sleep and retry
                time.sleep(2.0)
        except Exception as e:
            last_err = str(e)
            time.sleep(1.5)

    if not resp or resp.status_code != 200:
        err_msg = f"HTTP {resp.status_code}" if resp else last_err
        return {"success": False, "error": f"Failed to fetch Hukumonline: {err_msg}"}

    try:
        soup = BeautifulSoup(resp.content, "html.parser")
        a_tags = soup.find_all("a", href=True)
        seen_hrefs = set()
        articles = []

        for a in a_tags:
            href = a.get("href")
            if not ("/berita/a/" in href or "/berita/b/" in href):
                continue

            if href.startswith("/"):
                href = f"https://www.hukumonline.com{href}"

            if href in seen_hrefs:
                continue
            seen_hrefs.add(href)

            # Extract title
            title = ""
            headings = a.find_all(["h1", "h2", "h3", "h4", "h5", "h6"])
            if headings:
                title = clean_text(headings[0].get_text())
            else:
                img = a.find("img")
                if img and img.get("alt"):
                    title = clean_text(img.get("alt"))
                else:
                    title = clean_text(a.get_text())

            if not title:
                continue

            # Extract date
            date_str = ""
            time_tag = a.find("time")
            if time_tag:
                date_str = clean_text(time_tag.get_text())
            else:
                parent = a.parent
                time_tag = parent.find("time") if parent else None
                if time_tag:
                    date_str = clean_text(time_tag.get_text())

            # Extract image
            img_url = ""
            img = a.find("img")
            if img:
                img_url = img.get("src") or img.get("data-src") or ""
            if not img_url:
                picture = a.find("picture")
                if picture:
                    img_tag = picture.find("img")
                    if img_tag:
                        img_url = img_tag.get("src") or img_tag.get("data-src") or ""
                    if not img_url:
                        source = picture.find("source")
                        if source:
                            img_url = source.get("srcset") or ""

            # Extract description
            desc = ""
            parent = a.parent
            p_tag = parent.find("p") if parent else None
            if p_tag and p_tag != a:
                desc = clean_text(p_tag.get_text())
            if not desc:
                grand = parent.parent if parent else None
                p_tag = grand.find("p") if grand else None
                if p_tag:
                    desc = clean_text(p_tag.get_text())
            if not desc:
                desc = title

            # Clean any trailing date characters in the title
            if date_str and title.endswith(date_str):
                title = title[:-len(date_str)].strip()
            for delimiter in ["\ufffd"]:
                if delimiter in title:
                    title = title.split(delimiter)[0].strip()

            articles.append({
                "title": title,
                "url": href,
                "description": desc,
                "published": date_str,
                "image": img_url,
                "source": "Hukumonline.com",
            })

        return {
            "success": True,
            "data": {
                "category": display_name,
                "source": "Hukumonline.com",
                "articles": articles[:20],
                "total": len(articles),
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Parsing failed: {str(e)}"}
