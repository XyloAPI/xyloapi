import re
import codecs
import json
# Import HTTP/HTML parsers
from curl_cffi import requests
from bs4 import BeautifulSoup


BASE_URL = "https://kuncilagu.exe.bz"

def normalize_text(value):
    return re.sub(r'\s+', ' ', str(value or '')).strip()

def parse_title_parts(title):
    normalized = normalize_text(title)
    divider_index = normalized.find(" - ")
    if divider_index < 0:
        return {
            "artist": None,
            "song": normalized or None
        }
    return {
        "artist": normalize_text(normalized[:divider_index]) or None,
        "song": normalize_text(normalized[divider_index + 3:]) or None
    }

def parse_result_item(item):
    name_html = str(item.get("name") or "")
    soup = BeautifulSoup(name_html, "html.parser")
    anchor = soup.find("a")
    if not anchor:
        return None
        
    title = normalize_text(anchor.get_text())
    item_id = normalize_text(item.get("id"))
    
    if not title or not item_id:
        return None
        
    parts = parse_title_parts(title)
    return {
        "id": item_id,
        "title": title,
        "artist": parts["artist"],
        "song": parts["song"]
    }

def rot13(value):
    try:
        return codecs.encode(str(value or ''), 'rot_13')
    except Exception:
        # Fallback manual rot13
        res = []
        for char in str(value or ''):
            if 'a' <= char <= 'z':
                res.append(chr((ord(char) - 97 + 13) % 26 + 97))
            elif 'A' <= char <= 'Z':
                res.append(chr((ord(char) - 65 + 13) % 26 + 65))
            else:
                res.append(char)
        return "".join(res)

def cleanup_chord_text(html_content):
    # Remove anchor tags
    html_content = re.sub(r'<a\b[^>]*>[\s\S]*?</a>', '', html_content, flags=re.IGNORECASE)
    # Replace br tags with placeholder
    html_content = re.sub(r'<br\s*/?>', '__XYLO_NL__', html_content, flags=re.IGNORECASE)
    # Remove format tags
    html_content = re.sub(r'</?(span|div|font|b|i|u)[^>]*>', '', html_content, flags=re.IGNORECASE)
    # Replace &nbsp;
    html_content = html_content.replace('&nbsp;', ' ')
    
    soup = BeautifulSoup(f"<div>{html_content}</div>", "html.parser")
    text = soup.get_text()
    
    text = text.replace('__XYLO_NL__', '\n').replace('\r', '')
    lines = text.split('\n')
    cleaned_lines = []
    for line in lines:
        cleaned_line = re.sub(r'\s+', ' ', line).strip()
        if cleaned_line and not re.search(r'kuncilagu\.exe\.bz', cleaned_line, re.IGNORECASE):
            cleaned_lines.append(cleaned_line)
            
    final_text = '\n'.join(cleaned_lines)
    final_text = re.sub(r'\n{3,}', '\n\n', final_text)
    return final_text.strip() or None

def extract_chord_text(detail_html):
    match = re.search(r"var s = '([\s\S]*?)';\s*var enc = s\.mumet\(\)", str(detail_html or ""))
    if not match:
        return None

    decoded = rot13(match.group(1))
    replacements = [
        (r"&aofc;", "&nbsp;"),
        (r"<oe>", "<br>"),
        (r"<n ", "<a "),
        (r"</n>", "</a>"),
        (r"<fcna ", "<span "),
        (r"</fcna>", "</span>"),
        (r"fglyr=", "style="),
        (r"pbybe:", "color:"),
        (r"sbag-jrvtug:", "font-weight:"),
        (r"sbag-fvmr:", "font-size:"),
        (r"juvgr", "white"),
        (r"uggc:", "http:"),
        (r"uers=", "href=")
    ]

    for pattern, replacement in replacements:
        decoded = re.sub(pattern, replacement, decoded)
        
    return cleanup_chord_text(decoded)

def parse_json_ld(detail_html):
    soup = BeautifulSoup(str(detail_html or ""), "html.parser")
    scripts = soup.find_all("script", type="application/ld+json")
    for script in scripts:
        try:
            content = script.string or script.get_text()
            if content:
                parsed = json.loads(content)
                if isinstance(parsed, dict):
                    return parsed
        except Exception:
            continue
    return None

def absolute_url(value):
    normalized = normalize_text(value)
    if not normalized:
        return None
    if re.match(r'^https?://', normalized, re.IGNORECASE):
        return normalized
    if normalized.startswith("/"):
        return f"{BASE_URL}{normalized}"
    return f"{BASE_URL}/{normalized}"

def enrich_chord_result(item, session):
    detail_url = f"{BASE_URL}/{item['id']}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
        "Accept-Language": "id-ID,id;q=0.9,en;q=0.8",
        "Referer": f"{BASE_URL}/"
    }
    
    resp = session.get(detail_url, headers=headers, impersonate="chrome", timeout=20)
    resp.raise_for_status()
    html = resp.text
    
    soup = BeautifulSoup(html, "html.parser")
    json_ld = parse_json_ld(html) or {}
    chord = extract_chord_text(html)
    
    rating_val = json_ld.get("aggregateRating", {}).get("ratingValue") if isinstance(json_ld.get("aggregateRating"), dict) else None
    rating_count = json_ld.get("aggregateRating", {}).get("ratingCount") if isinstance(json_ld.get("aggregateRating"), dict) else None
    
    og_image = ""
    meta_og = soup.find("meta", property="og:image")
    if meta_og:
        og_image = meta_og.get("content") or ""
        
    image = absolute_url(og_image) or absolute_url(json_ld.get("image"))
    
    if image and ("moresharecorp" in image or "icon_100x100_kunci_gitar" in image):
        image = ""
    
    meta_desc = soup.find("meta", attrs={"name": "description"})
    og_desc = meta_desc.get("content") or "" if meta_desc else ""
    description = normalize_text(og_desc) or normalize_text(json_ld.get("description"))
    
    video = absolute_url(json_ld.get("video"))
    
    return {
        **item,
        "image": image,
        "description": description,
        "video": video,
        "rating": str(rating_val) if rating_val else None,
        "ratingCount": int(rating_count) if rating_count else None,
        "chord": chord
    }

def search_chord(payload):
    query = payload.get("query") or payload.get("q") or payload.get("text")
    if not query:
        return {
            "success": False,
            "error": "Parameter 'query' atau 'text' wajib diisi."
        }

    normalized_query = normalize_text(query)
    if not normalized_query:
        return {
            "success": False,
            "error": "Parameter 'query' atau 'text' wajib diisi."
        }

    try:
        url = f"{BASE_URL}/autocomplete.php"
        params = {
            "q": normalized_query,
            "style": "full",
            "maxRows": 20
        }
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
            "X-Requested-With": "XMLHttpRequest",
            "Referer": f"{BASE_URL}/",
            "Accept-Language": "id-ID,id;q=0.9,en;q=0.8"
        }
        
        session = requests.Session()
        resp = session.get(url, params=params, headers=headers, impersonate="chrome", timeout=20)
        resp.raise_for_status()
        
        data = resp.json()
        hasil = data.get("hasil") if isinstance(data, dict) else []
        items = hasil if isinstance(hasil, list) else []
        
        base_results = []
        for item in items:
            parsed = parse_result_item(item)
            if parsed:
                base_results.append(parsed)
                
        if not base_results:
            return {
                "success": False,
                "error": f"Pencarian Chord tidak membuahkan hasil untuk '{normalized_query}'."
            }
            
        # Enrich top 5 results
        enriched_results = []
        for item in base_results[:5]:
            try:
                enriched = enrich_chord_result(item, session)
                enriched_results.append(enriched)
            except Exception:
                enriched_results.append({
                    **item,
                    "image": None,
                    "description": None,
                    "video": None,
                    "rating": None,
                    "ratingCount": None,
                    "chord": None
                })
                
        # Format results for unified search schema
        formatted_results = []
        for item in enriched_results:
            desc = item.get("description") or f"Kunci gitar dan lirik lagu {item.get('title') or ''}"
            formatted_results.append({
                "id": item["id"],
                "title": item["title"],
                "description": normalize_text(desc),
                "image": item["image"] or "",
                "chord": item.get("chord"),
                "creator": {
                    "name": item.get("artist") or " ",
                    "username": item.get("artist") or " "
                }
            })
            
        return {
            "success": True,
            "query": normalized_query,
            "total": len(formatted_results),
            "results": formatted_results,
            "data": formatted_results
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Terjadi kesalahan pada pencarian Chord: {str(e)}"
        }
