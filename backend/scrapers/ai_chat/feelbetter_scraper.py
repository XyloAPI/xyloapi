import time
import requests

BASE = "https://feelbetterbot.com"

SYSTEM_MESSAGE = {
    "role": "assistant",
    "content": "Hi, I'm FeelBetterBot — I'm here to help you work through whatever you're carrying with kindness and without judgment. I draw from evidence-based approaches to support you in finding a way forward that feels right for you. So, how are you really doing today?"
}

HEADERS = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9,id-ID;q=0.8,id;q=0.7",
    "content-type": "application/json",
    "origin": BASE,
    "referer": BASE + "/",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
    "sec-ch-ua": '"Google Chrome";v="149", "Chromium";v="149", "Not)A;Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
}

COOKIES = {
    "feelbet-memory": "noble-echo-3818",
}


def get_feelbetter_chat(payload):
    try:
        prompt = payload.get("prompt") or payload.get("message") or payload.get("text") or ""
        if isinstance(prompt, list):
            prompt = prompt[0] if prompt else ""
        if not prompt:
            return {"success": False, "error": "Missing required parameter: prompt"}

        messages = [
            SYSTEM_MESSAGE,
            {"role": "user", "content": prompt},
        ]

        body = {"messages": messages}

        full_text = ""

        with requests.post(
            BASE + "/",
            json=body,
            headers=HEADERS,
            cookies=COOKIES,
            stream=True,
            timeout=60,
        ) as r:
            if r.status_code != 200:
                return {"success": False, "error": f"FeelBetter AI returned status code {r.status_code}"}

            for chunk in r.iter_content(chunk_size=None):
                if not chunk:
                    continue
                full_text += chunk.decode("utf-8", errors="ignore")

        full_text = full_text.strip()
        if not full_text:
            return {"success": False, "error": "No response returned from FeelBetter AI"}

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "response": full_text,
            }
        }
    except Exception:
        return {"success": False, "error": "Failed to run FeelBetter AI Chat"}
