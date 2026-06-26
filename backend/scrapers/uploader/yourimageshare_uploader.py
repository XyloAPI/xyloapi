import base64
import requests
import io
import time
import os
import re
import random
import string

def random_string(length=13):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

def upload_yourimageshare(payload):
    image_data = payload.get("data") or payload.get("image") or payload.get("url") or ""
    if not image_data:
        return {"success": False, "error": "Missing required parameter: image or url"}

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
    }

    try:
        is_url = image_data.startswith("http://") or image_data.startswith("https://")

        # Download or decode raw bytes
        if is_url:
            img_res = requests.get(image_data, headers=headers, timeout=30)
            if img_res.status_code != 200:
                return {
                    "endpoint_id": "yourimageshare",
                    "success": False,
                    "error": f"Failed to fetch remote image from URL (HTTP {img_res.status_code})"
                }
            binary_data = img_res.content
            filename = os.path.basename(image_data.split('?')[0]) or "image.jpg"
        else:
            if "," in image_data:
                image_data = image_data.split(",")[1]
            binary_data = base64.b64decode(image_data)
            filename = "image.jpg"

        # Determine MIME type based on binary signature
        mime_type = "image/jpeg"
        ext = ".jpg"
        if binary_data.startswith(b"\x89PNG\r\n\x1a\n"):
            mime_type = "image/png"
            ext = ".png"
        elif binary_data.startswith(b"GIF87a") or binary_data.startswith(b"GIF89a"):
            mime_type = "image/gif"
            ext = ".gif"
        elif binary_data.startswith(b"RIFF") and b"WEBP" in binary_data[:12]:
            mime_type = "image/webp"
            ext = ".webp"

        # Ensure filename has correct extension
        base, _ = os.path.splitext(filename)
        filename = base + ext

        # Initialize session
        session = requests.Session()
        session.headers.update(headers)

        # 1. Get homepage to extract CSRF token and set session cookies
        home_res = session.get("https://yourimageshare.com/", timeout=20)
        if home_res.status_code != 200:
            return {
                "endpoint_id": "yourimageshare",
                "success": False,
                "error": f"Failed to fetch YourImageShare homepage (HTTP {home_res.status_code})"
            }

        csrf_match = re.search(r'meta name="csrf-token" content="([^"]+)"', home_res.text)
        if not csrf_match:
            return {
                "endpoint_id": "yourimageshare",
                "success": False,
                "error": "Failed to extract CSRF token from YourImageShare homepage"
            }
        csrf_token = csrf_match.group(1)

        # 2. Setup fingerprint / cookies
        vfp_val = random_string()
        o_key_val = random_string()
        session.cookies.set("vfp", vfp_val, domain="yourimageshare.com", path="/")
        session.cookies.set("o_key", o_key_val, domain="yourimageshare.com", path="/")

        # 3. Perform upload
        files = {
            "uploads": (filename, io.BytesIO(binary_data), mime_type)
        }
        data = {
            "vfp": vfp_val
        }
        upload_headers = {
            "X-CSRF-TOKEN": csrf_token,
            "Referer": "https://yourimageshare.com/",
            "Origin": "https://yourimageshare.com",
            "X-Requested-With": "XMLHttpRequest",
            "Accept": "application/json, text/javascript, */*; q=0.01"
        }

        res = session.post("https://yourimageshare.com/upload", headers=upload_headers, files=files, data=data, timeout=45)
        if res.status_code != 200:
            return {
                "endpoint_id": "yourimageshare",
                "success": False,
                "error": f"Upload request failed with status code {res.status_code}"
            }

        try:
            res_json = res.json()
        except Exception as e:
            return {
                "endpoint_id": "yourimageshare",
                "success": False,
                "error": f"Failed to parse YourImageShare JSON response: {res.text[:500]}"
            }

        if res_json.get("type") != "success" or "data" not in res_json:
            errors_detail = res_json.get("errors") or res_json.get("msg") or "Unknown upload error"
            return {
                "endpoint_id": "yourimageshare",
                "success": False,
                "error": f"YourImageShare upload failed: {errors_detail}"
            }

        res_data = res_json["data"]
        direct_link = res_data.get("path") or res_data.get("src")
        view_url = res_data.get("direct")

        return {
            "endpoint_id": "yourimageshare",
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "link": direct_link,
                "view_url": view_url,
                "delete_url": None,
                "type": mime_type,
                "size": len(binary_data)
            }
        }

    except Exception as e:
        return {
            "endpoint_id": "yourimageshare",
            "success": False,
            "error": f"Error executing YourImageShare process: {str(e)}"
        }
