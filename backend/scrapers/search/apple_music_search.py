import re
import urllib.parse
# Import curl_cffi for HTTP requests
from curl_cffi import requests


def normalize_text(value):
    return re.sub(r'\s+', ' ', str(value or '')).strip()

def format_duration(ms):
    if not ms:
        return "00:00"
    minutes = int(ms // 60000)
    seconds = int((ms % 60000) // 1000)
    return f"{minutes}:{seconds:02d}"

def search_apple_music(payload):
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

    limit = payload.get("limit", 30)
    try:
        limit = int(limit)
    except Exception:
        limit = 30

    try:
        url = "https://itunes.apple.com/search"
        params = {
            "term": normalized_query,
            "limit": limit,
            "entity": "song"
        }
        
        session = requests.Session()
        resp = session.get(url, params=params, impersonate="chrome", timeout=15)
        resp.raise_for_status()
        data = resp.json()
        
        results = data.get("results", [])
        if not results:
            return {
                "success": False,
                "error": "Lagu tidak ditemukan di Apple Music."
            }
            
        formatted_results = []
        for item in results:
            artwork_url = item.get("artworkUrl100") or ""
            # Upscale thumbnail
            thumbnail = artwork_url.replace("100x100bb.jpg", "600x600bb.jpg") if artwork_url else ""
            
            track_name = item.get("trackName") or "Unknown Song"
            artist_name = item.get("artistName") or "Unknown Artist"
            album_name = item.get("collectionName") or "Unknown Album"
            
            explicit = "Yes" if item.get("trackExplicitness") == "explicit" else "No"
            
            formatted_results.append({
                "id": str(item.get("trackId") or ""),
                "title": track_name,
                "description": f"Album: {album_name}\nArtist: {artist_name}",
                "image": thumbnail,
                "url": item.get("trackViewUrl") or "",
                "preview": item.get("previewUrl") or "",
                "artist": artist_name,
                "album": album_name,
                "genre": item.get("primaryGenreName") or "",
                "duration": format_duration(item.get("trackTimeMillis")),
                "releaseDate": item.get("releaseDate") or "",
                "explicit": explicit,
                "type": "song",
                "creator": {
                    "name": artist_name,
                    "username": artist_name
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
            "error": f"Terjadi kesalahan pada sistem pencarian: {str(e)}"
        }
