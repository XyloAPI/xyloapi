import re
import requests
from bs4 import BeautifulSoup

CATEGORIES = {
    "ekonomi":   ("Bisnis Ekonomi",   "https://ekonomi.bisnis.com/"),
    "finansial": ("Bisnis Finansial", "https://finansial.bisnis.com/"),
    "market":    ("Bisnis Market",    "https://market.bisnis.com/"),
    "teknologi": ("Bisnis Teknologi", "https://teknologi.bisnis.com/"),
    "otomotif":  ("Bisnis Otomotif",  "https://otomotif.bisnis.com/"),
    "bola":      ("Bisnis Bola",      "https://bola.bisnis.com/"),
    "kabar24":   ("Bisnis Kabar24",   "https://kabar24.bisnis.com/"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
}


def clean_title(title):
    # Remove timestamps like "5 jam yang lalu", "10 menit yang lalu", "1 hari yang lalu"
    title = re.sub(r'\d+\s+(jam|menit|hari)\s+yang\s+lalu.*$', '', title, flags=re.IGNORECASE)
    return title.strip()


def get_bisnis_news(payload):
    category = (payload.get("category") or "ekonomi").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, url = CATEGORIES[category]

    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"Bisnis.com returned HTTP {resp.status_code}"}
        html_content = resp.content
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    try:
        soup = BeautifulSoup(html_content, "html.parser")
    except Exception as e:
        return {"success": False, "error": f"Failed to parse HTML: {str(e)}"}

    a_tags = soup.find_all("a", href=lambda h: h and '/read/' in h and h.startswith("http"))
    url_map = {}

    for a in a_tags:
        href = a.get("href")
        
        header = a.find(["h1", "h2", "h3", "h4"])
        if header:
            text = header.get_text(strip=True)
        else:
            title_el = a.find(class_=lambda c: c and 'title' in c.lower())
            if title_el:
                text = title_el.get_text(strip=True)
            else:
                text = a.get_text(strip=True)
                
        img_tag = a.find("img")
        img_src = img_tag.get("src") if img_tag else ""

        if not img_src:
            parent = a.parent
            if parent:
                parent_img = parent.find("img")
                if parent_img:
                    img_src = parent_img.get("src") or ""

        if not img_src and a.parent and a.parent.parent:
            gp_img = a.parent.parent.find("img")
            if gp_img:
                img_src = gp_img.get("src") or ""

        if href not in url_map:
            url_map[href] = {"texts": [], "images": []}

        if text:
            url_map[href]["texts"].append(text)
        if img_src:
            url_map[href]["images"].append(img_src)

    articles = []
    for href, data in url_map.items():
        cleaned_texts = []
        for t in data["texts"]:
            cleaned = clean_title(t)
            if cleaned and len(cleaned) > 10 and 'baca selengkapnya' not in cleaned.lower():
                cleaned_texts.append(cleaned)
                
        if not cleaned_texts:
            continue

        title = max(cleaned_texts, key=len)
        images = [img for img in data["images"] if 'logo' not in img.lower() and '.svg' not in img.lower() and 'default' not in img.lower()]
        image = images[0] if images else ""

        # Filter out articles without a valid image representation
        if not image or not image.startswith("http"):
            continue

        pub_date = ""
        match = re.search(r'/read/(\d{8})/', href)
        if match:
            date_str = match.group(1)
            pub_date = f"{date_str[6:8]}-{date_str[4:6]}-{date_str[0:4]}"

        articles.append({
            "title": title,
            "url": href,
            "image": image,
            "published": pub_date,
            "description": "",
            "source": "Bisnis.com"
        })

    # Limit to top 20 articles
    articles = articles[:20]

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "Bisnis.com",
            "articles": articles,
            "total": len(articles),
        }
    }
