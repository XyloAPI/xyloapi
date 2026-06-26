import os
import requests
import time


def get_deepseek_r1_chat(payload):
    try:
        account_id = os.environ.get("CF_ACCOUNT_ID") or ""
        auth_token = os.environ.get("CF_TOKEN") or ""

        if not account_id:
            return {"success": False, "error": "CF_ACCOUNT_ID is not configured in the server environment (.env)"}
        if not auth_token:
            return {"success": False, "error": "CF_TOKEN is not configured in the server environment (.env)"}

        messages = payload.get("messages")

        if not messages:
            prompt = payload.get("prompt") or payload.get("message") or payload.get("text") or ""
            if isinstance(prompt, list):
                prompt = prompt[0] if prompt else ""
            if not prompt:
                return {"success": False, "error": "Missing required parameter: prompt or messages"}

            system = payload.get("system") or "You are a helpful assistant"
            messages = [
                {"role": "system", "content": system},
                {"role": "user", "content": prompt},
            ]

        model = payload.get("model") or "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b"
        if isinstance(model, list):
            model = model[0] if model else "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b"

        url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/{model}"

        headers = {
            "Authorization": f"Bearer {auth_token}",
            "Content-Type": "application/json",
        }

        r = requests.post(url, json={"messages": messages}, headers=headers, timeout=90)

        if r.status_code != 200:
            try:
                err_data = r.json()
                error_msg = err_data.get("errors", [{}])[0].get("message") or "Failed to query DeepSeek R1 API"
            except Exception:
                error_msg = r.text.strip() or "Failed to query DeepSeek R1 API"
            return {"success": False, "error": f"DeepSeek R1 API returned status code {r.status_code}: {error_msg}"}

        data = r.json()
        result = data.get("result") or {}

        # Try OpenAI-style first (choices[0].message.content)
        choices = result.get("choices") or []
        response_text = ""
        reasoning = ""
        if choices:
            msg = choices[0].get("message") or {}
            response_text = msg.get("content") or ""
            reasoning = msg.get("reasoning") or msg.get("reasoning_content") or ""
        # Fallback to result.response
        if not response_text:
            response_text = result.get("response") or ""

        # Extract <think>...</think> block into reasoning field
        import re
        think_match = re.search(r'<think>(.*?)</think>', response_text, re.DOTALL)
        if think_match:
            if not reasoning:
                reasoning = think_match.group(1).strip()
            response_text = re.sub(r'<think>.*?</think>', '', response_text, flags=re.DOTALL).strip()

        if not response_text:
            return {"success": False, "error": "No response returned from DeepSeek R1 API"}

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "response": response_text,
                "reasoning": reasoning,
            }
        }
    except Exception:
        return {"success": False, "error": "Failed to run DeepSeek R1 Chat completions"}
