import os
import requests
import time


def get_mistral_chat(payload):
    try:
        api_key = os.environ.get("MISTRAL_API_KEY") or ""
        if not api_key:
            return {"success": False, "error": "MISTRAL_API_KEY is not configured in the server environment (.env)"}

        # Parse messages
        messages = payload.get("messages")

        # Fallback to single prompt/message if messages array is not provided
        if not messages:
            prompt = payload.get("prompt") or payload.get("message") or payload.get("text") or ""
            if isinstance(prompt, list):
                prompt = prompt[0] if prompt else ""

            if not prompt:
                return {"success": False, "error": "Missing required parameter: prompt or messages"}

            messages = [{"role": "user", "content": prompt}]

        # System instructions (optional)
        instructions = payload.get("instructions") or payload.get("system") or ""
        if instructions:
            messages = [{"role": "system", "content": instructions}] + [
                m for m in messages if m.get("role") != "system"
            ]

        # Parse hyperparameters
        temperature = payload.get("temperature")
        if temperature is None:
            temperature = 0.7
        else:
            try:
                temperature = float(temperature)
            except ValueError:
                temperature = 0.7

        max_tokens = payload.get("max_tokens") or payload.get("max_completion_tokens")
        if max_tokens is None:
            max_tokens = 2048
        else:
            try:
                max_tokens = int(max_tokens)
            except ValueError:
                max_tokens = 2048

        top_p = payload.get("top_p")
        if top_p is None:
            top_p = 1.0
        else:
            try:
                top_p = float(top_p)
            except ValueError:
                top_p = 1.0

        model = payload.get("model") or "mistral-medium-latest"
        if isinstance(model, list):
            model = model[0] if model else "mistral-medium-latest"

        url = "https://api.mistral.ai/v1/chat/completions"

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

        api_payload = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "top_p": top_p
        }

        session = requests.Session()
        r = session.post(url, json=api_payload, headers=headers, timeout=90)

        if r.status_code != 200:
            try:
                err_data = r.json()
                error_msg = err_data.get("message") or err_data.get("error", {}).get("message") or "Failed to query Mistral API"
            except Exception:
                error_msg = r.text.strip() or "Failed to query Mistral API"
            return {"success": False, "error": f"Mistral API returned status code {r.status_code}: {error_msg}"}

        data = r.json()
        choices = data.get("choices", [])
        if not choices:
            return {"success": False, "error": "No completion choices returned from Mistral API"}

        response_text = choices[0].get("message", {}).get("content") or ""

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "response": response_text
            }
        }
    except Exception as e:
        return {"success": False, "error": "Failed to run Mistral Chat completions"}
