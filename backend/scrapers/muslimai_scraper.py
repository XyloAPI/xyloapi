import json
import time
import requests

URL = "https://www.muslimai.io/api/chat"

DISTINCT_ID = "019eefd8-3593-71f2-bf2a-39edb657ede6"

HEADERS = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9,id-ID;q=0.8,id;q=0.7",
    "content-type": "application/json",
    "origin": "https://www.muslimai.io",
    "referer": "https://www.muslimai.io/",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
    "sec-ch-ua": '"Google Chrome";v="149", "Chromium";v="149", "Not)A;Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
}


def get_muslimai_chat(payload):
    try:
        prompt = payload.get("prompt") or payload.get("message") or payload.get("text") or payload.get("query") or ""
        if isinstance(prompt, list):
            prompt = prompt[0] if prompt else ""
        if not prompt:
            return {"success": False, "error": "Missing required parameter: prompt"}

        body = {
            "query": prompt,
            "distinctId": DISTINCT_ID,
        }

        r = requests.post(URL, json=body, headers=HEADERS, timeout=30)

        if r.status_code != 200:
            return {"success": False, "error": f"MuslimAI API returned status code {r.status_code}"}

        # Response is a stream of JSON objects separated by newlines
        # Types: "sources" and "text"
        text_parts = []
        sources = []

        for line in r.text.strip().split("\n"):
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
                if obj.get("type") == "text":
                    text_parts.append(obj.get("data", ""))
                elif obj.get("type") == "sources":
                    raw_sources = obj.get("data", [])
                    sources = [
                        {
                            "surah_title": s.get("surah_title", ""),
                            "surah_url": s.get("surah_url", ""),
                            "content": s.get("content", ""),
                        }
                        for s in raw_sources
                    ]
            except Exception:
                continue

        response_text = "".join(text_parts).strip()
        if not response_text:
            return {"success": False, "error": "Empty response from MuslimAI"}

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "response": response_text,
                "sources": sources,
            }
        }
    except Exception as e:
        return {"success": False, "error": "Failed to run MuslimAI Chat"}
