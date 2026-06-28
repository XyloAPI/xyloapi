import re
import json
# Import HTTP request library
from curl_cffi import requests


def normalize_text(value):
    return re.sub(r'\s+', ' ', str(value or '')).strip()

def search_tiktok(payload):
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

    limit = payload.get("limit", 10)
    try:
        limit = int(limit)
    except Exception:
        limit = 10

    try:
        url = "https://www.tikwm.com/api/feed/search"
        data = {
            "keywords": normalized_query,
            "count": limit,
            "cursor": 0
        }
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        session = requests.Session()
        resp = session.post(url, data=data, headers=headers, impersonate="chrome", timeout=15)
        resp.raise_for_status()
        res_data = resp.json()
        
        if res_data.get("code") != 0:
            return {
                "success": False,
                "error": res_data.get("msg") or "Gagal mendapatkan video dari TikTok."
            }
            
        videos = res_data.get("data", {}).get("videos", []) or []
        if not videos:
            return {
                "success": False,
                "error": f"Pencarian TikTok tidak membuahkan hasil untuk '{normalized_query}'."
            }
            
        formatted_results = []
        for item in videos:
            video_id = item.get("video_id")
            title = normalize_text(item.get("title"))
            author = item.get("author", {})
            author_name = author.get("nickname") or "TikTok Creator"
            author_username = author.get("unique_id") or "tiktok_user"
            
            tiktok_url = f"https://www.tiktok.com/@{author_username}/video/{video_id}" if video_id else ""
            
            # Format duration in minutes:seconds
            duration_sec = item.get("duration", 0)
            try:
                duration_sec = int(duration_sec)
                min_part = duration_sec // 60
                sec_part = duration_sec % 60
                duration_str = f"{min_part}:{sec_part:02d}"
            except Exception:
                duration_str = str(duration_sec)
                
            formatted_results.append({
                "id": str(video_id or ""),
                "title": title or f"TikTok Video by {author_name}",
                "description": item.get("content_desc") or title or "",
                "image": item.get("origin_cover") or item.get("cover") or "",
                "url": tiktok_url,
                "play": item.get("play") or "",
                "duration": duration_str,
                "views": str(item.get("play_count") or "0"),
                "digg_count": item.get("digg_count") or 0,
                "comment_count": item.get("comment_count") or 0,
                "share_count": item.get("share_count") or 0,
                "type": "video",
                "creator": {
                    "name": author_name,
                    "username": author_username
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
            "error": f"Terjadi kesalahan pada pencarian TikTok: {str(e)}"
        }
