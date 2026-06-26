import base64
import requests
import io
import time
import os

def upload_litterbox(payload):
    image_data = payload.get("data") or payload.get("image") or payload.get("url") or ""
    if not image_data:
        return {"success": False, "error": "Missing required parameter: image or url"}

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        is_url = image_data.startswith("http://") or image_data.startswith("https://")
        upload_url = "https://litterbox.catbox.moe/resources/internals/api.php"

        # Download or decode raw bytes
        if is_url:
            img_res = requests.get(image_data, headers=headers, timeout=30)
            if img_res.status_code != 200:
                return {
                    "endpoint_id": "litterbox",
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
        if binary_data.startswith(b"\x89PNG\r\n\x1a\n"):
            mime_type = "image/png"
            filename = filename.replace(".jpg", ".png") if filename.endswith(".jpg") else filename
        elif binary_data.startswith(b"GIF87a") or binary_data.startswith(b"GIF89a"):
            mime_type = "image/gif"
            filename = filename.replace(".jpg", ".gif") if filename.endswith(".jpg") else filename
        elif binary_data.startswith(b"RIFF") and b"WEBP" in binary_data[:12]:
            mime_type = "image/webp"
            filename = filename.replace(".jpg", ".webp") if filename.endswith(".jpg") else filename

        data = {
            "reqtype": "fileupload",
            "time": "24h" # Default expiration: 24h
        }
        files = {
            "fileToUpload": (filename, io.BytesIO(binary_data), mime_type)
        }

        res = requests.post(upload_url, data=data, files=files, headers=headers, timeout=45)
        if res.status_code != 200:
            return {
                "endpoint_id": "litterbox",
                "success": False,
                "error": f"Upload failed with HTTP status code {res.status_code}"
            }

        direct_link = res.text.strip()
        if not direct_link.startswith("http://") and not direct_link.startswith("https://"):
            return {
                "endpoint_id": "litterbox",
                "success": False,
                "error": f"Litterbox API error: {direct_link}"
            }

        return {
            "endpoint_id": "litterbox",
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "link": direct_link,
                "view_url": direct_link,
                "delete_url": None,
                "type": mime_type,
                "size": len(binary_data)
            }
        }

    except Exception as e:
        return {
            "endpoint_id": "litterbox",
            "success": False,
            "error": f"Error executing Litterbox process: {str(e)}"
        }
