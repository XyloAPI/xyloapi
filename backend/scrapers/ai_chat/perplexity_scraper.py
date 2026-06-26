import uuid
import json
import time
import requests

BASE = "https://www.perplexity.ai"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
    "Accept": "text/event-stream",
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "Content-Type": "application/json",
    "Origin": BASE,
    "Referer": BASE + "/",
}


def buat_cookie():
    cookies = {
        "pplx.visitor-id": str(uuid.uuid4()),
        "pplx.session-id": str(uuid.uuid4()),
        "pplx.edge-vid": str(uuid.uuid4()),
        "pplx.edge-sid": str(uuid.uuid4()),
    }
    return "; ".join(f"{k}={v}" for k, v in cookies.items())


def buat_payload(query):
    return {
        "params": {
            "last_backend_uuid": str(uuid.uuid4()),
            "read_write_token": str(uuid.uuid4()),
            "attachments": [],
            "language": "id-ID",
            "timezone": "Asia/Jakarta",
            "search_focus": "internet",
            "sources": ["web"],
            "frontend_uuid": str(uuid.uuid4()),
            "mode": "copilot",
            "model_preference": "turbo",
            "query_source": "followup",
            "version": "2.18",
        },
        "query_str": query,
    }


def parse_sse(raw):
    lines = raw.split("\n")
    for line in reversed(lines):
        if not line.startswith("data: "):
            continue
        try:
            d = json.loads(line[6:])
            if d.get("text") and d.get("final"):
                parsed = json.loads(d["text"])
                for item in parsed:
                    if item.get("step_type") == "FINAL" and item.get("content", {}).get("answer"):
                        answer_raw = json.loads(item["content"]["answer"])
                        answer = answer_raw.get("answer", "")
                        # Strip citation markers like [1], [2]
                        import re
                        answer = re.sub(r"\[\d+\]", "", answer).strip()
                        return answer
        except Exception:
            pass
    return None


def get_perplexity_chat(payload):
    try:
        prompt = payload.get("prompt") or payload.get("message") or payload.get("text") or payload.get("query") or ""
        if isinstance(prompt, list):
            prompt = prompt[0] if prompt else ""

        if not prompt:
            return {"success": False, "error": "Missing required parameter: prompt"}

        headers = {
            **HEADERS,
            "Cookie": buat_cookie(),
            "x-request-id": str(uuid.uuid4()),
        }

        body = json.dumps(buat_payload(prompt))

        r = requests.post(
            f"{BASE}/rest/sse/perplexity_ask",
            data=body,
            headers=headers,
            timeout=30,
        )

        if r.status_code != 200:
            return {"success": False, "error": f"Perplexity API returned status code {r.status_code}"}

        answer = parse_sse(r.text)
        if not answer:
            return {"success": False, "error": "Failed to parse response from Perplexity"}

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "response": answer
            }
        }
    except Exception as e:
        return {"success": False, "error": "Failed to run Perplexity Chat"}
