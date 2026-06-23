import os
import time
import requests


def get_felo_chat(payload):
    try:
        api_key = os.environ.get("FELO_KEY") or ""
        if not api_key:
            return {"success": False, "error": "FELO_KEY is not configured in the server environment (.env)"}

        prompt = payload.get("prompt") or payload.get("message") or payload.get("text") or payload.get("query") or ""
        if isinstance(prompt, list):
            prompt = prompt[0] if prompt else ""
        if not prompt:
            return {"success": False, "error": "Missing required parameter: prompt"}

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        }

        r = requests.post(
            "https://openapi.felo.ai/v2/chat",
            json={"query": prompt},
            headers=headers,
            timeout=60,
        )

        if r.status_code == 401 or r.status_code == 403:
            return {"success": False, "error": "FELO_KEY is invalid or expired. Please update it in .env"}

        if r.status_code != 200:
            return {"success": False, "error": f"Felo AI returned status code {r.status_code}"}

        data = r.json()

        # Response structure: {"status": 200, "data": {"answer": "...", "resources": [...]}}
        response_text = (
            (data.get("data") or {}).get("answer")
            or data.get("answer")
            or data.get("response")
            or data.get("content")
            or ""
        )

        if not response_text:
            return {"success": False, "error": "Empty response from Felo AI"}

        # Optional: include sources
        resources = (data.get("data") or {}).get("resources") or []
        sources = [
            {"title": s.get("title", ""), "link": s.get("link", ""), "snippet": s.get("snippet", "")}
            for s in resources
        ]

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "response": response_text,
                "sources": sources,
            }
        }
    except Exception as e:
        return {"success": False, "error": "Failed to run Felo AI Chat"}
