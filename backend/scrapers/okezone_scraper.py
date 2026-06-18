import re
import requests
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed

CATEGORIES = {
    "breaking":      ("Okezone Breaking News", "http://sindikasi.okezone.com/index.php/okezone/RSS2.0"),
    "news":          ("Okezone News",          "http://sindikasi.okezone.com/index.php/news/RSS2.0"),
    "international": ("Okezone Internasional", "http://sindikasi.okezone.com/index.php/international/RSS2.0"),
    "lifestyle":     ("Okezone Lifestyle",     "http://sindikasi.okezone.com/index.php/lifestyle/RSS2.0"),
    "techno":        ("Okezone Techno",        "http://sindikasi.okezone.com/index.php/techno/RSS2.0"),
    "sports":        ("Okezone Sports",        "http://sindikasi.okezone.com/index.php/sports/RSS2.0"),
    "economy":       ("Okezone Economy",       "http://sindikasi.okezone.com/index.php/economy/RSS2.0"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
}


def fetch_og_image(url):
    try:
        # Use stream=True to download only the head section containing the og:image meta tag
        with requests.get(url, headers=HEADERS, timeout=5, stream=True) as r:
            if r.status_code != 200:
                return ""
            chunks = []
            bytes_read = 0
            for chunk in r.iter_content(chunk_size=4096):
                if not chunk:
                    break
                chunks.append(chunk)
                bytes_read += len(chunk)
                if bytes_read > 16384:
                    break
            html = b"".join(chunks).decode('utf-8', errors='ignore')

            m = re.search(r'<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']', html, re.I)
            if not m:
                m = re.search(r'<meta\s+content=["\']([^"\']+)["\']\s+property=["\']og:image["\']', html, re.I)
            if m:
                return m.group(1).strip()
    except Exception:
        pass
    return ""


def get_okezone_news(payload):
    category = (payload.get("category") or "breaking").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, feed_url = CATEGORIES[category]

    try:
        resp = requests.get(feed_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"Okezone returned HTTP {resp.status_code}"}
        xml_content = resp.content
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    try:
        soup = BeautifulSoup(xml_content, "xml")
    except Exception as e:
        return {"success": False, "error": f"Failed to parse XML: {str(e)}"}

    items = soup.find_all("item")
    articles = []

    # Limit to top 20 items to run concurrently
    for item in items[:20]:
        title = item.find("title").get_text(strip=True) if item.find("title") else ""
        link = item.find("link").get_text(strip=True) if item.find("link") else ""
        pub = item.find("pubDate").get_text(strip=True) if item.find("pubDate") else ""
        desc = item.find("description").get_text(strip=True) if item.find("description") else ""

        articles.append({
            "title": title,
            "url": link,
            "description": desc,
            "published": pub,
            "image": "",
            "source": "Okezone",
        })

    # Fetch og:image for articles concurrently
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(fetch_og_image, art["url"]): art for art in articles}
        for future in as_completed(futures):
            art = futures[future]
            img = future.result()
            art["image"] = img

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "Okezone",
            "articles": articles,
            "total": len(articles),
        }
    }
