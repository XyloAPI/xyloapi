import base64
import requests
import io
import re
import json
import time
import os
from PIL import Image

# Import uguu uploader directly
try:
    from uguu_uploader import upload_uguu
except ImportError:
    import sys
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    from uguu_uploader import upload_uguu

def get_removebg_image(payload):
    image_data = payload.get("image") or payload.get("url") or payload.get("data") or ""
    if not image_data:
        return {"success": False, "error": "Missing required parameter: image or url"}

    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    })

    # 1. Fetch image bytes from URL or Base64
    try:
        is_url = image_data.startswith("http://") or image_data.startswith("https://")
        if is_url:
            r_img = session.get(image_data, timeout=15)
            if r_img.status_code != 200:
                return {"success": False, "error": f"Failed to download image from URL. Status code: {r_img.status_code}"}
            img_bytes = r_img.content
        else:
            if "," in image_data:
                image_data = image_data.split(",")[1]
            img_bytes = base64.b64decode(image_data)
    except Exception as e:
        return {"success": False, "error": f"Failed to retrieve image data: {str(e)}"}

    # 2. Convert to JPEG using Pillow to bypass Removal.AI format checks
    try:
        img = Image.open(io.BytesIO(img_bytes))
        if img.mode != "RGB":
            img = img.convert("RGB")
        out_buf = io.BytesIO()
        img.save(out_buf, format="JPEG", quality=95)
        jpg_bytes = out_buf.getvalue()
    except Exception as e:
        return {"success": False, "error": f"Invalid image format or processing error: {str(e)}"}

    # 3. Retrieve Webtoken from Removal.AI portal
    try:
        r_page = session.get("https://removal.ai/upload/", timeout=15)
        if r_page.status_code != 200:
            return {"success": False, "error": "Failed to fetch Removal.AI upload portal page"}
        
        pattern = r"var ajax_upload_object = (\{.*?\});"
        match = re.search(pattern, r_page.text)
        if not match:
            return {"success": False, "error": "Failed to locate upload configuration token"}
        
        config = json.loads(match.group(1))
        security = config.get("security")
        webtoken_url = config.get("webtoken_url", "https://removal.ai/wp-admin/admin-ajax.php")

        r_token = session.get(webtoken_url, params={
            "action": "ajax_get_webtoken",
            "security": security
        }, timeout=15)
        if r_token.status_code != 200:
            return {"success": False, "error": "Failed to request session webtoken"}

        token_data = r_token.json()
        webtoken = token_data.get("data", {}).get("webtoken")
        if not webtoken:
            return {"success": False, "error": "Webtoken not present in AJAX response"}
    except Exception as e:
        return {"success": False, "error": f"Session initialization failed: {str(e)}"}

    # 4. Perform Background Removal Request
    try:
        headers = {
            "web-token": webtoken,
            "Origin": "https://removal.ai",
            "Referer": "https://removal.ai/",
        }
        files = {
            "image_file": ("image.jpg", jpg_bytes, "image/jpeg"),
        }
        r_remove = session.post("https://api.removal.ai/3.0/remove", headers=headers, files=files, timeout=30)
        
        if r_remove.status_code != 200:
            try:
                err_msg = r_remove.json().get("message", r_remove.text)
            except:
                err_msg = r_remove.text
            return {"success": False, "error": f"Removal.AI API error ({r_remove.status_code}): {err_msg}"}

        res_json = r_remove.json()
        if res_json.get("status") != 200:
            return {"success": False, "error": f"Background removal execution failed: {res_json.get('message', 'Unknown error')}"}

        removal_ai_url = res_json.get("url")
        
        # 5. Re-upload transparent result to Uguu.se
        uguu_transparent_url = None
        if removal_ai_url:
            uguu_res = upload_uguu({"url": removal_ai_url})
            if uguu_res.get("success"):
                uguu_transparent_url = uguu_res.get("data", {}).get("link")

        if not uguu_transparent_url:
            return {"success": False, "error": "Failed to upload transparent image result to CDN"}

        # 6. Re-upload original image to Uguu.se
        uguu_original_url = None
        try:
            original_b64 = "data:image/jpeg;base64," + base64.b64encode(img_bytes).decode('utf-8')
            original_res = upload_uguu({"image": original_b64})
            if original_res.get("success"):
                uguu_original_url = original_res.get("data", {}).get("link")
        except:
            pass

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "url": uguu_transparent_url,
                "original": uguu_original_url or image_data if is_url else None,
                "width": res_json.get("original_width"),
                "height": res_json.get("original_height"),
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Background removal transaction failed: {str(e)}"}
