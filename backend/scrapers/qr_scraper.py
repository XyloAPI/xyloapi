import base64
import requests
import io
import time
import os

try:
    from uguu_uploader import upload_uguu
except ImportError:
    import sys
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    from uguu_uploader import upload_uguu

def hex_to_rgb_dash(hex_str):
    hex_str = hex_str.lstrip('#')
    if len(hex_str) == 3:
        hex_str = "".join(c*2 for c in hex_str)
    try:
        r = int(hex_str[0:2], 16)
        g = int(hex_str[2:4], 16)
        b = int(hex_str[4:6], 16)
        return f"{r}-{g}-{b}"
    except:
        return "0-0-0"

def get_qr_code(payload):
    data = payload.get("data") or payload.get("text") or payload.get("content") or "Example"
    size = payload.get("size") or "500x500"
    ecc = payload.get("ecc") or "L"
    margin = payload.get("margin") or "1"
    color = payload.get("color") or "#000000"

    # Hex to RGB conversion for QR Server API format (R-G-B)
    if color.startswith("#") or len(color) in (3, 6):
        color = hex_to_rgb_dash(color)

    url = f"https://api.qrserver.com/v1/create-qr-code/?size={size}&data={requests.utils.quote(data)}&ecc={ecc}&margin={margin}&color={color}"

    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    })

    try:
        r = session.get(url, timeout=20)
        if r.status_code != 200:
            return {"success": False, "error": f"Failed to generate QR code. Status: {r.status_code}"}
        qr_bytes = r.content
    except Exception as e:
        return {"success": False, "error": f"QR Code generator request failed: {str(e)}"}

    uguu_url = None
    try:
        b64_str = "data:image/png;base64," + base64.b64encode(qr_bytes).decode('utf-8')
        uguu_res = upload_uguu({"image": b64_str})
        if uguu_res.get("success"):
            uguu_url = uguu_res.get("data", {}).get("link")
    except:
        pass

    if not uguu_url:
        return {"success": False, "error": "Failed to upload generated QR code to CDN"}

    return {
        "success": True,
        "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "data": {
            "url": uguu_url,
            "content": data,
            "size": size
        }
    }
