import json
import time

try:
    from curl_cffi import requests as curl_requests
    HAS_CURL_CFFI = True
except ImportError:
    import requests as curl_requests
    HAS_CURL_CFFI = False

CHAT_URL = "https://powerbrainai.com/chat.php"
BYPASS_URL = "https://api.nexray.eu.cc/tools/bypass/cf"

HEADERS = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9,id-ID;q=0.8,id;q=0.7",
    "content-type": "application/x-www-form-urlencoded",
    "origin": "https://powerbrainai.com",
    "referer": "https://powerbrainai.com/chat.html",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
    "sec-ch-ua": '"Google Chrome";v="149", "Chromium";v="149", "Not)A;Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
}


def get_powerbrainai_chat(payload):
    try:
        prompt = payload.get("prompt") or payload.get("message") or payload.get("text") or ""
        if isinstance(prompt, list):
            prompt = prompt[0] if prompt else ""
        if not prompt:
            return {"success": False, "error": "Missing required parameter: prompt"}

        form_data = {
            "message": prompt,
            "messageCount": "1",
        }

        response_text = None

        # 1. Try Nexray CF bypass first
        try:
            bypass_payload = {
                "url": CHAT_URL,
                "mode": "waf-session",
                "method": "POST",
                "headers": HEADERS,
                "body": "&".join(f"{k}={v}" for k, v in form_data.items()),
            }
            r = curl_requests.post(BYPASS_URL, json=bypass_payload, timeout=30)
            if r.status_code == 200:
                data = r.json()
                if data.get("status"):
                    result = data.get("result") or ""
                    # result may be raw JSON string or already parsed
                    if isinstance(result, str) and result.strip().startswith("{"):
                        result = json.loads(result)
                    if isinstance(result, dict):
                        response_text = result.get("response") or ""
                    elif isinstance(result, str):
                        response_text = result.strip()
        except Exception:
            pass

        # 2. Fallback: direct request with curl_cffi impersonation
        if not response_text and HAS_CURL_CFFI:
            try:
                r = curl_requests.post(
                    CHAT_URL,
                    data=form_data,
                    headers=HEADERS,
                    impersonate="chrome120",
                    timeout=20,
                )
                if r.status_code == 200:
                    data = r.json()
                    response_text = data.get("response") or ""
            except Exception:
                pass

        if not response_text:
            return {"success": False, "error": "Failed to get response from PowerBrain AI. Cloudflare protection may be active."}

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "response": response_text,
            }
        }
    except Exception as e:
        return {"success": False, "error": "Failed to run PowerBrain AI Chat"}
