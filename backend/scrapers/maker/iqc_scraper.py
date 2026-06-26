import io
import time
import requests

UGUU_URL = "https://uguu.se/upload.php"

def _upload_to_uguu(binary: bytes) -> str:
    filename = f"iphone_quoted_{int(time.time())}.png"
    res = requests.post(
        UGUU_URL,
        files={"files[]": (filename, io.BytesIO(binary), "image/png")},
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        timeout=45,
    )
    res.raise_for_status()
    data = res.json()
    if data.get("success") and data.get("files"):
        return data["files"][0].get("url", "")
    raise Exception("Uguu upload failed")

def generate_iphone_quoted(payload):
    try:
        text = payload.get("text") or payload.get("prompt") or payload.get("messageText") or payload.get("message") or ""
        if isinstance(text, list):
            text = text[0] if text else ""
        if not text:
            return {"success": False, "error": "Missing required parameter: text / prompt"}

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }

        # Make the request directly to the new provider endpoint
        url = "https://api-faa.my.id/faa/iqc"
        params = {
            "prompt": text
        }

        res = requests.get(url, params=params, headers=headers, timeout=60)

        # Bubble error if the provider fails
        if res.status_code != 200:
            try:
                err_data = res.json()
                err_msg = err_data.get("message") or err_data.get("error") or "Unknown error"
                return {
                    "success": False,
                    "error": f"Third-party provider error ({res.status_code}): {err_msg}"
                }
            except Exception:
                return {
                    "success": False,
                    "error": f"Third-party provider returned status code {res.status_code}"
                }

        # Retrieve the image binary
        image_bytes = res.content

        # Upload the generated image to Uguu
        try:
            image_url = _upload_to_uguu(image_bytes)
        except Exception:
            import base64
            b64 = base64.b64encode(image_bytes).decode("utf-8")
            image_url = f"data:image/png;base64,{b64}"

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "image": image_url,
                "text": text
            }
        }

    except Exception as e:
        return {"success": False, "error": f"Failed to run iPhone Quoted scraper: {str(e)}"}
