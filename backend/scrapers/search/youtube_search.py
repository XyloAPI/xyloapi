import re
import json
import urllib.parse
# Import HTTP/HTML parsers
from curl_cffi import requests
from bs4 import BeautifulSoup


def normalize_text(value):
    return re.sub(r'\s+', ' ', str(value or '')).strip()

def clean_youtube_thumbnail(url):
    if not url:
        return ""
    if url.startswith("//"):
        url = "https:" + url
    return url.split("?")[0]

def extract_yt_initial_data(html):
    start_patterns = [
        "window['ytInitialData'] =",
        'window["ytInitialData"] =',
        "ytInitialData =",
        "var ytInitialData ="
    ]
    
    for pattern in start_patterns:
        idx = html.find(pattern)
        if idx != -1:
            json_start = html.find("{", idx)
            if json_start != -1:
                bracket_count = 0
                in_string = False
                escape = False
                for i in range(json_start, len(html)):
                    char = html[i]
                    if char == '"' and not escape:
                        in_string = not in_string
                    elif char == '\\' and in_string:
                        escape = not escape
                        continue
                    elif not in_string:
                        if char == '{':
                            bracket_count += 1
                        elif char == '}':
                            bracket_count -= 1
                            if bracket_count == 0:
                                return html[json_start:i+1]
                    escape = False
    return None

def search_youtube(payload):
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

    limit = payload.get("limit", 20)
    try:
        limit = int(limit)
    except Exception:
        limit = 20

    try:
        url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(normalized_query)}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Referer": "https://www.google.com/"
        }
        
        session = requests.Session()
        resp = session.get(url, headers=headers, impersonate="chrome", timeout=30)
        resp.raise_for_status()
        html = resp.text
        
        json_str = extract_yt_initial_data(html)
        if not json_str:
            return {
                "success": False,
                "error": "Failed to extract search data from YouTube."
            }
            
        data = json.loads(json_str)
        
        contents = data.get("contents", {})
        two_column = contents.get("twoColumnSearchResultsRenderer") or contents.get("twoColumnSearchResultRenderer") or {}
        primary = two_column.get("primaryContents", {})
        section_list = primary.get("sectionListRenderer", {})
        section_contents = section_list.get("contents", [])
        
        results = []
        
        for section in section_contents:
            if "itemSectionRenderer" not in section:
                continue
                
            items = section["itemSectionRenderer"].get("contents", [])
            for item in items:
                if len(results) >= limit:
                    break
                    
                # 1. Parse Videos
                if "videoRenderer" in item:
                    vr = item["videoRenderer"]
                    video_id = vr.get("videoId")
                    if not video_id:
                        continue
                        
                    title = vr.get("title", {}).get("runs", [{}])[0].get("text") or "Untitled Video"
                    owner_name = vr.get("ownerText", {}).get("runs", [{}])[0].get("text") or "Unknown Channel"
                    
                    owner_url_path = vr.get("ownerText", {}).get("runs", [{}])[0].get("navigationEndpoint", {}).get("browseEndpoint", {}).get("canonicalBaseUrl") or ""
                    owner_handle = owner_url_path.replace("/@", "") if owner_url_path.startswith("/@") else owner_url_path.replace("/", "")
                    
                    published = vr.get("publishedTimeText", {}).get("simpleText") or "Unknown Date"
                    views = vr.get("viewCountText", {}).get("simpleText") or "No views"
                    duration = vr.get("lengthText", {}).get("simpleText") or "0:00"
                    
                    desc_runs = vr.get("detailedMetadataSnippets", [{}])[0].get("snippetText", {}).get("runs", [])
                    desc = "".join([r.get("text", "") for r in desc_runs])
                    if not desc:
                        desc_runs = vr.get("descriptionSnippet", {}).get("runs", [])
                        desc = "".join([r.get("text", "") for r in desc_runs])
                        
                    thumbnails = vr.get("thumbnail", {}).get("thumbnails", [])
                    thumbnail_url = thumbnails[-1].get("url") if thumbnails else f"https://img.youtube.com/vi/{video_id}/mqdefault.jpg"
                    thumbnail_url = clean_youtube_thumbnail(thumbnail_url)
                        
                    results.append({
                        "id": video_id,
                        "title": title,
                        "description": desc,
                        "image": thumbnail_url,
                        "url": f"https://www.youtube.com/watch?v={video_id}",
                        "type": "video",
                        "duration": duration,
                        "views": views,
                        "published": published,
                        "creator": {
                            "name": owner_name,
                            "username": owner_handle or owner_name
                        }
                    })
                    
                # 2. Parse Playlists
                elif "playlistRenderer" in item:
                    pr = item["playlistRenderer"]
                    playlist_id = pr.get("playlistId")
                    if not playlist_id:
                        continue
                        
                    title = pr.get("title", {}).get("simpleText") or pr.get("title", {}).get("runs", [{}])[0].get("text") or "Untitled Playlist"
                    video_count = pr.get("videoCount") or "0"
                    owner_name = pr.get("longBylineText", {}).get("runs", [{}])[0].get("text") or "Unknown"
                    
                    thumbnails = pr.get("thumbnails", [{}])[0].get("thumbnails", [])
                    thumbnail_url = thumbnails[-1].get("url") if thumbnails else "https://www.youtube.com/img/desktop/yt_1200.png"
                    thumbnail_url = clean_youtube_thumbnail(thumbnail_url)
                        
                    results.append({
                        "id": playlist_id,
                        "title": title,
                        "description": f"Playlist by {owner_name}",
                        "image": thumbnail_url,
                        "url": f"https://www.youtube.com/playlist?list={playlist_id}",
                        "type": "playlist",
                        "videoCount": video_count,
                        "creator": {
                            "name": owner_name,
                            "username": owner_name
                        }
                    })
                    
                # 3. Parse Channels
                elif "channelRenderer" in item:
                    cr = item["channelRenderer"]
                    channel_id = cr.get("channelId")
                    if not channel_id:
                        continue
                        
                    title = cr.get("title", {}).get("simpleText") or cr.get("title", {}).get("runs", [{}])[0].get("text") or "Unknown Channel"
                    subs = cr.get("subscriberCountText", {}).get("simpleText") or "0 subscribers"
                    video_count = cr.get("videoCountText", {}).get("runs", [{}])[0].get("text") or "0 videos"
                    
                    desc_runs = cr.get("descriptionSnippet", {}).get("runs", [])
                    desc = "".join([r.get("text", "") for r in desc_runs])
                    
                    thumbnails = cr.get("thumbnail", {}).get("thumbnails", [])
                    thumbnail_url = thumbnails[-1].get("url") if thumbnails else "https://www.youtube.com/img/desktop/yt_1200.png"
                    thumbnail_url = clean_youtube_thumbnail(thumbnail_url)
                        
                    results.append({
                        "id": channel_id,
                        "title": title,
                        "description": desc,
                        "image": thumbnail_url,
                        "url": f"https://www.youtube.com/channel/{channel_id}",
                        "type": "channel",
                        "subscriberCount": subs,
                        "videoCount": video_count,
                        "creator": {
                            "name": title,
                            "username": title
                        }
                    })

        return {
            "success": True,
            "query": normalized_query,
            "total": len(results),
            "results": results,
            "data": results
        }

    except Exception as error:
        return {
            "success": False,
            "error": f"Failed to search on YouTube: {str(error)}"
        }
