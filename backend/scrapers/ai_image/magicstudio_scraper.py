import io
import time
import uuid
import requests

from flux_scraper import _upload_to_uguu, UGUU_HEADERS

URL = "https://ai-api.magicstudio.com/api/ai-art-generator"
CLIENT_ID = "pSgX7WgjukXCBoYwDM8G8GLnRRkvAoJlqa5eAVvj95o"

HEADERS = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9,id-ID;q=0.8,id;q=0.7",
    "origin": "https://magicstudio.com",
    "referer": "https://magicstudio.com/ai-art-generator/",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
    "sec-ch-ua": '"Google Chrome";v="149", "Chromium";v="149", "Not)A;Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
}


def get_magicstudio_image(payload):
    try:
        prompt = payload.get("prompt") or payload.get("text") or ""
        if isinstance(prompt, list):
            prompt = prompt[0] if prompt else ""
        if not prompt:
            return {"success": False, "error": "Missing required parameter: prompt"}

        anon_id = str(uuid.uuid4())
        timestamp = str(time.time())

        form_data = {
            "prompt": (None, prompt),
            "output_format": (None, "bytes"),
            "user_profile_id": (None, "null"),
            "anonymous_user_id": (None, anon_id),
            "request_timestamp": (None, timestamp),
            "user_is_subscribed": (None, "false"),
            "client_id": (None, CLIENT_ID),
        }

        r = requests.post(URL, files=form_data, headers=HEADERS, timeout=60)

        if r.status_code != 200:
            return {"success": False, "error": f"Magic Studio returned status code {r.status_code}"}

        # Response is raw JPEG bytes
        image_bytes = r.content
        if not image_bytes or len(image_bytes) < 100:
            return {"success": False, "error": "Empty image returned from Magic Studio"}

        # Upload to uguu
        try:
            filename = f"magicstudio_{int(time.time())}.jpg"
            upload_r = requests.post(
                "https://uguu.se/upload.php",
                files={"files[]": (filename, io.BytesIO(image_bytes), "image/jpeg")},
                headers=UGUU_HEADERS,
                timeout=45,
            )
            upload_r.raise_for_status()
            upload_data = upload_r.json()
            if upload_data.get("success") and upload_data.get("files"):
                image_url = upload_data["files"][0].get("url", "")
            else:
                raise Exception("Uguu upload failed")
        except Exception:
            import base64
            image_url = f"data:image/jpeg;base64,{base64.b64encode(image_bytes).decode()}"

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "image": image_url,
                "prompt": prompt,
            }
        }
    except Exception:
        return {"success": False, "error": "Failed to run Magic Studio image generation"}
