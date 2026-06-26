import json
import time
import requests

URL = "https://api.jeeves.ai/generate/v4/chat"

HEADERS = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9,id-ID;q=0.8,id;q=0.7",
    "authorization": "Bearer undefined",
    "content-type": "application/json",
    "origin": "https://jeeves.ai",
    "priority": "u=1, i",
    "referer": "https://jeeves.ai/",
    "sec-ch-ua": '"Google Chrome";v="123", "Not.A/Brand";v="8", "Chromium";v="123"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
}


def get_jeeves_chat(payload):
    try:
        prompt = payload.get("prompt") or payload.get("message") or payload.get("text") or ""
        if isinstance(prompt, list):
            prompt = prompt[0] if prompt else ""
        if not prompt:
            return {"success": False, "error": "Missing required parameter: prompt"}

        # Jeeves expects prompt ending with newline
        if not prompt.endswith("\n"):
            prompt = prompt + "\n"

        body = {"prompt": prompt}

        full_text = ""
        final_text = ""
        buffer = ""

        with requests.post(URL, json=body, headers=HEADERS, stream=True, timeout=60) as r:
            if r.status_code == 429:
                return {"success": False, "error": "Jeeves AI is rate limited. Please try again later."}
            if r.status_code != 200:
                return {"success": False, "error": f"Jeeves AI returned status code {r.status_code}"}

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
                        obj = json.loads(data_str)
                        if obj.get("finalText"):
                            final_text = obj["finalText"]
                        elif obj.get("text") and not final_text:
                            full_text += obj["text"]
                    except Exception:
                        pass

        result = final_text or full_text
        result = result.strip()

        if not result:
            return {"success": False, "error": "No response returned from Jeeves AI"}

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "response": result,
            }
        }
    except Exception as e:
        return {"success": False, "error": "Failed to run Jeeves AI Chat"}
