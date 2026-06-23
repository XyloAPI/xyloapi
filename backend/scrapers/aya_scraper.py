import os
import time
import requests


def get_aya_chat(payload):
    try:
        api_key = os.environ.get("COHERE_API") or ""
        if not api_key:
            return {"success": False, "error": "COHERE_API is not configured in the server environment (.env)"}

        prompt = payload.get("prompt") or payload.get("message") or payload.get("text") or ""
        if isinstance(prompt, list):
            prompt = prompt[0] if prompt else ""
        if not prompt:
            return {"success": False, "error": "Missing required parameter: prompt"}

        r = requests.post(
            "https://api.cohere.com/v2/chat",
            json={
                "model": "c4ai-aya-expanse-32b",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.3,
            },
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            timeout=40,
        )

        if r.status_code == 401 or r.status_code == 403:
            return {"success": False, "error": "COHERE_API is invalid or expired. Please update it in .env"}

        if r.status_code != 200:
            try:
                err_msg = r.json().get("message") or "Failed to query Aya AI"
            except Exception:
                err_msg = r.text.strip() or "Failed to query Aya AI"
            return {"success": False, "error": f"Aya AI returned status code {r.status_code}: {err_msg}"}

        data = r.json()
        response_text = (data.get("message") or {}).get("content", [{}])[0].get("text") or ""

        if not response_text:
            return {"success": False, "error": "Empty response from Aya AI"}

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "response": response_text,
            }
        }
    except Exception:
        return {"success": False, "error": "Failed to run Aya AI Chat"}
