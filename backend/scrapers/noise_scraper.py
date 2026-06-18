import base64
import requests
import io
import time
import os
import numpy as np
from PIL import Image

try:
    from uguu_uploader import upload_uguu
except ImportError:
    import sys
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    from uguu_uploader import upload_uguu

def get_noised_image(payload):
    image_data = payload.get("image") or payload.get("url") or payload.get("data") or ""
    if not image_data:
        return {"success": False, "error": "Missing required parameter: image or url"}

    amount = payload.get("amount")
    if amount is None:
        amount = 20
    try:
        amount = max(0, min(100, float(amount)))
    except:
        amount = 20

    noise_type = str(payload.get("noise_type") or "gaussian").strip().lower()
    if noise_type not in ["gaussian", "uniform", "salt_and_pepper", "salt-and-pepper"]:
        noise_type = "gaussian"
    if noise_type == "salt-and-pepper":
        noise_type = "salt_and_pepper"

    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    })

    # 1. Fetch image bytes from URL or Base64
    try:
        is_url = image_data.startswith("http://") or image_data.startswith("https://")
        if is_url:
            r_img = session.get(image_data, timeout=15)
            if r_img.status_code != 200:
                return {"success": False, "error": f"Failed to download image from URL. Status code: {r_img.status_code}"}
            img_bytes = r_img.content
        else:
            if "," in image_data:
                image_data = image_data.split(",")[1]
            img_bytes = base64.b64decode(image_data)
    except Exception as e:
        return {"success": False, "error": f"Failed to retrieve image data: {str(e)}"}

    # 2. Add noise
    try:
        img = Image.open(io.BytesIO(img_bytes))
        width, height = img.size

        img_arr = np.array(img).astype(np.float32)

        if noise_type == "gaussian":
            std = (amount / 100.0) * 128.0
            noise = np.random.normal(0, std, img_arr.shape)
            if img_arr.shape[-1] == 4:
                img_arr[..., :3] += noise[..., :3]
            else:
                img_arr += noise
        elif noise_type == "uniform":
            limit = (amount / 100.0) * 127.5
            noise = np.random.uniform(-limit, limit, img_arr.shape)
            if img_arr.shape[-1] == 4:
                img_arr[..., :3] += noise[..., :3]
            else:
                img_arr += noise
        elif noise_type == "salt_and_pepper":
            prob = (amount / 100.0) * 0.5
            random_matrix = np.random.random(img_arr.shape[:2])
            salt_mask = random_matrix < (prob / 2.0)
            pepper_mask = (random_matrix >= (prob / 2.0)) & (random_matrix < prob)
            
            if img_arr.shape[-1] == 4:
                img_arr[salt_mask, :3] = 255
                img_arr[pepper_mask, :3] = 0
            else:
                img_arr[salt_mask] = 255
                img_arr[pepper_mask] = 0

        img_arr = np.clip(img_arr, 0, 255).astype(np.uint8)
        res_img = Image.fromarray(img_arr)

        out_buf = io.BytesIO()
        # Preserve original format or default to PNG/JPEG
        fmt = img.format if img.format else "PNG"
        res_img.save(out_buf, format=fmt)
        noised_bytes = out_buf.getvalue()
    except Exception as e:
        return {"success": False, "error": f"Failed to add noise to image: {str(e)}"}

    # 3. Upload noised image to Uguu.se
    uguu_noised_url = None
    try:
        mime = "image/png" if fmt.lower() == "png" else "image/jpeg"
        b64_str = f"data:{mime};base64," + base64.b64encode(noised_bytes).decode('utf-8')
        uguu_res = upload_uguu({"image": b64_str})
        if uguu_res.get("success"):
            uguu_noised_url = uguu_res.get("data", {}).get("link")
    except:
        pass

    if not uguu_noised_url:
        return {"success": False, "error": "Failed to upload processed image to CDN"}

    # 4. Upload original image to Uguu.se
    uguu_original_url = None
    try:
        original_b64 = "data:image/jpeg;base64," + base64.b64encode(img_bytes).decode('utf-8')
        original_res = upload_uguu({"image": original_b64})
        if original_res.get("success"):
            uguu_original_url = original_res.get("data", {}).get("link")
    except:
        pass

    original_url = uguu_original_url
    if not original_url and is_url:
        original_url = image_data

    return {
        "success": True,
        "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "data": {
            "url": uguu_noised_url,
            "original": original_url,
            "width": width,
            "height": height,
        }
    }
