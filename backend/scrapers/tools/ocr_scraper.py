import time
import io
import base64
import requests

def parse_ocr(payload):
    """
    Perform optical character recognition (OCR) on an image using ocr.space API.
    Supports image URL or base64 image data.
    """
    image_data = payload.get("image") or payload.get("url") or payload.get("data")
    if not image_data:
        return {"success": False, "error": "Missing required parameter: image or url"}
        
    language = payload.get("language") or "eng"

    # Resolve image bytes
    try:
        if image_data.startswith("http://") or image_data.startswith("https://"):
            r = requests.get(
                image_data,
                headers={"User-Agent": "Mozilla/5.0"},
                timeout=20
            )
            r.raise_for_status()
            img_bytes = r.content
        else:
            # Handle base64
            b64 = image_data.split(",")[1] if "," in image_data else image_data
            img_bytes = base64.b64decode(b64)
    except Exception as e:
        return {"success": False, "error": f"Failed to retrieve image: {str(e)}"}

    if not img_bytes or len(img_bytes) < 100:
        return {"success": False, "error": "Image data is empty or too small"}

    # Build multipart request
    url = "https://api.ocr.space/parse/image"
    headers = {
        "apikey": "OCRonFrontpageOnly_26",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
        "Origin": "https://ocr.space",
        "Referer": "https://ocr.space/"
    }

    files = {
        "file": ("image.png", io.BytesIO(img_bytes), "image/png")
    }

    data = {
        "language": language,
        "isOverlayRequired": "true",
        "FileType": "Auto",
        "IsCreateSearchablePDF": "false",
        "isSearchablePdfHideTextLayer": "true",
        "detectOrientation": "false",
        "isTable": "false",
        "scale": "true",
        "OCREngine": "1"
    }

    try:
        r = requests.post(url, files=files, data=data, headers=headers, timeout=30)
        if r.status_code != 200:
            return {"success": False, "error": f"OCR service returned status code {r.status_code}"}
            
        res_json = r.json()
        if res_json.get("IsErroredOnProcessing") or res_json.get("OCRExitCode") != 1:
            err_msg = res_json.get("ErrorMessage") or "Unknown OCR processing error"
            return {"success": False, "error": f"OCR processing failed: {err_msg}"}
            
        parsed_results = res_json.get("ParsedResults")
        if not parsed_results:
            return {"success": False, "error": "No text results found in image"}
            
        parsed_text = parsed_results[0].get("ParsedText") or ""
        
        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "text": parsed_text.strip(),
                "lines": [line.strip() for line in parsed_text.splitlines() if line.strip()]
            }
        }
        
    except Exception as e:
        return {"success": False, "error": f"OCR request failed: {str(e)}"}
