import json
import time
import random
import string
import requests

BASE_URL = "https://ansari-multisage-backend.up.railway.app/api/v2"

HEADERS = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Origin": "https://askansari.ai",
    "Referer": "https://askansari.ai/",
}


def _rand_str(n):
    return "".join(random.choices(string.ascii_lowercase + string.digits, k=n))


def get_ansari_chat(payload):
    try:
        prompt = payload.get("prompt") or payload.get("message") or payload.get("text") or ""
        if isinstance(prompt, list):
            prompt = prompt[0] if prompt else ""
        if not prompt:
            return {"success": False, "error": "Missing required parameter: prompt"}

        # Step 1: Register guest
        guest_email = f"guest_{_rand_str(7)}@ansari.chat"
        guest_password = _rand_str(7) + "A1!"

        reg_r = requests.post(
            f"{BASE_URL}/users/register",
            json={
                "email": guest_email,
                "password": guest_password,
                "first_name": "Guest",
                "last_name": "User",
                "register_to_mail_list": False,
            },
            headers=HEADERS,
            timeout=20,
        )

        if reg_r.status_code != 200 and reg_r.status_code != 201:
            return {"success": False, "error": f"Ansari AI registration failed with status {reg_r.status_code}"}

        token = reg_r.json().get("access_token") or ""
        if not token:
            return {"success": False, "error": "Failed to obtain access token from Ansari AI"}

        auth_headers = {**HEADERS, "Authorization": f"Bearer {token}"}

        # Step 2: Create thread
        thread_r = requests.post(f"{BASE_URL}/threads", json={}, headers=auth_headers, timeout=15)

        thread_data = thread_r.json()
        thread_id = thread_data.get("thread_id")
        if not thread_id and isinstance(thread_data, list):
            thread_id = thread_data[0].get("thread_id") if thread_data else None
        if not thread_id:
            return {"success": False, "error": "Failed to create Ansari AI thread"}

        # Step 3: Chat with SSE stream
        chat_r = requests.post(
            f"{BASE_URL}/threads/{thread_id}",
            json={"content": prompt, "role": "user"},
            headers={**auth_headers, "Accept": "text/event-stream"},
            stream=True,
            timeout=60,
        )

        if chat_r.status_code != 200:
            return {"success": False, "error": f"Ansari AI chat returned status {chat_r.status_code}"}

        full_text = ""
        buffer = ""

        try:
            for chunk in chat_r.iter_content(chunk_size=None):
                if not chunk:
                    continue
                buffer += chunk.decode("utf-8", errors="ignore")
                lines = buffer.split("\n")
                buffer = lines.pop()

                for line in lines:
                    trimmed = line.strip()
                    if not trimmed:
                        continue
                    data_str = trimmed[5:].strip() if trimmed.startswith("data:") else trimmed
                    if data_str == "[DONE]":
                        continue
                    try:
                        obj = json.loads(data_str)
                        content = (
                            obj.get("content")
                            or obj.get("text")
                            or (obj.get("delta") or {}).get("content")
                            or ((obj.get("choices") or [{}])[0].get("delta") or {}).get("content")
                            or ((obj.get("message") or {}).get("content"))
                            or ""
                        )
                        if content:
                            full_text += content
                    except Exception:
                        if data_str and not data_str.startswith("{"):
                            full_text += data_str
        except requests.exceptions.ConnectionError:
            pass

        # Process leftover buffer
        if buffer.strip() and not buffer.strip().startswith("data:"):
            full_text += buffer.strip()

        full_text = full_text.strip()
        if not full_text:
            return {"success": False, "error": "No response returned from Ansari AI"}

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "response": full_text,
            }
        }
    except Exception:
        return {"success": False, "error": "Failed to run Ansari AI Chat"}
