import re
import time
import json

try:
    from curl_cffi import requests as curl_requests
    HAS_CURL = True
except ImportError:
    import requests as curl_requests
    HAS_CURL = False

BASE = "https://www.olabiba.com"

HEADERS_BASE = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9,id-ID;q=0.8,id;q=0.7",
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


def _clean(text: str) -> str:
    """Strip HTML entities, metadata tags, HTML comments, and extra whitespace."""
    # Remove metadata markers
    text = re.sub(r'\[ELABORATE\].*', '', text, flags=re.DOTALL)
    text = re.sub(r'\[FOLLOWUP\].*?\[/FOLLOWUP\]', '', text, flags=re.DOTALL)
    text = re.sub(r'\[FOLLOWUP:[^\]]*\]', '', text)
    text = re.sub(r'\[MODEL:[^\]]*\]', '', text)
    text = re.sub(r'\[DONE\]', '', text)
    # Remove HTML comments e.g. <!--QUERY:-->
    text = re.sub(r'<!--.*?-->', '', text, flags=re.DOTALL)
    # Decode HTML entities
    text = text.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').replace('&quot;', '"')
    # Collapse excess whitespace
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def get_olabiba_chat(payload):
    try:
        prompt = payload.get("prompt") or payload.get("message") or payload.get("text") or ""
        if isinstance(prompt, list):
            prompt = prompt[0] if prompt else ""
        if not prompt:
            return {"success": False, "error": "Missing required parameter: prompt"}

        mood = payload.get("mood") or "friendly"
        lang = payload.get("lang") or "en"

        impersonate = "chrome120" if HAS_CURL else None

        # Use a Session so PHPSESSID cookie persists between message.php and stream.php
        if HAS_CURL:
            session = curl_requests.Session()
        else:
            import requests as _req
            session = _req.Session()

        # Step 1: POST to message.php — uses multipart/form-data
        post_kwargs = dict(
            url=f"{BASE}/php/message.php",
            data={
                "text": prompt,
                "mood": mood,
                "lang": lang,
                "adblock": "No",
                "theme": "light",
                "voice": "No",
            },
            headers=HEADERS_BASE,
            timeout=20,
        )
        if impersonate:
            post_r = session.post(**post_kwargs, impersonate=impersonate)
        else:
            post_r = session.post(**post_kwargs)

        if post_r.status_code != 200:
            return {"success": False, "error": f"Olabiba message.php returned status {post_r.status_code}"}

        # Step 2: GET stream.php — SSE, session carries PHPSESSID automatically
        stream_headers = {**HEADERS_BASE, "accept": "text/event-stream", "cache-control": "no-cache", "pragma": "no-cache"}

        stream_kwargs = dict(
            url=f"{BASE}/php/stream.php",
            headers=stream_headers,
            stream=True,
            timeout=60,
        )
        if impersonate:
            stream_r = session.get(**stream_kwargs, impersonate=impersonate)
        else:
            stream_r = session.get(**stream_kwargs)

        if stream_r.status_code != 200:
            return {"success": False, "error": f"Olabiba stream.php returned status {stream_r.status_code}"}

        # Parse SSE — format: "data: <content>"
        full_text = ""
        buffer = ""

        try:
            for chunk in stream_r.iter_content(chunk_size=None):
                if not chunk:
                    continue
                buffer += chunk.decode("utf-8", errors="ignore")
                lines = buffer.split("\n")
                buffer = lines.pop()

                for line in lines:
                    line = line.strip()
                    if not line:
                        continue
                    if line.startswith("data:"):
                        content = line[5:].strip()
                        if content == "[DONE]":
                            break
                        full_text += content
        except Exception:
            pass

        full_text = _clean(full_text)
        if not full_text:
            return {"success": False, "error": "No response returned from Olabiba AI"}

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "response": full_text,
            }
        }
    except Exception:
        return {"success": False, "error": "Failed to run Olabiba AI Chat"}
