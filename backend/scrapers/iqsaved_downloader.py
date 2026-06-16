import requests
import urllib.parse
import time
import json

def download_iqsaved(payload):
    url = payload.get("url") or payload.get("URLT") or payload.get("image")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }

    # Normalize url if it's an iqsaved URL or keep it as Instagram URL
    instagram_url = url
    if "iqsaved.com" in url:
        parsed = urllib.parse.urlparse(url)
        segments = [s for s in parsed.path.split('/') if s]
        if segments:
            shortcode = segments[-1]
            instagram_url = f"https://www.instagram.com/p/{shortcode}/"

    # Set referer
    referer_url = url
    if "instagram.com" in instagram_url:
        parsed = urllib.parse.urlparse(instagram_url)
        path_parts = [p for p in parsed.path.split('/') if p]
        shortcode = ""
        for i, part in enumerate(path_parts):
            if part in ["p", "reel", "tv", "stories"]:
                if i + 1 < len(path_parts):
                    shortcode = path_parts[i+1]
                    break
        if not shortcode and path_parts:
            shortcode = path_parts[-1]
        
        if shortcode:
            referer_url = f"https://iqsaved.com/id/download-posts/{shortcode}/"
        else:
            referer_url = "https://iqsaved.com/id/download-posts/"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Origin": "https://iqsaved.com",
        "Referer": referer_url
    }

    try:
        session = requests.Session()
        session.headers.update(headers)

        # 1. Load referer page to get PHPSESSID cookie
        session.get(referer_url, timeout=15)

        # 2. Fetch token
        token_res = session.get("https://iqsaved.com/connect/", timeout=15)
        if token_res.status_code != 200:
            return {
                "success": False,
                "error": "Failed to retrieve connection token from iqsaved."
            }
        token = token_res.json().get("token")
        if not token:
            return {
                "success": False,
                "error": "Failed to parse token from response."
            }

        # 3. Socket.IO Handshake
        t_ms = int(time.time() * 1000)
        hs_res = session.get(f"https://iqsaved.com/socket.io/?EIO=4&transport=polling&t={t_ms}", timeout=15)
        if hs_res.status_code != 200:
            return {
                "success": False,
                "error": "Socket handshake failed."
            }
        hs_text = hs_res.text
        start_idx = hs_text.find("{")
        if start_idx == -1:
            return {
                "success": False,
                "error": "Invalid handshake response structure."
            }
        hs_json = json.loads(hs_text[start_idx:])
        sid = hs_json.get("sid")
        if not sid:
            return {
                "success": False,
                "error": "Failed to retrieve session ID from handshake."
            }

        # 4. Connect to default namespace
        t_ms = int(time.time() * 1000)
        session.post(f"https://iqsaved.com/socket.io/?EIO=4&transport=polling&sid={sid}&t={t_ms}", data="40", timeout=15)

        # 5. Emit search event
        payload_data = {
            "date": int(time.time() * 1000),
            "token": token,
            "requestType": "2",
            "linkValue": instagram_url
        }
        packet = f'42["search",{json.dumps(payload_data)}]'
        t_ms = int(time.time() * 1000)
        session.post(f"https://iqsaved.com/socket.io/?EIO=4&transport=polling&sid={sid}&t={t_ms}", data=packet, timeout=15)

        # 6. Poll for results
        result_data = None
        for i in range(10):
            t_ms = int(time.time() * 1000)
            poll_res = session.get(f"https://iqsaved.com/socket.io/?EIO=4&transport=polling&sid={sid}&t={t_ms}", timeout=15)
            poll_text = poll_res.text
            if "searchResult" in poll_text:
                packets = poll_text.split('\x1e')
                for p in packets:
                    if "searchResult" in p:
                        arr = json.loads(p[2:])
                        result_data = arr[1].get("data", {}).get("data")
                        break
                if result_data:
                    break
            time.sleep(1)

        if not result_data:
            return {
                "success": False,
                "error": "Video is private or unavailable."
            }

        # Format into our standard response structure
        items = result_data.get("items") or []
        if not items:
            return {
                "success": False,
                "error": "No media items found in the result."
            }

        first_item = items[0]
        cover_src = first_item.get("imageSrc") or result_data.get("avatarSrc") or ""
        if cover_src and not cover_src.startswith("http"):
            cover_src = f"https://cdn.iqsaved.com/img.php?url={urllib.parse.quote(cover_src)}"

        links = []
        for item in items:
            download_links = item.get("downloadLink") or []
            item_type = item.get("type") or "media"
            for dl in download_links:
                val = dl.get("value")
                fn = dl.get("filename") or ""
                if val:
                    dl_url = f"https://cdn.iqsaved.com/img.php?url={urllib.parse.quote(val)}&filename={urllib.parse.quote(fn)}"
                    label = f"DOWNLOAD {item_type.upper()}"
                    if not any(link["url"] == dl_url for link in links):
                        links.append({
                            "label": label,
                            "url": dl_url
                        })

        if not links:
            return {
                "success": False,
                "error": "No download links parsed."
            }

        return {
            "success": True,
            "data": {
                "title": "Instagram Media Download",
                "creator": result_data.get("username") or "Instagram User",
                "description": result_data.get("text") or "Instagram video or image.",
                "cover": cover_src,
                "links": links
            }
        }

    except Exception as e:
        # Avoid leaking provider details in error
        err_msg = str(e)
        if "iqsaved" in err_msg.lower():
            err_msg = "Encountered parser error."
        return {
            "success": False,
            "error": f"Failed to download media: {err_msg}"
        }
