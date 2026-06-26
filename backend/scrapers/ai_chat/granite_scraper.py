import os
import requests
import time


def get_granite_chat(payload):
    try:
        account_id = os.environ.get("CF_ACCOUNT_ID") or ""
        auth_token = os.environ.get("CF_TOKEN") or ""

        if not account_id:
            return {"success": False, "error": "CF_ACCOUNT_ID is not configured in the server environment (.env)"}
        if not auth_token:
            return {"success": False, "error": "CF_TOKEN is not configured in the server environment (.env)"}

        # Parse messages
        messages = payload.get("messages")

        # Fallback to single prompt/message if messages array is not provided
        if not messages:
            prompt = payload.get("prompt") or payload.get("message") or payload.get("text") or ""
            if isinstance(prompt, list):
                prompt = prompt[0] if prompt else ""

            if not prompt:
                return {"success": False, "error": "Missing required parameter: prompt or messages"}

            system = payload.get("system") or "You are a helpful assistant"
            messages = [
                {"role": "system", "content": system},
                {"role": "user", "content": prompt}
            ]

        model = payload.get("model") or "@cf/ibm-granite/granite-4.0-h-micro"
        if isinstance(model, list):
            model = model[0] if model else "@cf/ibm-granite/granite-4.0-h-micro"

        url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/{model}"

        headers = {
            "Authorization": f"Bearer {auth_token}",
            "Content-Type": "application/json"
        }

        api_payload = {
            "messages": messages
        }

        session = requests.Session()
        r = session.post(url, json=api_payload, headers=headers, timeout=90)

        if r.status_code != 200:
            try:
                err_data = r.json()
                error_msg = err_data.get("errors", [{}])[0].get("message") or "Failed to query Granite API"
            except Exception:
                error_msg = r.text.strip() or "Failed to query Granite API"
            return {"success": False, "error": f"Granite API returned status code {r.status_code}: {error_msg}"}

        data = r.json()
        result = data.get("result") or {}
        response_text = result.get("response") or ""

        if not response_text:
            return {"success": False, "error": "No response returned from Granite API"}

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "response": response_text
            }
        }
    except Exception as e:
        return {"success": False, "error": "Failed to run Granite Chat completions"}
