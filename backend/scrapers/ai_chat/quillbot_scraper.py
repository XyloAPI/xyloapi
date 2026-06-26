import os
import requests
import json
import time

CONVERSATION_ID = os.environ.get("QUILLBOT_CONVERSATION_ID") or "7f8d3ac1-962d-4bb7-a16c-aaf0d39bc303"
COOKIE = os.environ.get("QUILLBOT_COOKIE") or "connect.sid=s%3AOEN4JvJxw7GVyjSVjaf-bCzVCVUb6EDI.d4fQniddXBHmvnfM0os%2BQ0QexyAGEoT0wN6z3wk%2FGvg; qb_anon_id=bd5cde24feadff92bb602c626160d867d94d061043add64465b6fff6ebfae539.52e402927ddc3ff59fdfa4810414f76211673e6bf8a44e65141e67379caa7484; anonID=e00b4018e2b101ea; premium=false"


def get_quillbot_chat(payload):
    try:
        prompt = payload.get("prompt") or payload.get("message") or payload.get("text") or ""
        if isinstance(prompt, list):
            prompt = prompt[0] if prompt else ""

        if not prompt:
            return {"success": False, "error": "Missing required parameter: prompt"}

        url = f"https://quillbot.com/api/ai-chat/chat/conversation/{CONVERSATION_ID}"

        headers = {
            "content-type": "application/json",
            "accept": "text/event-stream",
            "qb-product": "AI-CHAT",
            "platform-type": "webapp",
            "cookie": COOKIE,
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "origin": "https://quillbot.com",
            "referer": "https://quillbot.com/",
        }

        body = {
            "message": {
                "content": prompt + "\n\n",
                "prompt": {
                    "id": "fast_draft/meta-prompt",
                    "version": 4,
                    "variables": {
                        "topic": prompt,
                        "output": "Text",
                        "output_type": "text",
                    },
                },
            },
            "context": {
                "editorContext": "",
                "selectionContext": "",
                "userDialect": "en-us",
                "apiVersion": 2,
            },
            "origin": {
                "name": "ai-chat.chat",
                "url": "https://quillbot.com",
            },
        }

        result = ""

        with requests.post(url, json=body, headers=headers, stream=True, timeout=90) as r:
            if r.status_code != 200:
                try:
                    err_data = r.json()
                    error_msg = err_data.get("message") or err_data.get("error") or "Failed to query QuillBot API"
                except Exception:
                    error_msg = r.text.strip() or "Failed to query QuillBot API"
                return {"success": False, "error": f"QuillBot API returned status code {r.status_code}: {error_msg}"}

            for chunk in r.iter_lines():
                if not chunk:
                    continue
                try:
                    data = json.loads(chunk.decode("utf-8"))
                    if data.get("type") == "content":
                        result += data.get("content", "")
                except Exception:
                    pass

        if not result:
            return {"success": False, "error": "No response returned from QuillBot API"}

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "response": result.strip()
            }
        }
    except Exception as e:
        return {"success": False, "error": "Failed to run QuillBot Chat completions"}
