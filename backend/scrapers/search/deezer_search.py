import re
from curl_cffi import requests

BASE_URL = 'https://api.deezer.com'
VALID_TYPES = ["track", "album", "artist"]

def normalize_text(value):
    return re.sub(r'\s+', ' ', str(value or '')).strip()

def format_duration(seconds):
    try:
        parsed = int(seconds)
        if parsed <= 0:
            return None
        minutes = parsed // 60
        remaining_seconds = parsed % 60
        return f"{minutes}:{remaining_seconds:02d}"
    except Exception:
        return None

def get_endpoint(search_type):
    if search_type == "album":
        return "/search/album"
    if search_type == "artist":
        return "/search/artist"
    return "/search"

def to_track_result(item):
    album = item.get("album") or {}
    artist = item.get("artist") or {}
    
    cover_hd = album.get("cover_xl") or album.get("cover_big") or album.get("cover_medium") or album.get("cover") or ""
    artist_name = normalize_text(artist.get("name")) or "Unknown Artist"
    album_title = normalize_text(album.get("title")) or "Unknown Album"
    
    return {
        "id": str(item.get("id") or ""),
        "title": normalize_text(item.get("title")) or "Unknown Track",
        "description": f"Artist: {artist_name}\nAlbum: {album_title}",
        "image": cover_hd,
        "url": item.get("link") or "",
        "type": "song",
        "preview": item.get("preview") or "",
        "duration": format_duration(item.get("duration")),
        "creator": {
            "name": artist_name,
            "username": artist_name
        }
    }

def to_album_result(item):
    artist = item.get("artist") or {}
    cover_hd = item.get("cover_xl") or item.get("cover_big") or item.get("cover_medium") or item.get("cover") or ""
    artist_name = normalize_text(artist.get("name")) or "Unknown Artist"
    
    tracks_count = item.get("nb_tracks") or 0
    
    return {
        "id": str(item.get("id") or ""),
        "title": normalize_text(item.get("title")) or "Unknown Album",
        "description": f"Artist: {artist_name}\nTracks: {tracks_count}",
        "image": cover_hd,
        "url": item.get("link") or "",
        "type": "playlist",
        "videoCount": str(tracks_count),
        "creator": {
            "name": artist_name,
            "username": artist_name
        }
    }

def to_artist_result(item):
    pic_hd = item.get("picture_xl") or item.get("picture_big") or item.get("picture_medium") or item.get("picture") or ""
    artist_name = normalize_text(item.get("name")) or "Unknown Artist"
    fans_count = item.get("nb_fan") or 0
    
    return {
        "id": str(item.get("id") or ""),
        "title": artist_name,
        "description": f"Fans: {fans_count:,}",
        "image": pic_hd,
        "url": item.get("link") or "",
        "type": "channel",
        "subscriberCount": f"{fans_count:,} fans",
        "creator": {
            "name": artist_name,
            "username": artist_name
        }
    }

def to_result(item, search_type):
    if search_type == "album":
        return to_album_result(item)
    if search_type == "artist":
        return to_artist_result(item)
    return to_track_result(item)

def search_deezer(payload):
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

    search_type = str(payload.get("type") or "track").lower().strip()
    if search_type not in VALID_TYPES:
        search_type = "track"

    limit = payload.get("limit", 20)
    try:
        limit = int(limit)
    except Exception:
        limit = 20

    try:
        url = f"{BASE_URL}{get_endpoint(search_type)}"
        params = {
            "q": normalized_query,
            "limit": limit
        }
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*"
        }
        
        session = requests.Session()
        resp = session.get(url, params=params, headers=headers, impersonate="chrome", timeout=15)
        resp.raise_for_status()
        data = resp.json()
        
        if isinstance(data, dict) and "error" in data:
            err_msg = data["error"].get("message") or "Deezer API returned an error."
            return {
                "success": False,
                "error": normalize_text(err_msg)
            }
            
        items = data.get("data", []) if isinstance(data, dict) else []
        if not items:
            return {
                "success": False,
                "error": f"Pencarian Deezer ({search_type}) tidak membuahkan hasil untuk '{normalized_query}'."
            }
            
        formatted_results = []
        for item in items:
            res = to_result(item, search_type)
            if any(res.values()):
                formatted_results.append(res)
                
        if not formatted_results:
            return {
                "success": False,
                "error": f"Pencarian Deezer ({search_type}) tidak membuahkan hasil untuk '{normalized_query}'."
            }
            
        return {
            "success": True,
            "query": normalized_query,
            "type": search_type,
            "total": len(formatted_results),
            "results": formatted_results,
            "data": formatted_results
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Terjadi kesalahan pada pencarian Deezer: {str(e)}"
        }
