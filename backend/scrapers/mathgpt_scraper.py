import os
import json
import time
import requests

try:
    from secrets import token_hex
except ImportError:
    import os as _os
    def token_hex(n): return _os.urandom(n).hex()

URL = "https://math-gpt.ai/api/ai/generateAnswerStream"

HEADERS = {
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "en-US,en;q=0.9,id-ID;q=0.8,id;q=0.7",
    "Connection": "keep-alive",
    "Content-Type": "application/json",
    "Cookie": 'NUXT_LOCALE=en; cc_cookie=%7B%22categories%22%3A%5B%22necessary%22%2C%22analytics%22%5D%2C%22revision%22%3A0%2C%22data%22%3Anull%2C%22consentTimestamp%22%3A%222026-05-06T15%3A46%3A43.814Z%22%2C%22consentId%22%3A%22239ff797-fd56-4fdc-b7b7-a22fa75f279f%22%7D',
    "Origin": "https://math-gpt.ai",
    "Referer": "https://math-gpt.ai/",
    "Sec-Ch-Ua": '"Google Chrome";v="123", "Not.A/Brand";v="8", "Chromium";v="123"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
}


def get_mathgpt_chat(payload):
    try:
        prompt = payload.get("prompt") or payload.get("message") or payload.get("text") or ""
        if isinstance(prompt, list):
            prompt = prompt[0] if prompt else ""
        if not prompt:
            return {"success": False, "error": "Missing required parameter: prompt"}

        visitor_id = token_hex(16)
        message_id = int(time.time() * 1000)

        body = {
            "isJustAnswerEnabled": False,
            "isThinkingEnabled": False,
            "messages": [
                {
                    "id": message_id,
                    "text": prompt,
                    "sender": "user",
                    "fileUrl": "",
                    "fileName": "",
                    "mimeType": "",
                    "type": "MathAI",
                    "visitorId": visitor_id,
                }
            ],
        }

        full_text = ""
        buffer = ""

        try:
            with requests.post(URL, json=body, headers=HEADERS, stream=True, timeout=90) as r:
                if r.status_code != 200:
                    return {"success": False, "error": f"MathGPT returned status code {r.status_code}"}

                for chunk in r.iter_content(chunk_size=None):
                    if not chunk:
                        continue
                    buffer += chunk.decode("utf-8", errors="ignore")
                    lines = buffer.split("\n")
                    buffer = lines.pop()

                    for line in lines:
                        trimmed = line.strip()
                        if not trimmed or not trimmed.startswith("data: "):
                            continue
                        data_str = trimmed[6:].strip()
                        if data_str == "[DONE]":
                            continue
                        try:
                            if data_str.startswith("{"):
                                obj = json.loads(data_str)
                                content = obj.get("content") or obj.get("text") or obj.get("answer") or ""
                                if content:
                                    full_text += content
                            else:
                                full_text += data_str
                        except Exception:
                            if data_str and not data_str.startswith("{") and not data_str.startswith("["):
                                full_text += data_str
        except requests.exceptions.ConnectionError:
            # MathGPT closes connection abruptly after sending — data already collected
            pass

        full_text = full_text.strip()
        if not full_text:
            return {"success": False, "error": "No response returned from MathGPT"}

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "response": full_text,
            }
        }
    except Exception as e:
        return {"success": False, "error": "Failed to run MathGPT Chat"}
