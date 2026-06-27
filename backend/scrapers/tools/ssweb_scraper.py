import time
import io
import requests

UGUU_URL = "https://uguu.se/upload.php"
UGUU_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def _upload_to_uguu(binary: bytes) -> str:
    filename = f"screenshot_{int(time.time())}.png"
    res = requests.post(
        UGUU_URL,
        files={"files[]": (filename, io.BytesIO(binary), "image/png")},
        headers=UGUU_HEADERS,
        timeout=45,
    )
    res.raise_for_status()
    data = res.json()
    if data.get("success") and data.get("files"):
        return data["files"][0].get("url", "")
    raise Exception("Uguu upload failed")

def get_ssweb(payload):
    """
    Capture a screenshot of a website using web capture engine and upload to Uguu.
    """
    url = payload.get("url") or payload.get("link")
    if not url:
        return {"success": False, "error": "Missing required parameter: url"}
        
    fullpage_val = payload.get("fullpage", False)
    if isinstance(fullpage_val, str):
        fullpage = fullpage_val.lower() == "true"
    else:
        fullpage = bool(fullpage_val)
        
    device = payload.get("device", "desktop").lower()
    if device == "mobile":
        width = 375
        height = 812
    else:
        width = 1920
        height = 1080
        
    microlink_url = "https://api.microlink.io/"
    params = {
        "url": url,
        "screenshot": "true",
        "screenshot.type": "png",
        "screenshot.fullPage": "true" if fullpage else "false",
        "viewport.width": width,
        "viewport.height": height,
        "meta": "false",
        "adblock": "true",
        "force": "false"
    }
    
    try:
        r = requests.get(microlink_url, params=params, timeout=35)
        if r.status_code != 200:
            return {"success": False, "error": f"Web capture engine returned status code {r.status_code}"}
            
        data = r.json()
        if data.get("status") == "success":
            screenshot_data = data.get("data", {}).get("screenshot", {})
            screenshot_url = screenshot_data.get("url")
            if screenshot_url:
                # Fetch image bytes to upload to Uguu
                try:
                    img_res = requests.get(screenshot_url, headers=UGUU_HEADERS, timeout=30)
                    img_res.raise_for_status()
                    final_image_url = _upload_to_uguu(img_res.content)
                except Exception:
                    # Fallback to direct microlink cdn url if uguu fails
                    final_image_url = screenshot_url

                return {
                    "success": True,
                    "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
                    "data": {
                        "image": final_image_url,
                        "width": screenshot_data.get("width"),
                        "height": screenshot_data.get("height"),
                        "size": screenshot_data.get("size_pretty"),
                        "device": device,
                        "fullPage": fullpage
                    }
                }
            
        return {"success": False, "error": "Failed to extract screenshot URL from response"}
    except Exception as e:
        return {"success": False, "error": f"Error calling web capture engine: {str(e)}"}
