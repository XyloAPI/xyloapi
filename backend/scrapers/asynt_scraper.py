import uuid
import time
import requests

WIDGET_ID = "asyntai_2bcd9dfbae24"
PAGE_URL = "https://asyntai.com/dashboard"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
    "Content-Type": "application/json",
    "Referer": "https://asyntai.com/dashboard",
    "Origin": "https://asyntai.com",
    "sec-ch-ua": '"Google Chrome";v="149", "Chromium";v="149", "Not)A;Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
}


def get_asynt_chat(payload):
    try:
        prompt = payload.get("prompt") or payload.get("message") or payload.get("text") or ""
        if isinstance(prompt, list):
            prompt = prompt[0] if prompt else ""

        if not prompt:
            return {"success": False, "error": "Missing required parameter: prompt"}

        session_id = f"session_{uuid.uuid4().hex[:12]}"

        body = {
            "widget_id": WIDGET_ID,
            "message": prompt,
            "session_id": session_id,
            "page_url": PAGE_URL,
        }

        r = requests.post(
            "https://asyntai.com/api/widget-chat/",
            json=body,
            headers=HEADERS,
            timeout=30,
        )

        if r.status_code != 200:
            return {"success": False, "error": f"Asynt AI returned status code {r.status_code}"}

        data = r.json()

        if data.get("status") != "success":
            return {"success": False, "error": data.get("reply") or "Unknown error from Asynt AI"}

        reply = data.get("reply") or ""

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "response": reply
            }
        }
    except Exception as e:
        return {"success": False, "error": "Failed to run Asynt AI Chat"}
