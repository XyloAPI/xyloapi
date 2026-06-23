import time
import requests
from urllib.parse import quote

URL = "https://gitagpt.org/api/ask/gita"

HEADERS = {
    "referer": "https://gitagpt.org/",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
    "sec-ch-ua": '"Google Chrome";v="149", "Chromium";v="149", "Not)A;Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
}


def get_gitaai_chat(payload):
    try:
        prompt = payload.get("prompt") or payload.get("message") or payload.get("text") or ""
        if isinstance(prompt, list):
            prompt = prompt[0] if prompt else ""
        if not prompt:
            return {"success": False, "error": "Missing required parameter: prompt"}

        params = {
            "q": prompt,
            "email": "null",
            "locale": "en",
        }

        r = requests.get(URL, params=params, headers=HEADERS, timeout=30)

        if r.status_code != 200:
            return {"success": False, "error": f"Gita AI returned status code {r.status_code}"}

        data = r.json()
        response_text = data.get("response") or ""

        if not response_text:
            return {"success": False, "error": "Empty response from Gita AI"}

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "response": response_text,
            }
        }
    except Exception as e:
        return {"success": False, "error": "Failed to run Gita AI Chat"}
