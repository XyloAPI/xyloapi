import os
import json
import time
import requests

SESSION_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sahabatai_session.json")

DEFAULT_SESSION = {
    "authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJsb2dpbmlkIjoiNTlFOERCQ0Y0NjMzNEJFQjlEQ0NCMUY0M0JGREJCN0UiLCJhY2Nlc3NrZXkiOiI4ZjdiNDY3M2Y4NzI0MWZlYjllN2MyODQyNGQ0MWU5OSIsImNoYW5uZWwiOiJXRUIiLCJjdXN0b21lcmlkIjoiYTMxNjhlNzM2ZTI4ZTRhMWY4MmI1M2FjMTE5OTIwZjgiLCJ1c2VydHlwZSI6Imd1ZXN0Iiwicm9sZXR5cGUiOiJndWVzdCIsImV4cG1pbiI6IjI4ODAwIiwibXNpc2RuIjoiNTlFOERCQ0Y0NjMzNEJFQjlEQ0NCMUY0M0JGREJCN0UiLCJkZXZpY2VpZCI6IjU5RThEQkNGNDYzMzRCRUI5RENDQjFGNDNCRkRCQjdFIiwidXNlcmlkIjoiMCIsImlzcyI6ImRpZ2l0cmFsIiwiYXVkIjoic2FoYWJhdGFpLXVzZXJzIiwiaWF0IjoxNzgyMTgwODI1LCJleHAiOjE3ODM5MDg4MzEsImp0aSI6IjIwMTAzNDI5ZWE3ZjQyNmJiMjA2NjUwMWZlMDg4MDQyIn0.KmhuyKhmJQCasJtjcP4vvFye2El4VBn-n1e-LG-3gX0",
    "x_rt": "486B6C30653941E693FF85DF10251432",
    "x_rc": "WEB",
    "x_rs": "5fb54ffe5b8e38a05d33f51dd9a2a5cc65e16539be7a7d2ac442f03a3b1357849b342a14045231633c0d4c296d0b87818f6e3b9792280f24bac6e48d413b20e5",
    "x_did": "59E8DBCF46334BEB9DCCB1F43BFDBB7E",
    "x_cf": "5dc295932313a2aebfd5b6b97a09958ffe42e0046925ad0e8c9c4453534ec257056e1d6a03cdf1279181c1861db01450b9af16c7a7405cf7fd9334c6a51a300c",
}

BASE_URL = "https://api-sahabat-ai.ioh.co.id/api/v1"

COMMON_HEADERS = {
    "Content-Type": "application/json",
    "referer": "https://chat.sahabat-ai.com/",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
    "x-av": "1.1.0",
    "x-sk": "SAHABATAI",
    "x-rl": "EN",
    "x-dm": "Win32",
    "x-dmk": "Chrome",
    "x-os": "Win32",
    "x-osv": "147.0.0.0",
}


def load_session():
    try:
        if os.path.exists(SESSION_FILE):
            with open(SESSION_FILE, "r") as f:
                return json.load(f)
    except Exception:
        pass
    return dict(DEFAULT_SESSION)


def save_session(session):
    try:
        with open(SESSION_FILE, "w") as f:
            json.dump(session, f, indent=2)
    except Exception:
        pass


def build_headers(session):
    return {
        **COMMON_HEADERS,
        "Accept": "application/json, text/plain, */*",
        "Authorization": session["authorization"],
        "x-rt": session["x_rt"],
        "x-rc": session["x_rc"],
        "x-rs": session["x_rs"],
        "x-did": session["x_did"],
        "x-cf": session["x_cf"],
    }


def get_sahabatai_chat(payload):
    try:
        prompt = payload.get("prompt") or payload.get("message") or payload.get("text") or payload.get("query") or ""
        if isinstance(prompt, list):
            prompt = prompt[0] if prompt else ""
        if not prompt:
            return {"success": False, "error": "Missing required parameter: prompt"}

        session = load_session()

        # Step 1: Handshake (addlog) to refresh token chain
        try:
            addlog_r = requests.post(
                f"{BASE_URL}/user/addlog",
                json={
                    "category": "homepage",
                    "eventname": "click_inputFilled",
                    "label": "send",
                    "state": "Homepage free user",
                    "usertype": "free gmail",
                    "user": "{user: free}",
                },
                headers=build_headers(session),
                timeout=15,
            )
            # Update token chain from response headers
            if addlog_r.headers.get("x-at"):
                session["authorization"] = f"Bearer {addlog_r.headers['x-at']}"
            session["x_rt"] = addlog_r.headers.get("x-rt") or session["x_rt"]
            session["x_rs"] = addlog_r.headers.get("x-rs") or session["x_rs"]
            session["x_rc"] = addlog_r.headers.get("x-rc") or session["x_rc"]
            save_session(session)
        except Exception:
            pass  # proceed with existing session if handshake fails

        # Step 2: Chat conversation (SSE stream)
        chat_r = requests.post(
            f"{BASE_URL}/chat/conversation",
            json={
                "query": prompt,
                "conversation_id": None,
                "message_id": None,
                "isretry": False,
                "agentid": None,
                "modelid": None,
                "files": [],
            },
            headers={
                **build_headers(session),
                "Accept": "text/event-stream",
            },
            stream=True,
            timeout=45,
        )

        if chat_r.status_code != 200:
            return {"success": False, "error": f"Sahabat AI returned status code {chat_r.status_code}"}

        # Update token chain from chat response headers
        if chat_r.headers.get("x-at"):
            session["authorization"] = f"Bearer {chat_r.headers['x-at']}"
        session["x_rt"] = chat_r.headers.get("x-rt") or session["x_rt"]
        session["x_rs"] = chat_r.headers.get("x-rs") or session["x_rs"]
        session["x_rc"] = chat_r.headers.get("x-rc") or session["x_rc"]
        save_session(session)

        # Parse SSE stream
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
                    if trimmed == "data: [DONE]":
                        break
                    if trimmed.startswith("data:"):
                        data_str = trimmed[5:].strip()
                        if not data_str:
                            continue
                        try:
                            obj = json.loads(data_str)
                            delta = obj.get("delta") or {}
                            if delta.get("text"):
                                full_text += delta["text"]
                        except Exception:
                            pass
        except requests.exceptions.ConnectionError:
            pass  # server may close connection abruptly

        full_text = full_text.strip()
        if not full_text:
            return {"success": False, "error": "No response returned from Sahabat AI"}

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "response": full_text,
            }
        }
    except Exception:
        return {"success": False, "error": "Failed to run Sahabat AI Chat"}
