import time
import requests

def translate_text(payload):
    """
    Translate text using the free Google Translate API.
    Supports auto-detection of source language.
    """
    text = payload.get("text") or payload.get("q")
    if not text:
        return {"success": False, "error": "Missing required parameter: text"}

    to_lang = payload.get("to") or payload.get("tl") or "id"
    from_lang = payload.get("from") or payload.get("sl") or "auto"

    url = "https://translate.googleapis.com/translate_a/single"
    params = {
        "client": "gtx",
        "sl": from_lang,
        "tl": to_lang,
        "dt": "t",
        "q": text
    }
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        r = requests.get(url, params=params, headers=headers, timeout=15)
        if r.status_code != 200:
            return {"success": False, "error": f"Google Translate returned status code {r.status_code}"}

        res_json = r.json()
        if not res_json or not isinstance(res_json, list) or len(res_json) < 1:
            return {"success": False, "error": "Empty or invalid response from translation service"}

        sentences = res_json[0]
        if not isinstance(sentences, list):
            return {"success": False, "error": "Invalid sentences structure in response"}

        translated_parts = []
        for s in sentences:
            if isinstance(s, list) and len(s) > 0 and s[0]:
                translated_parts.append(s[0])

        translated_text = "".join(translated_parts)
        
        # Extract detected source language if 'auto' was requested
        detected_lang = res_json[2] if len(res_json) > 2 else from_lang

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "translated": translated_text.strip(),
                "source": text.strip(),
                "from": detected_lang,
                "to": to_lang
            }
        }

    except Exception as e:
        return {"success": False, "error": f"Translation request failed: {str(e)}"}
