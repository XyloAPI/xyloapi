import base64
import requests
import io
import time
import os
from bs4 import BeautifulSoup

def get_decoded_qr(payload):
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

    # 2. Upload and decode via zxing.org
    try:
        files = {
            "f": ("qr.png", img_bytes, "image/png")
        }
        r = session.post("https://zxing.org/w/decode", files=files, timeout=20)
        
        if r.status_code != 200 or "Decode Failed" in r.text or "No barcode was found" in r.text:
            return {"success": False, "error": "No valid barcode or QR code found in the image."}

        # Parse result table
        html = r.text
        soup = BeautifulSoup(html, "html.parser")
        table = soup.find("table", id="result")
        if not table:
            return {"success": False, "error": "Failed to parse decode results from ZXing response."}

        parsed_data = {}
        for tr in table.find_all("tr"):
            tds = tr.find_all("td")
            if len(tds) == 2:
                key = tds[0].text.strip().lower().replace(" ", "_")
                pre = tds[1].find("pre")
                val = pre.text if pre else tds[1].text
                parsed_data[key] = val.strip()

        raw_text = parsed_data.get("parsed_result") or parsed_data.get("raw_text") or ""

        if not raw_text:
            return {"success": False, "error": "No text content could be decoded from this barcode."}

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "text": raw_text
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Failed to decode barcode: {str(e)}"}
