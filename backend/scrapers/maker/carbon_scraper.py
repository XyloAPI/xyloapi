# -*- coding: utf-8 -*-
import io
import time
import requests

UGUU_URL = "https://uguu.se/upload.php"

def _upload_to_uguu(binary: bytes) -> str:
    filename = f"carbon_{int(time.time())}.png"
    res = requests.post(
        UGUU_URL,
        files={"files[]": (filename, io.BytesIO(binary), "image/png")},
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        timeout=45,
    )
    res.raise_for_status()
    data = res.json()
    if data.get("success") and data.get("files"):
        return data["files"][0].get("url", "")
    raise Exception("Uguu upload failed")

def _parse_bool(val, default=True):
    if val is None:
        return default
    if isinstance(val, bool):
        return val
    s = str(val).strip().lower()
    if s in ("true", "1", "yes", "on"):
        return True
    if s in ("false", "0", "no", "off"):
        return False
    return default

def _parse_int(val, default=1):
    if val is None:
        return default
    try:
        return int(val)
    except (ValueError, TypeError):
        return default

def generate_carbon(payload):
    try:
        code = str(payload.get("code") or 'print("Hello from XyloAPI!")')
        background_color = str(payload.get("backgroundColor") or "rgba(171, 184, 195, 1)")
        theme = str(payload.get("theme") or "monokai")
        language = str(payload.get("language") or "auto")
        
        # Additional customization parameters
        drop_shadow = _parse_bool(payload.get("dropShadow"), True)
        drop_shadow_blur = str(payload.get("dropShadowBlurRadius") or "68px")
        drop_shadow_offset_y = str(payload.get("dropShadowOffsetY") or "20px")
        export_size = str(payload.get("exportSize") or "2x")
        font_family = str(payload.get("fontFamily") or "Hack")
        font_size = str(payload.get("fontSize") or "14px")
        line_numbers = _parse_bool(payload.get("lineNumbers"), True)
        first_line_number = _parse_int(payload.get("firstLineNumber"), 1)
        padding_horizontal = str(payload.get("paddingHorizontal") or "56px")
        padding_vertical = str(payload.get("paddingVertical") or "56px")
        squared_image = _parse_bool(payload.get("squaredImage"), False)
        watermark = _parse_bool(payload.get("watermark"), False)
        width_adjustment = _parse_bool(payload.get("widthAdjustment"), True)
        window_controls = _parse_bool(payload.get("windowControls"), True)
        window_theme = str(payload.get("windowTheme") or "none")

        carbonara_payload = {
            "code": code,
            "backgroundColor": background_color,
            "theme": theme,
            "language": language,
            "dropShadow": drop_shadow,
            "dropShadowBlurRadius": drop_shadow_blur,
            "dropShadowOffsetY": drop_shadow_offset_y,
            "exportSize": export_size,
            "fontFamily": font_family,
            "fontSize": font_size,
            "lineNumbers": line_numbers,
            "firstLineNumber": first_line_number,
            "paddingHorizontal": padding_horizontal,
            "paddingVertical": padding_vertical,
            "squaredImage": squared_image,
            "watermark": watermark,
            "widthAdjustment": width_adjustment,
            "windowControls": window_controls,
            "windowTheme": window_theme
        }

        # Request to Carbonara API
        res = requests.post(
            "https://carbonara.solopov.dev/api/cook",
            json=carbonara_payload,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            timeout=30
        )
        res.raise_for_status()
        image_bytes = res.content

        try:
            image_url = _upload_to_uguu(image_bytes)
        except Exception:
            import base64
            b64 = base64.b64encode(image_bytes).decode("utf-8")
            image_url = f"data:image/png;base64,{b64}"

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "image": image_url,
                "theme": theme,
                "language": language,
                "backgroundColor": background_color
            }
        }

    except Exception as e:
        return {"success": False, "error": f"Failed to generate Carbon image: {str(e)}"}
