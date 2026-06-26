import base64
import requests
import io
import time
import os

def upload_catbox(payload):
    image_data = payload.get("data") or payload.get("image") or payload.get("url") or ""
    if not image_data:
        return {"success": False, "error": "Missing required parameter: image or url"}

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        is_url = image_data.startswith("http://") or image_data.startswith("https://")
        upload_url = "https://catbox.moe/user/api.php"

        if is_url:
            # 1. URL upload mode
            # We can request head first to find type and size
            size_bytes = 0
            mime_type = "image/jpeg"
            try:
                head = requests.head(image_data, headers=headers, timeout=10)
                if head.status_code == 200:
                    size_bytes = int(head.headers.get("Content-Length", 0))
                    mime_type = head.headers.get("Content-Type", "image/jpeg")
            except:
                pass

            data = {
                "reqtype": "urlupload",
                "url": image_data
            }
            res = requests.post(upload_url, data=data, headers=headers, timeout=45)
        else:
            # 2. File upload mode
            if "," in image_data:
                image_data = image_data.split(",")[1]
            binary_data = base64.b64decode(image_data)
            size_bytes = len(binary_data)

            # Determine MIME type based on binary signature
            mime_type = "image/jpeg"
            filename = "image.jpg"
            if binary_data.startswith(b"\x89PNG\r\n\x1a\n"):
                mime_type = "image/png"
                filename = "image.png"
            elif binary_data.startswith(b"GIF87a") or binary_data.startswith(b"GIF89a"):
                mime_type = "image/gif"
                filename = "image.gif"
            elif binary_data.startswith(b"RIFF") and b"WEBP" in binary_data[:12]:
                mime_type = "image/webp"
                filename = "image.webp"

            data = {
                "reqtype": "fileupload"
            }
            files = {
                "fileToUpload": (filename, io.BytesIO(binary_data), mime_type)
            }
            res = requests.post(upload_url, data=data, files=files, headers=headers, timeout=45)

        if res.status_code != 200:
            return {
                "endpoint_id": "catbox",
                "success": False,
                "error": f"Upload failed with HTTP status code {res.status_code}"
            }

        direct_link = res.text.strip()
        if not direct_link.startswith("http://") and not direct_link.startswith("https://"):
            return {
                "endpoint_id": "catbox",
                "success": False,
                "error": f"Catbox API error: {direct_link}"
            }

        # If we uploaded via URL, try to guess the MIME type from direct_link extension
        if is_url:
            ext = direct_link.split('.')[-1].lower() if '.' in direct_link else ''
            ext_to_mime = {
                "jpg": "image/jpeg",
                "jpeg": "image/jpeg",
                "png": "image/png",
                "gif": "image/gif",
                "webp": "image/webp"
            }
            if ext in ext_to_mime:
                mime_type = ext_to_mime[ext]

        return {
            "endpoint_id": "catbox",
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "link": direct_link,
                "view_url": direct_link,
                "delete_url": None,
                "type": mime_type,
                "size": size_bytes
            }
        }

    except Exception as e:
        return {
            "endpoint_id": "catbox",
            "success": False,
            "error": f"Error executing Catbox process: {str(e)}"
        }
