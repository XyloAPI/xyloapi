import base64
import requests
import io
import time
import os

def upload_gofile(payload):
    image_data = payload.get("data") or payload.get("image") or payload.get("url") or ""
    if not image_data:
        return {"success": False, "error": "Missing required parameter: image/file or url"}

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    }

    try:
        is_url = image_data.startswith("http://") or image_data.startswith("https://")

        # Download or decode raw bytes
        if is_url:
            img_res = requests.get(image_data, headers=headers, timeout=30)
            if img_res.status_code != 200:
                return {
                    "endpoint_id": "gofile",
                    "success": False,
                    "error": f"Failed to fetch remote file from URL (HTTP {img_res.status_code})"
                }
            binary_data = img_res.content
            filename = os.path.basename(image_data.split('?')[0]) or "file.bin"
        else:
            if "," in image_data:
                image_data = image_data.split(",")[1]
            binary_data = base64.b64decode(image_data)
            filename = "file.bin"

        # Determine MIME type and extension based on binary signature
        mime_type = "application/octet-stream"
        ext = ".bin"
        if binary_data.startswith(b"\x89PNG\r\n\x1a\n"):
            mime_type = "image/png"
            ext = ".png"
        elif binary_data.startswith(b"\xff\xd8\xff"):
            mime_type = "image/jpeg"
            ext = ".jpg"
        elif binary_data.startswith(b"GIF87a") or binary_data.startswith(b"GIF89a"):
            mime_type = "image/gif"
            ext = ".gif"
        elif binary_data.startswith(b"RIFF") and b"WEBP" in binary_data[:12]:
            mime_type = "image/webp"
            ext = ".webp"
        elif binary_data.startswith(b"\x1a\x45\xdf\xa3"):
            mime_type = "video/webm"
            ext = ".webm"
        elif binary_data.startswith(b"\x00\x00\x00\x18ftyp") or binary_data.startswith(b"\x00\x00\x00\x20ftyp"):
            mime_type = "video/mp4"
            ext = ".mp4"
        elif binary_data.startswith(b"PK\x03\x04"):
            mime_type = "application/zip"
            ext = ".zip"

        # Ensure filename has correct extension
        base, _ = os.path.splitext(filename)
        filename = base + ext

        # Prepare multipart form upload
        upload_url = "https://upload.gofile.io/uploadfile"
        files = {
            "file": (filename, binary_data, mime_type)
        }

        # Perform POST to GoFile upload endpoint
        res = requests.post(upload_url, files=files, headers={"User-Agent": headers["User-Agent"]}, timeout=45)

        if res.status_code != 200:
            return {
                "endpoint_id": "gofile",
                "success": False,
                "error": f"Failed to upload to GoFile server (HTTP {res.status_code})"
            }

        try:
            res_json = res.json()
        except Exception:
            return {
                "endpoint_id": "gofile",
                "success": False,
                "error": f"Failed to parse GoFile JSON response: {res.text[:300]}"
            }

        if res_json.get("status") != "ok":
            return {
                "endpoint_id": "gofile",
                "success": False,
                "error": f"GoFile upload returned status: {res_json.get('status')}"
            }

        data = res_json.get("data", {})
        download_page = data.get("downloadPage")

        if not download_page:
            return {
                "endpoint_id": "gofile",
                "success": False,
                "error": "GoFile response missing downloadPage URL"
            }

        return {
            "endpoint_id": "gofile",
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "link": download_page,
                "view_url": download_page,
                "delete_url": None,
                "type": mime_type,
                "size": len(binary_data)
            }
        }

    except Exception as e:
        return {
            "endpoint_id": "gofile",
            "success": False,
            "error": f"Error executing GoFile upload process: {str(e)}"
        }
