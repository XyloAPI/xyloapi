import base64
import requests
import io
import time
import os
import hashlib
from PIL import Image

try:
    from uguu_uploader import upload_uguu
except ImportError:
    import sys
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    from uguu_uploader import upload_uguu

# Load environment variables in case of direct execution
def load_dotenv():
    possible_paths = [
        os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env'),
        os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env'),
        os.path.join(os.getcwd(), 'backend', '.env'),
        os.path.join(os.getcwd(), '.env'),
    ]
    for path in possible_paths:
        if os.path.exists(path):
            try:
                with open(path, 'r') as f:
                    for line in f:
                        line = line.strip()
                        if not line or line.startswith('#'):
                            continue
                        if '=' in line:
                            key, val = line.split('=', 1)
                            val = val.strip().strip('"').strip("'")
                            os.environ[key.strip()] = val
                break
            except:
                pass

load_dotenv()

def generate_cloudinary_signature(params, api_secret):
    sorted_params = sorted(params.items())
    param_string = "&".join(f"{k}={v}" for k, v in sorted_params)
    to_sign = param_string + api_secret
    return hashlib.sha1(to_sign.encode('utf-8')).hexdigest()

def get_enhanced_image(payload):
    image_data = payload.get("image") or payload.get("url") or payload.get("data") or ""
    if not image_data:
        return {"success": False, "error": "Missing required parameter: image or url"}

    cloud_name = os.environ.get("CLOUDINARY_CLOUD_NAME")
    api_key = os.environ.get("CLOUDINARY_API_KEY")
    api_secret = os.environ.get("CLOUDINARY_API_SECRET")

    if not cloud_name or not api_key or not api_secret:
        return {
            "success": False,
            "error": "Missing Cloudinary configuration in backend environment variables."
        }

    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    })

    # 1. Prepare file upload parameter (URL or Base64 Data URI)
    is_url = image_data.startswith("http://") or image_data.startswith("https://")
    
    # Cloudinary upload endpoint
    upload_url = f"https://api.cloudinary.com/v1_1/{cloud_name}/image/upload"

    try:
        timestamp = int(time.time())
        params_to_sign = {"timestamp": str(timestamp)}
        signature = generate_cloudinary_signature(params_to_sign, api_secret)

        # Prepare file source
        file_param = image_data
        if not is_url:
            if "," not in image_data:
                # Assuming raw base64, detect or default to png
                file_param = f"data:image/png;base64,{image_data}"

        upload_data = {
            "api_key": api_key,
            "timestamp": str(timestamp),
            "signature": signature,
            "file": file_param
        }

        # 2. Upload to Cloudinary
        r_upload = session.post(upload_url, data=upload_data, timeout=30)
        if r_upload.status_code != 200:
            return {
                "success": False,
                "error": f"Failed to upload image to Cloudinary. Status: {r_upload.status_code}, Detail: {r_upload.text}"
            }
        
        upload_resp = r_upload.json()
        public_id = upload_resp.get("public_id")
        version = upload_resp.get("version")
        img_format = upload_resp.get("format")
        width = upload_resp.get("width")
        height = upload_resp.get("height")

        if not public_id:
            return {"success": False, "error": "Cloudinary upload response is missing public_id."}

    except Exception as e:
        return {"success": False, "error": f"Cloudinary upload failed: {str(e)}"}

    # 3. Construct AI Enhance Transformation URL and download the enhanced image bytes
    enhanced_bytes = None
    transformed_url = f"https://res.cloudinary.com/{cloud_name}/image/upload/e_enhance/v{version}/{public_id}.{img_format}"
    
    try:
        r_enhanced = session.get(transformed_url, timeout=20)
        if r_enhanced.status_code == 200:
            enhanced_bytes = r_enhanced.content
        else:
            err_msg = r_enhanced.headers.get("x-cld-error") or f"Status code: {r_enhanced.status_code}"
            # Clean up uploaded image before returning error
            try:
                destroy_timestamp = int(time.time())
                destroy_params = {"public_id": public_id, "timestamp": str(destroy_timestamp)}
                destroy_sig = generate_cloudinary_signature(destroy_params, api_secret)
                session.post(
                    f"https://api.cloudinary.com/v1_1/{cloud_name}/image/destroy",
                    data={
                        "public_id": public_id,
                        "timestamp": str(destroy_timestamp),
                        "api_key": api_key,
                        "signature": destroy_sig
                    },
                    timeout=10
                )
            except:
                pass
            return {"success": False, "error": f"Cloudinary transformation failed: {err_msg}"}
    except Exception as e:
        return {"success": False, "error": f"Failed to retrieve transformed image: {str(e)}"}

    # 4. Clean up / Delete uploaded image from Cloudinary
    try:
        destroy_timestamp = int(time.time())
        destroy_params = {"public_id": public_id, "timestamp": str(destroy_timestamp)}
        destroy_sig = generate_cloudinary_signature(destroy_params, api_secret)
        session.post(
            f"https://api.cloudinary.com/v1_1/{cloud_name}/image/destroy",
            data={
                "public_id": public_id,
                "timestamp": str(destroy_timestamp),
                "api_key": api_key,
                "signature": destroy_sig
            },
            timeout=10
        )
    except:
        pass

    # 5. Upload processed image to Uguu.se
    uguu_processed_url = None
    try:
        mime = "image/png" if img_format.lower() == "png" else "image/jpeg"
        b64_str = f"data:{mime};base64," + base64.b64encode(enhanced_bytes).decode('utf-8')
        uguu_res = upload_uguu({"image": b64_str})
        if uguu_res.get("success"):
            uguu_processed_url = uguu_res.get("data", {}).get("link")
    except:
        pass

    if not uguu_processed_url:
        return {"success": False, "error": "Failed to upload processed image to CDN"}

    # 6. Upload original image (or use original URL if it was a URL input)
    uguu_original_url = None
    if is_url:
        uguu_original_url = image_data
    else:
        try:
            original_res = upload_uguu({"image": image_data})
            if original_res.get("success"):
                uguu_original_url = original_res.get("data", {}).get("link")
        except:
            pass

    return {
        "success": True,
        "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "data": {
            "url": uguu_processed_url,
            "original": uguu_original_url or image_data,
            "width": width,
            "height": height,
        }
    }
