import requests
import re
import time
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}

def clean_desc(text):
    if not text:
        return ""
    # Remove zero width spaces and multiple whitespaces
    text = text.replace("\u200b", "").replace("\xa0", " ")
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def extract_bg_image(style):
    if not style:
        return ""
    m = re.search(r'url\((.*?)\)', style)
    if m:
        url = m.group(1).strip("'\"")
        if url.startswith("/"):
            return f"https://www.bi.go.id{url}"
        return url
    return ""

def get_bi_news(payload):
    category = (payload.get("category") or "news-release").strip().lower()

    if category not in ["news-release", "latest", "release"]:
        return {"success": False, "error": "Only category 'news-release' is supported."}

    url = "https://www.bi.go.id/id/publikasi/ruang-media/news-release/default.aspx"

    resp = None
    last_err = ""
    for attempt in range(3):
        try:
            resp = requests.get(url, headers=HEADERS, timeout=25)
            if resp.status_code == 200:
                break
        except Exception as e:
            last_err = str(e)
            time.sleep(1.5)

    if not resp or resp.status_code != 200:
        err_msg = f"HTTP {resp.status_code}" if resp else last_err
        return {"success": False, "error": f"Failed to fetch Bank Indonesia news release: {err_msg}"}

    try:
        soup = BeautifulSoup(resp.content, "html.parser")
        items = soup.find_all("div", class_="media--pers")
        
        articles = []
        for item in items:
            title_a = item.find("a", class_="media__title")
            if not title_a:
                continue
                
            title = title_a.get_text(strip=True)
            href = title_a.get("href") or ""
            if href.startswith("/"):
                href = f"https://www.bi.go.id{href}"
                
            subtitle = item.find("div", class_="media__subtitle")
            date_str = ""
            if subtitle:
                parts = subtitle.get_text(strip=True).split("•")
                if parts:
                    date_str = parts[0].strip()
                    
            desc_p = item.find("p", class_="ellipsis--three-line")
            desc = clean_desc(desc_p.get_text()) if desc_p else ""
            if not desc:
                desc = title
                
            img_div = item.find("div", class_="media__img")
            img_url = extract_bg_image(img_div.get("style")) if img_div else ""
            
            articles.append({
                "title": title,
                "url": href,
                "description": desc,
                "published": date_str,
                "image": img_url,
                "source": "Bank Indonesia",
            })
            
        return {
            "success": True,
            "data": {
                "category": "News Release",
                "source": "Bank Indonesia",
                "articles": articles[:20],
                "total": len(articles),
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Parsing failed: {str(e)}"}
