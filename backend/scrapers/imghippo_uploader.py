import base64
import requests
import io
import time
import os

def upload_imghippo(payload):
    image_data = payload.get("data") or payload.get("image") or payload.get("url") or ""
    if not image_data:
        return {"success": False, "error": "Missing required parameter: image or url"}

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://www.imghippo.com/"
    }

    try:
        is_url = image_data.startswith("http://") or image_data.startswith("https://")

        # Get binary bytes
        if is_url:
            # Fetch remote image first
            img_res = requests.get(image_data, headers=headers, timeout=30)
            if img_res.status_code != 200:
                return {
                    "endpoint_id": "imghippo",
                    "success": False,
                    "error": f"Failed to fetch remote image from URL (HTTP {img_res.status_code})"
                }
            binary_data = img_res.content
            # Detect filename and extension from URL if possible
            filename = os.path.basename(image_data.split('?')[0]) or "image.jpg"
        else:
            if "," in image_data:
                image_data = image_data.split(",")[1]
            binary_data = base64.b64decode(image_data)
            filename = "image.jpg"

        upload_url = "https://api.imghippo.com/file"

        # Determine MIME type based on binary header or generic
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

        files = {
            "image": (filename, io.BytesIO(binary_data), mime_type)
        }

        res = requests.post(upload_url, files=files, headers=headers, timeout=40)
        if res.status_code != 200:
            return {
                "endpoint_id": "imghippo",
                "success": False,
                "error": f"Upload failed with HTTP status code {res.status_code}"
            }

        response_json = res.json()
        if not response_json.get("success") or "data" not in response_json:
            err_msg = response_json.get("message") or "Unknown API error"
            return {
                "endpoint_id": "imghippo",
                "success": False,
                "error": f"ImgHippo API error: {err_msg}"
            }

        data_info = response_json["data"]
        direct_link = data_info.get("url")
        image_id = data_info.get("image_id")
        
        # Format the viewer url. ImgHippo viewer format: https://www.imghippo.com/i/[image_id]
        view_url = f"https://www.imghippo.com/i/{image_id}" if image_id else direct_link
        size_bytes = data_info.get("size", len(binary_data))
        extension = data_info.get("extension", "jpg")

        # Map extension to mime
        ext_to_mime = {
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "png": "image/png",
            "gif": "image/gif",
            "webp": "image/webp",
            "bmp": "image/bmp"
        }
        final_mime = ext_to_mime.get(extension.lower(), mime_type)

        return {
            "endpoint_id": "imghippo",
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "link": direct_link,
                "view_url": view_url,
                "delete_url": None,
                "type": final_mime,
                "size": size_bytes
            }
        }

    except Exception as e:
        return {
            "endpoint_id": "imghippo",
            "success": False,
            "error": f"Error executing ImgHippo process: {str(e)}"
        }
