import requests
from bs4 import BeautifulSoup
import re

STONE_NAMES = [
    "Akik Lumut",
    "Akik pohon",
    "Akik Garis/Pita",
    "Akik Renda/Jalinan",
    "Akik menyerupai bulu burung",
    "Akik bintik-bintik",
    "Akik Mata",
    "Akik Dendrite",
    "Akik India",
    "Akik Botswana",
    "Jasper kulit Leopard",
    "Poppy Jasper",
    "Opalite Jasper",
    "Jasper Coklat",
    "Jasper Hijau",
    "Jasper Merah",
    "Druzy Quartz",
    "Rutilated Quartz",
    "Smokey Quartz/Kwarsa Coklat",
    "White Quartz/Kwarsa Putih"
]

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9/]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')

def get_batu_permata(payload):
    batu_param = payload.get("batu", "").strip().lower()
    if not batu_param:
        return {"success": False, "error": "Parameter 'batu' is required"}

    url = "https://www.primbon.com/batu_permata.htm"
    try:
        res = requests.get(url, timeout=10)
        res.raise_for_status()
    except Exception as e:
        return {"success": False, "error": f"Failed to fetch data from Primbon: {str(e)}"}

    soup = BeautifulSoup(res.content, "html.parser")
    
    all_items = []
    idx = 1
    for ul in soup.find_all("ul"):
        for li in ul.find_all("li"):
            text = li.text.strip()
            if not text:
                continue
            
            matched_name = None
            for name in STONE_NAMES:
                if text.lower().startswith(name.lower()):
                    matched_name = name
                    break
                    
            if matched_name:
                desc = text[len(matched_name):].strip()
                desc = re.sub(r'^[:\s\-\u2013]+', '', desc)
                if desc and desc[0].islower():
                    desc = desc[0].upper() + desc[1:]
                
                slug = slugify(matched_name)
                all_items.append({
                    "id": idx,
                    "nama": matched_name,
                    "slug": slug,
                    "deskripsi": desc
                })
                idx += 1

    # Find the requested gemstone
    matched_wood = None
    
    # 1. Match by exact ID
    if batu_param.isdigit():
        target_id = int(batu_param)
        for item in all_items:
            if item["id"] == target_id:
                matched_wood = item
                break
                
    # 2. Match by exact slug
    if not matched_wood:
        for item in all_items:
            if item["slug"] == batu_param:
                matched_wood = item
                break
                
    # 3. Match by partial/exact name
    if not matched_wood:
        for item in all_items:
            if batu_param in item["nama"].lower():
                matched_wood = item
                break

    if not matched_wood:
        return {"success": False, "error": f"Gemstone '{batu_param}' not found."}

    return {
        "success": True,
        "data": matched_wood
    }
