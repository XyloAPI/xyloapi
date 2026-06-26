import re
import requests
from bs4 import BeautifulSoup

CATEGORIES = {
    "all":                     ("BMKG Semua Berita",            "https://www.bmkg.go.id/berita"),
    "utama":                   ("BMKG Berita Utama",            "https://www.bmkg.go.id/berita/utama"),
    "kegiatan":                ("BMKG Berita Kegiatan",         "https://www.bmkg.go.id/berita/kegiatan"),
    "daerah":                  ("BMKG Berita Daerah",           "https://www.bmkg.go.id/berita/daerah"),
    "kegiatan-internasional":  ("BMKG Kegiatan Internasional",  "https://www.bmkg.go.id/berita/kegiatan-internasional"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
}


def get_bmkg_news(payload):
    category = (payload.get("category") or "all").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, url = CATEGORIES[category]

    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"BMKG returned HTTP {resp.status_code}"}
        html_content = resp.content
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    try:
        soup = BeautifulSoup(html_content, "html.parser")
    except Exception as e:
        return {"success": False, "error": f"Failed to parse HTML: {str(e)}"}

    items = soup.find_all("article")
    articles = []

    for item in items:
        a_tag = item.find("a")
        if not a_tag:
            continue

        href = a_tag.get("href") or ""
        link = href if href.startswith("http") else f"https://www.bmkg.go.id{href}"

        img_tag = item.find("img")
        image = img_tag.get("src") or "" if img_tag else ""

        time_tag = item.find("time")
        pub = time_tag.get_text(strip=True) if time_tag else ""

        h2_tag = item.find("h2")
        title = h2_tag.get_text(strip=True) if h2_tag else ""

        p_tag = item.find("p")
        desc = p_tag.get_text(strip=True) if p_tag else ""

        articles.append({
            "title": title,
            "url": link,
            "description": desc,
            "published": pub,
            "image": image,
            "source": "BMKG Berita",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "BMKG Berita",
            "articles": articles,
            "total": len(articles),
        }
    }
BMKG_EARTHQUAKE_URLS = {
    "terkini": "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json",
    "terbaru": "https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json",
    "dirasakan": "https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json",
}

def _fetch_bmkg_json(url, label):
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"{label} returned HTTP {resp.status_code}"}
        data = resp.json()
        return {"success": True, "data": data}
    except Exception as e:
        return {"success": False, "error": f"Failed to fetch {label}: {str(e)}"}

def _normalize_shakemap_url(shakemap_raw):
    """Convert BMKG shakemap URL to use static.bmkg.go.id CDN"""
    if not shakemap_raw:
        return None
    # Extract just the filename from whatever URL format
    filename = shakemap_raw.strip().rstrip('/').split('/')[-1]
    if not filename.endswith('.jpg'):
        filename += '.jpg'
    return f"https://static.bmkg.go.id/{filename}"

def get_gempa_terkini(payload=None):
    """Latest earthquake from autogempa.json"""
    result = _fetch_bmkg_json(BMKG_EARTHQUAKE_URLS["terkini"], "Gempa Terkini")
    if not result["success"]:
        return result
    raw = result["data"]
    gempa = raw.get("Infogempa", {}).get("gempa", {})
    if not gempa:
        return {"success": False, "error": "No earthquake data available"}
    return {
        "success": True,
        "data": {
            "source": "BMKG",
            "type": "gempa-terkini",
            "gempa": {
                "magnitude": gempa.get("Magnitude"),
                "kedalaman": gempa.get("Kedalaman"),
                "wilayah": gempa.get("Wilayah"),
                "potensi": gempa.get("Potensi"),
                "lintang": gempa.get("Lintang"),
                "bujur": gempa.get("Bujur"),
                "coordinates": gempa.get("Coordinates"),
                "tanggal": gempa.get("Tanggal"),
                "jam": gempa.get("Jam"),
                "shakemap": _normalize_shakemap_url(gempa.get("Shakemap")),
            }
        }
    }

def get_gempa_terbaru(payload=None):
    """Recent earthquakes list from gempaterkini.json"""
    result = _fetch_bmkg_json(BMKG_EARTHQUAKE_URLS["terbaru"], "Gempa Terbaru")
    if not result["success"]:
        return result
    raw = result["data"]
    gempas = raw.get("Infogempa", {}).get("gempa", [])
    if not gempas:
        return {"success": False, "error": "No earthquake data available"}
    if not isinstance(gempas, list):
        gempas = [gempas]
    items = []
    for g in gempas:
        items.append({
            "magnitude": g.get("Magnitude"),
            "kedalaman": g.get("Kedalaman"),
            "wilayah": g.get("Wilayah"),
            "potensi": g.get("Potensi"),
            "lintang": g.get("Lintang"),
            "bujur": g.get("Bujur"),
            "coordinates": g.get("Coordinates"),
            "tanggal": g.get("Tanggal"),
            "jam": g.get("Jam"),
            "shakemap": _normalize_shakemap_url(g.get("Shakemap")),
        })
    return {
        "success": True,
        "data": {
            "source": "BMKG",
            "type": "gempa-terbaru",
            "gempa": items,
            "total": len(items),
        }
    }

def get_gempa_dirasakan(payload=None):
    """Felt earthquakes from gempadirasakan.json"""
    result = _fetch_bmkg_json(BMKG_EARTHQUAKE_URLS["dirasakan"], "Gempa Dirasakan")
    if not result["success"]:
        return result
    raw = result["data"]
    gempas = raw.get("Infogempa", {}).get("gempa", [])
    if not gempas:
        return {"success": False, "error": "No felt earthquake data available"}
    if not isinstance(gempas, list):
        gempas = [gempas]
    items = []
    for g in gempas:
        items.append({
            "magnitude": g.get("Magnitude"),
            "kedalaman": g.get("Kedalaman"),
            "wilayah": g.get("Wilayah"),
            "potensi": g.get("Potensi"),
            "dirasakan": g.get("Dirasakan"),
            "lintang": g.get("Lintang"),
            "bujur": g.get("Bujur"),
            "coordinates": g.get("Coordinates"),
            "tanggal": g.get("Tanggal"),
            "jam": g.get("Jam"),
            "shakemap": _normalize_shakemap_url(g.get("Shakemap")),
        })
    return {
        "success": True,
        "data": {
            "source": "BMKG",
            "type": "gempa-dirasakan",
            "gempa": items,
            "total": len(items),
        }
    }
