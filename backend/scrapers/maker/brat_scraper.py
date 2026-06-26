import os
import io
import time
import base64
import requests

UGUU_URL = "https://uguu.se/upload.php"
UGUU_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def _upload_to_uguu(binary: bytes) -> str:
    filename = f"brat_{int(time.time())}.png"
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

def generate_brat(payload):
    try:
        text = payload.get("text") or payload.get("prompt") or ""
        if isinstance(text, list):
            text = text[0] if text else ""
        if not text:
            return {"success": False, "error": "Missing required parameter: text"}

        # Call HF space
        url = f"https://aqul-brat.hf.space/?text={requests.utils.quote(text)}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        res = requests.get(url, headers=headers, timeout=60)
        if res.status_code != 200:
            return {"success": False, "error": f"Brat generator returned status {res.status_code}"}
        
        # Upload image to uguu.se
        try:
            image_url = _upload_to_uguu(res.content)
        except Exception:
            # Fallback to base64
            b64 = base64.b64encode(res.content).decode("utf-8")
            image_url = f"data:image/png;base64,{b64}"

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "image": image_url,
                "text": text
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Failed to run Brat generator: {str(e)}"}
