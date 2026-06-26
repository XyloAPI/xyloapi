import os
import requests
import time

def upload_imgbb(payload):
    image_data = payload.get("data") or payload.get("image") or payload.get("url") or ""
    if not image_data:
        return {"success": False, "error": "Missing required parameter: image or url"}
        
    is_url = image_data.startswith("http://") or image_data.startswith("https://")
    if not is_url and "," in image_data:
        image_data = image_data.split(",")[1]
        
    api_key = os.environ.get("IMGBB_API_KEY")
    if not api_key:
        return {"success": False, "error": "Missing IMGBB_API_KEY environment variable"}

    try:
        url = f"https://api.imgbb.com/1/upload?key={api_key}"
        data = {
            "image": image_data
        }
        res = requests.post(url, data=data, timeout=30)
        
        if res.status_code == 200:
            response_json = res.json()
            if response_json.get("success"):
                img_data = response_json.get("data", {})
                return {
                    "endpoint_id": "imgbb",
                    "success": True,
                    "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
                    "data": {
                        "link": img_data.get("url"),
                        "view_url": img_data.get("url_viewer"),
                        "delete_url": img_data.get("delete_url"),
                        "size": img_data.get("size"),
                        "width": img_data.get("width"),
                        "height": img_data.get("height"),
                        "type": img_data.get("image", {}).get("mime") or "image/png"
                    }
                }
                
        return {
            "endpoint_id": "imgbb",
            "success": False,
            "error": f"ImgBB upload failed (HTTP {res.status_code})",
            "details": res.json() if res.headers.get("Content-Type", "").startswith("application/json") else res.text[:500]
        }
    except Exception as e:
        return {"success": False, "error": f"Failed to execute ImgBB upload: {str(e)}"}
