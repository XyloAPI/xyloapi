import requests
from bs4 import BeautifulSoup
import re

PAGES = [
    "https://www.primbon.com/pantangan.htm",
    "https://www.primbon.com/pantangan-1.htm",
    "https://www.primbon.com/pantangan-2.htm",
]

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')

def _parse_page(url):
    res = requests.get(url, timeout=10)
    res.raise_for_status()
    soup = BeautifulSoup(res.content, "html.parser")
    
    items = []
    b_tags = soup.find_all("b")
    
    for b in b_tags:
        title = b.get_text(strip=True)
        if not title or len(title) < 5:
            continue
        
        desc_parts = []
        sibling = b.next_sibling
        while sibling:
            if sibling.name == "b":
                break
            if sibling.name is None:
                txt = str(sibling).strip()
                if txt:
                    desc_parts.append(txt)
            sibling = sibling.next_sibling
        
        desc = " ".join(desc_parts).strip()
        items.append({"judul": title, "penjelasan": desc})
    
    return items

def _get_all_items():
    all_items = []
    for page_url in PAGES:
        items = _parse_page(page_url)
        all_items.extend(items)
    
    for i, item in enumerate(all_items):
        item["id"] = i + 1
        item["slug"] = slugify(item["judul"])
    
    return all_items

def get_pamali(payload):
    keyword = payload.get("keyword", "").strip().lower()
    nomor_str = payload.get("nomor", "").strip()

    if not keyword and not nomor_str:
        return {"success": False, "error": "Parameter 'keyword' atau 'nomor' harus diisi"}

    try:
        all_items = _get_all_items()
    except Exception as e:
        return {"success": False, "error": f"Gagal mengambil data dari Primbon: {str(e)}"}

    matched = None

    # 1. Match by nomor (ID)
    if nomor_str.isdigit():
        target_id = int(nomor_str)
        for item in all_items:
            if item["id"] == target_id:
                matched = item
                break

    # 2. Match by slug
    if not matched and keyword:
        for item in all_items:
            if item["slug"] == keyword or keyword == str(item["id"]):
                matched = item
                break

    # 3. Partial keyword search in judul
    if not matched and keyword:
        for item in all_items:
            if keyword in item["judul"].lower():
                matched = item
                break

    # 4. Keyword search in penjelasan
    if not matched and keyword:
        for item in all_items:
            if keyword in item["penjelasan"].lower():
                matched = item
                break

    if not matched:
        return {"success": False, "error": f"Pantangan '{keyword or nomor_str}' tidak ditemukan."}

    return {"success": True, "data": matched}
