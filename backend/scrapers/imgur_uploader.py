import os
import requests
import time

def upload_imgur(payload):
    image_data = payload.get("data") or payload.get("image") or payload.get("url") or ""
    title = payload.get("title", "XyloAPI Upload")
    if not image_data:
        return {"success": False, "error": "Missing required parameter: image or url"}
        
    is_url = image_data.startswith("http://") or image_data.startswith("https://")
    if not is_url and "," in image_data:
        image_data = image_data.split(",")[1]
        
    client_id = os.environ.get("IMGUR_CLIENT_ID")
    if not client_id:
        return {"success": False, "error": "Missing IMGUR_CLIENT_ID environment variable"}

    try:
        url = "https://api.imgur.com/3/image"
        headers = {
            "Authorization": f"Client-ID {client_id}"
        }
        data = {
            "image": image_data,
            "type": "url" if is_url else "base64",
            "title": title
        }
        res = requests.post(url, headers=headers, data=data, timeout=30)
        if res.status_code == 200:
            response_json = res.json()
            if response_json.get("success"):
                img_data = response_json.get("data", {})
                return {
                    "endpoint_id": "imgur",
                    "success": True,
                    "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
                    "data": {
                        "link": img_data.get("link"),
                        "deletehash": img_data.get("deletehash"),
                        "size": img_data.get("size"),
                        "width": img_data.get("width"),
                        "height": img_data.get("height"),
                        "type": img_data.get("type"),
                        "datetime": img_data.get("datetime")
                    }
                }
        return {
            "endpoint_id": "imgur",
            "success": False,
            "error": f"Imgur upload failed (HTTP {res.status_code})",
            "details": res.json() if res.headers.get("Content-Type", "").startswith("application/json") else res.text[:500]
        }
    except Exception as e:
        return {"success": False, "error": f"Failed to execute Imgur upload: {str(e)}"}
