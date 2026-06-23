import time
import requests


def get_pollinations_chat(payload):
    try:
        prompt = payload.get("prompt") or payload.get("message") or payload.get("text") or ""
        if isinstance(prompt, list):
            prompt = prompt[0] if prompt else ""

        if not prompt:
            return {"success": False, "error": "Missing required parameter: prompt"}

        from urllib.parse import quote
        url = f"https://text.pollinations.ai/{quote(prompt)}"

        r = requests.get(url, timeout=60)

        if r.status_code != 200:
            return {"success": False, "error": f"Pollinations API returned status code {r.status_code}"}

        response_text = r.text.strip()
        if not response_text:
            return {"success": False, "error": "Empty response from Pollinations API"}

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "response": response_text
            }
        }
    except Exception as e:
        return {"success": False, "error": "Failed to run Pollinations Chat"}
