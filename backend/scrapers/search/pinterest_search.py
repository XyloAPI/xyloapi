import re
import json
import urllib.parse
# Import HTTP/HTML parsers
from bs4 import BeautifulSoup
from curl_cffi import requests
import os

import email.utils
from datetime import datetime

def normalize_text(value):
    return re.sub(r'\s+', ' ', str(value or '')).strip()

def build_pinterest_cookie():
    raw_cookie = str(os.environ.get("PINTEREST_COOKIE") or "").strip()
    if raw_cookie:
        return raw_cookie

    raw_pairs = {}
    for k, v in os.environ.items():
        if k.startswith("PINTEREST_") or k in ["csrftoken", "_routing_id", "sessionFunnelEventLogged", "_b", "_auth", "_pinterest_sess", "__Secure-s_a", "ujr", "g_state"]:
            val = str(v or "").strip()
            if ";" in val:
                parts = val.split(";")
                for p in parts:
                    p = p.strip()
                    if "=" in p:
                        pk, pv = p.split("=", 1)
                        raw_pairs[pk.strip()] = pv.strip()
            else:
                raw_pairs[k] = val

    env_to_cookie = {
        "PINTEREST_CSRFTOKEN": "csrftoken",
        "PINTEREST_ROUTING_ID": "_routing_id",
        "PINTEREST_SESSION_FUNNEL_EVENT_LOGGED": "sessionFunnelEventLogged",
        "PINTEREST_B": "_b",
        "PINTEREST_AUTH": "_auth",
        "PINTEREST_SESS": "_pinterest_sess",
        "PINTEREST_SECURE_S_A": "__Secure-s_a",
        "PINTEREST_UJR": "ujr",
        "PINTEREST_G_STATE": "g_state",
        "csrftoken": "csrftoken",
        "_routing_id": "_routing_id",
        "sessionFunnelEventLogged": "sessionFunnelEventLogged",
        "_b": "_b",
        "_auth": "_auth",
        "_pinterest_sess": "_pinterest_sess",
        "__Secure-s_a": "__Secure-s_a",
        "ujr": "ujr",
        "g_state": "g_state"
    }

    cookie_dict = {}
    for k, v in raw_pairs.items():
        cookie_name = env_to_cookie.get(k)
        if cookie_name and v:
            cookie_dict[cookie_name] = v

    order = [
        "csrftoken",
        "_routing_id",
        "sessionFunnelEventLogged",
        "_b",
        "_auth",
        "_pinterest_sess",
        "__Secure-s_a",
        "ujr",
        "g_state"
    ]

    parts = []
    for cookie_name in order:
        val = cookie_dict.get(cookie_name)
        if val:
            parts.append(f"{cookie_name}={val}")

    return "; ".join(parts)

def parse_date(date_str):
    if not date_str:
        return None
    try:
        dt = email.utils.parsedate_to_datetime(date_str)
        return dt
    except Exception:
        pass
    try:
        clean_str = date_str.replace("Z", "+00:00")
        if "." in clean_str:
            parts = clean_str.split(".")
            sec_part = parts[1][:6]
            tz_part = ""
            if "+" in parts[1]:
                tz_part = "+" + parts[1].split("+")[1]
            elif "-" in parts[1]:
                tz_part = "-" + parts[1].split("-")[1]
            clean_str = parts[0] + "." + sec_part + tz_part
            return datetime.strptime(clean_str, "%Y-%m-%dT%H:%M:%S.%f%z")
        else:
            return datetime.fromisoformat(clean_str)
    except Exception:
        pass
    return None

def search_pinterest(payload):
    query = payload.get("query")
    if not query:
        return {
            "success": False,
            "status": False,
            "error": "❌ Parameter 'query' atau 'text' wajib diisi."
        }

    normalized_query = normalize_text(query)
    if not normalized_query:
        return {
            "success": False,
            "status": False,
            "error": "❌ Parameter 'query' atau 'text' wajib diisi."
        }

    pinterest_cookie = build_pinterest_cookie()
    if not pinterest_cookie:
        return {
            "success": False,
            "status": False,
            "error": "Missing Pinterest credentials in environment variables (PINTEREST_COOKIE)."
        }

    try:
        search_url = f"https://id.pinterest.com/search/pins/?q={urllib.parse.quote(normalized_query)}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
            "Referer": "https://www.pinterest.com/",
            "Cookie": pinterest_cookie
        }

        session = requests.Session()
        resp = session.get(search_url, headers=headers, impersonate="chrome", timeout=30)
        resp.raise_for_status()
        html = resp.text

        soup = BeautifulSoup(html, "html.parser")
        
        script_tags = []
        pws_data = soup.find("script", id="__PWS_DATA__")
        if pws_data:
            script_tags.append(pws_data.string or pws_data.text)
            
        pws_initial = soup.find("script", id="__PWS_INITIAL_PROPS__")
        if pws_initial:
            script_tags.append(pws_initial.string or pws_initial.text)
            
        initial_state = soup.find("script", id="initial-state")
        if initial_state:
            script_tags.append(initial_state.string or initial_state.text)

        script_tags = [t for t in script_tags if t]
        
        results = []
        internal_limit = 20

        for script_tag in script_tags:
            try:
                json_data = json.loads(script_tag)
                
                state = None
                if isinstance(json_data, dict):
                    props = json_data.get("props") or {}
                    state = props.get("initialReduxState") or json_data.get("initialReduxState") or props.get("initialState") or json_data
                else:
                    state = json_data
                    
                if not isinstance(state, dict):
                    continue
                    
                resources = state.get("resources", {}) or {}
                search_resource = resources.get("SearchResource", {}) or {}
                
                search_data_key = None
                for k, v in search_resource.items():
                    if isinstance(v, dict) and v.get("data", {}).get("results"):
                        search_data_key = k
                        break
                        
                search_pins = []
                if search_data_key:
                    search_pins = search_resource[search_data_key]["data"]["results"]
                    
                pins = state.get("pins", {}) or {}
                
                raw_list = search_pins if len(search_pins) > 0 else list(pins.values()) if isinstance(pins, dict) else []
                
                if len(raw_list) > 0:
                    for v in raw_list:
                        if not isinstance(v, dict):
                            continue
                        if len(results) >= internal_limit:
                            break
                        pin_id = v.get("id")
                        if not pin_id:
                            continue
                            
                        formatted_date = None
                        created_at_val = v.get("created_at")
                        if created_at_val:
                            try:
                                dt = parse_date(created_at_val)
                                if dt:
                                    months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
                                    formatted_date = f"{dt.day} {months[dt.month-1]} {dt.year}"
                                else:
                                    formatted_date = created_at_val
                            except Exception:
                                formatted_date = created_at_val
                                
                        pinner = v.get("pinner") or {}
                        board = v.get("board") or {}
                        images = v.get("images") or {}
                        videos = v.get("videos") or {}
                        video_list = videos.get("video_list") or {}
                        v720p = video_list.get("v720P") or {}
                        
                        orig_url = images.get("orig", {}).get("url") if isinstance(images.get("orig"), dict) else None
                        img_736x = images.get("736x", {}).get("url") if isinstance(images.get("736x"), dict) else None
                        image_url = orig_url or img_736x
                        
                        video_url = v720p.get("url") if isinstance(v720p, dict) else None
                        gif_url = orig_url if (orig_url and orig_url.endswith(".gif")) else None
                        
                        pin_type = "image"
                        if videos:
                            pin_type = "video"
                        elif orig_url and orig_url.endswith(".gif"):
                            pin_type = "gif"
                            
                        results.append({
                            "pin": f"https://www.pinterest.com/pin/{pin_id}",
                            "link": v.get("link"),
                            "created_at": formatted_date,
                            "id": pin_id,
                            "image_url": image_url,
                            "video_url": video_url,
                            "gif_url": gif_url,
                            "grid_title": v.get("grid_title") or v.get("title") or "",
                            "description": v.get("description") or "",
                            "type": pin_type,
                            "pinner": {
                                "username": pinner.get("username") or "Pinterest User",
                                "full_name": pinner.get("full_name") or "Pinterest User",
                                "follower_count": pinner.get("follower_count") or 0,
                                "image_small_url": pinner.get("image_small_url")
                            },
                            "board": {
                                "id": board.get("id"),
                                "name": board.get("name") or "Pins",
                                "url": board.get("url"),
                                "pin_count": board.get("pin_count") or 0
                            },
                            "reaction_counts": v.get("reaction_counts") or {},
                            "dominant_color": v.get("dominant_color"),
                            "seo_alt_text": v.get("seo_description") or v.get("grid_title") or ""
                        })
                    if len(results) > 0:
                        break
            except Exception as parse_err:
                pass

        if len(results) == 0:
            for element in soup.find_all("a", href=re.compile(r'/pin/')):
                if len(results) >= internal_limit:
                    break
                href = element.get("href")
                if not href:
                    continue
                pin_id_match = re.search(r'/pin/(\d+)', href)
                if not pin_id_match:
                    continue
                id_val = pin_id_match.group(1)
                
                if any(r["id"] == id_val for r in results):
                    continue
                    
                img_tag = element.find("img")
                if not img_tag:
                    parent_div = element.find_parent("div")
                    if parent_div:
                        img_tag = parent_div.find("img")
                        
                if not img_tag:
                    continue
                    
                image = img_tag.get("src") or img_tag.get("srcset") or ""
                if not image:
                    continue
                    
                if "," in image:
                    image = image.split(",")[-1].strip().split(" ")[0]
                    
                image = re.sub(r'236x|474x', 'originals', image)
                
                if not image or "data:image" in image:
                    continue
                    
                aria_label = element.get("aria-label") or ""
                grid_title = normalize_text(aria_label)
                grid_title = re.sub(r'\s+pin page$', '', grid_title, flags=re.IGNORECASE)
                if not grid_title:
                    grid_title = normalize_text(img_tag.get("alt")) or f"Pin {id_val}"
                    
                results.append({
                    "pin": f"https://www.pinterest.com/pin/{id_val}",
                    "id": id_val,
                    "image_url": image,
                    "grid_title": grid_title,
                    "description": normalize_text(img_tag.get("alt")),
                    "type": "image",
                    "pinner": {"username": "Pinterest User", "full_name": "Pinterest User", "follower_count": 0},
                    "board": {"name": "Pins"},
                    "reaction_counts": {}
                })

        if len(results) == 0:
            return {
                "success": False,
                "status": False,
                "error": f"Pencarian Pinterest tidak membuahkan hasil untuk '{normalized_query}'."
            }

        formatted_results = []
        for r in results:
            formatted_results.append({
                "pin_id": r["id"],
                "title": r["grid_title"],
                "description": r.get("description") or "",
                "image": r["image_url"],
                "url": r["pin"],
                "creator": {
                    "username": r["pinner"]["username"],
                    "name": r["pinner"]["full_name"]
                },
                "id": r["id"],
                "pin": r["pin"],
                "link": r.get("link"),
                "created_at": r.get("created_at"),
                "image_url": r["image_url"],
                "video_url": r.get("video_url"),
                "gif_url": r.get("gif_url"),
                "grid_title": r["grid_title"],
                "pinner": r["pinner"],
                "board": r["board"],
                "reaction_counts": r["reaction_counts"],
                "dominant_color": r.get("dominant_color"),
                "seo_alt_text": r.get("seo_alt_text")
            })

        return {
            "success": True,
            "status": True,
            "query": normalized_query,
            "total": len(formatted_results),
            "results": formatted_results,
            "data": formatted_results
        }

    except Exception as error:
        return {
            "success": False,
            "status": False,
            "error": f"Gagal mencari di Pinterest: {str(error)}"
        }
