import os
import requests
import time

def get_kimi_chat(payload):
    try:
        # Retrieve API Key from environment
        api_key = os.environ.get("NVIDIA_TOKEN") or os.environ.get("NVIDIA_API_KEY") or ""
        if not api_key:
            return {"success": False, "error": "API key is not configured in the server environment (.env)"}

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

        # Parse hyperparameters
        temperature = payload.get("temperature")
        if temperature is None:
            temperature = 1.00
        else:
            try:
                temperature = float(temperature)
            except ValueError:
                temperature = 1.00

        max_tokens = payload.get("max_tokens") or payload.get("max_completion_tokens")
        if max_tokens is None:
            max_tokens = 16384
        else:
            try:
                max_tokens = int(max_tokens)
            except ValueError:
                max_tokens = 16384

        top_p = payload.get("top_p")
        if top_p is None:
            top_p = 1.00
        else:
            try:
                top_p = float(top_p)
            except ValueError:
                top_p = 1.00

        model = payload.get("model") or "moonshotai/kimi-k2.6"
        if isinstance(model, list):
            model = model[0] if model else "moonshotai/kimi-k2.6"

        url = "https://integrate.api.nvidia.com/v1/chat/completions"

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

        # Build completions payload matching NVIDIA specifications for Kimi
        api_payload = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "top_p": top_p,
            "stream": False
        }

        session = requests.Session()
        r = session.post(url, json=api_payload, headers=headers, timeout=30)
        
        if r.status_code != 200:
            try:
                err_data = r.json()
                error_msg = err_data.get("error", {}).get("message") or "Failed to query Kimi API"
            except Exception:
                error_msg = r.text.strip() or "Failed to query Kimi API"
            return {"success": False, "error": f"Kimi API returned status code {r.status_code}: {error_msg}"}

        data = r.json()
        choices = data.get("choices", [])
        if not choices:
            return {"success": False, "error": "No completion choices returned from Kimi API"}

        assistant_message = choices[0].get("message", {})
        response_text = assistant_message.get("content") or ""
        
        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "response": response_text
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Failed to run Kimi Chat completions: {str(e)}"}
