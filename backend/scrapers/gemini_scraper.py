import os
import re
import json
import time
import random
import requests

BASE = "https://gemini.google.com"

REQUEST_URL = f"{BASE}/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate"
REQUEST_BL_PARAM = "boq_assistant-bard-web-server_20240519.16_p0"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "Content-Type": "application/x-www-form-urlencoded",
    "Origin": BASE,
    "Referer": BASE + "/",
    "x-same-domain": "1",
}

MODELS = {
    "gemini-3.1-pro": '[1,null,null,null,"e6fa609c3fa255c0",null,null,0,[4,5,6,8],null,null,2,null,null,3,1,"09D681E7-26F2-4A94-A465-38386B7AB93B"]',
    "gemini-3.1-flash-lite": '[1,null,null,null,"8c46e95b1a07cecc",null,null,0,[4,5,6,8],null,null,2,null,null,6,1,"09D681E7-26F2-4A94-A465-38386B7AB93B"]',
    "gemini-3.5-flash": '[1,null,null,null,"56fdd199312815e2",null,null,0,[4,5,6,8],null,null,2,null,null,1,1,"09D681E7-26F2-4A94-A465-38386B7AB93B"]',
}

DEFAULT_MODEL = "gemini-3.5-flash"


def parse_cookie_string(cookie_str):
    """Parse cookie string (key=val; key=val) into a dict."""
    cookies = {}
    for part in cookie_str.split(";"):
        part = part.strip()
        if "=" in part:
            k, v = part.split("=", 1)
            cookies[k.strip()] = v.strip()
    return cookies


def fetch_snlm0e(cookies):
    """Fetch SNlM0e token and f.sid from Gemini homepage."""
    r = requests.get(BASE, headers=HEADERS, cookies=cookies, timeout=20)
    r.raise_for_status()

    snlm0e = None
    sid = None

    snl_match = re.search(r'SNlM0e":"(.*?)"', r.text)
    if snl_match:
        snlm0e = snl_match.group(1)

    sid_match = re.search(r'"FdrFJe":"([\d-]+)"', r.text)
    if sid_match:
        sid = sid_match.group(1)

    return snlm0e, sid


def build_request(prompt, conversation=None):
    """Build the f.req payload for StreamGenerate."""
    return [
        [prompt, 0, None, [], None, None, 0],
        ["id-ID"],
        [
            conversation[0] if conversation else None,
            conversation[1] if conversation else None,
            conversation[2] if conversation else None,
            None,
            None,
            [],
        ],
        None, None, None,
        [1],
        0,
        [],
        [],
        1,
        0,
    ]


def parse_response(response_text):
    """Extract the final text answer from StreamGenerate SSE response — use last valid chunk."""
    last_content = None

    for raw_line in response_text.split("\n"):
        try:
            line = json.loads(raw_line)
        except Exception:
            continue

        if not isinstance(line, list) or not line:
            continue

        try:
            if not line[0] or len(line[0]) < 3 or not line[0][2]:
                continue
            part = json.loads(line[0][2])
            if part and len(part) > 4 and part[4]:
                content = part[4][0][1][0]
                # Strip citation markers and cleanup
                content = re.sub(r"\[\d+\]", "", content)
                content = re.sub(r"<!-- end list -->", "", content)
                content = content.replace("<ctrl94>thought", "<think>").replace("<ctrl95>", "</think>")
                content = content.strip()
                if content:
                    last_content = content  # keep updating — last one is the complete answer
        except Exception:
            continue

    return last_content


def get_gemini_chat(payload):
    try:
        cookie_str = os.environ.get("GEMINI_COOKIE") or ""
        if not cookie_str:
            return {"success": False, "error": "GEMINI_COOKIE is not configured in the server environment (.env)"}

        prompt = payload.get("prompt") or payload.get("message") or payload.get("text") or ""
        if isinstance(prompt, list):
            prompt = prompt[0] if prompt else ""
        if not prompt:
            return {"success": False, "error": "Missing required parameter: prompt"}

        model = payload.get("model") or DEFAULT_MODEL
        if isinstance(model, list):
            model = model[0] if model else DEFAULT_MODEL

        cookies = parse_cookie_string(cookie_str)

        # Fetch SNlM0e and session ID
        try:
            snlm0e, sid = fetch_snlm0e(cookies)
        except Exception as e:
            return {"success": False, "error": f"Failed to initialize Gemini session: {str(e)}"}

        if not snlm0e:
            return {"success": False, "error": "Invalid GEMINI_COOKIE — could not retrieve SNlM0e token"}

        req_id = random.randint(1111, 9999)

        params = {
            "bl": REQUEST_BL_PARAM,
            "hl": "id",
            "_reqid": str(req_id),
            "rt": "c",
            "f.sid": sid or "",
        }

        request_body = build_request(prompt)
        form_data = {
            "at": snlm0e,
            "f.req": json.dumps([None, json.dumps(request_body)]),
        }

        extra_headers = {}
        if model in MODELS:
            extra_headers["x-goog-ext-525001261-jspb"] = MODELS[model]

        r = requests.post(
            REQUEST_URL,
            params=params,
            data=form_data,
            headers={**HEADERS, **extra_headers},
            cookies=cookies,
            timeout=60,
        )

        if r.status_code != 200:
            return {"success": False, "error": f"Gemini API returned status code {r.status_code}"}

        answer = parse_response(r.text)
        if not answer:
            return {"success": False, "error": "Failed to parse response from Gemini"}

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "response": answer
            }
        }
    except Exception as e:
        return {"success": False, "error": "Failed to run Gemini Chat"}
