import base64
import requests
import re
import io
import time

def upload_freeimage(payload):
    image_data = payload.get("data") or payload.get("image") or payload.get("url") or ""
    if not image_data:
        return {"success": False, "error": "Missing required parameter: image or url"}

    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    })

    try:
        # 1. Fetch homepage to retrieve cookies and auth_token
        home_res = session.get("https://freeimage.host/", timeout=20)
        if home_res.status_code != 200:
            return {
                "endpoint_id": "freeimage",
                "success": False,
                "error": f"Failed to access freeimage.host homepage (HTTP {home_res.status_code})"
            }

        token_match = re.search(r'auth_token\s*=\s*"([a-f0-9]+)"', home_res.text)
        if not token_match:
            return {
                "endpoint_id": "freeimage",
                "success": False,
                "error": "Failed to scrape auth_token from freeimage.host homepage"
            }
        auth_token = token_match.group(1)

        upload_url = "https://freeimage.host/json"
        headers = {
            "Referer": "https://freeimage.host/",
            "X-Requested-With": "XMLHttpRequest"
        }

        is_url = image_data.startswith("http://") or image_data.startswith("https://")

        if is_url:
            # URL upload mode
            data = {
                "action": "upload",
                "auth_token": auth_token,
                "source": image_data,
                "type": "url"
            }
            res = session.post(upload_url, data=data, headers=headers, timeout=30)
        else:
            # File upload mode
            if "," in image_data:
                image_data = image_data.split(",")[1]
            binary_data = base64.b64decode(image_data)

            data = {
                "action": "upload",
                "auth_token": auth_token,
                "type": "file"
            }
            files = {
                "source": ("image.jpg", io.BytesIO(binary_data), "image/jpeg")
            }
            res = session.post(upload_url, data=data, files=files, headers=headers, timeout=30)

        if res.status_code != 200:
            return {
                "endpoint_id": "freeimage",
                "success": False,
                "error": f"Upload failed with HTTP status code {res.status_code}"
            }

        response_json = res.json()
        status_code = response_json.get("status_code")
        if status_code != 200 or "image" not in response_json:
            err_msg = response_json.get("error", {}).get("message", "Unknown API error")
            return {
                "endpoint_id": "freeimage",
                "success": False,
                "error": f"freeimage.host API error: {err_msg}"
            }

        image_info = response_json["image"]
        direct_link = image_info.get("url")
        view_url = image_info.get("url_viewer") or image_info.get("url_seo")
        
        # Additional metadata
        mime_type = image_info.get("image", {}).get("mime", "image/jpeg")
        size_bytes = image_info.get("image", {}).get("size", len(binary_data) if not is_url else 0)

        return {
            "endpoint_id": "freeimage",
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "link": direct_link,
                "view_url": view_url,
                "delete_url": None,  # Not provided in guest mode
                "type": mime_type,
                "size": size_bytes
            }
        }

    except Exception as e:
        return {
            "endpoint_id": "freeimage",
            "success": False,
            "error": f"Error executing freeimage process: {str(e)}"
        }
