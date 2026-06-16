import base64
import requests
import time
from bs4 import BeautifulSoup

def upload_eight_uploads(payload):
    image_data = payload.get("data") or payload.get("image") or payload.get("url") or ""
    if not image_data:
        return {"success": False, "error": "Missing required parameter: image or url"}

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    }

    is_url = image_data.startswith("http://") or image_data.startswith("https://")

    try:
        final_url = ""
        if is_url:
            # 1. URL upload mode
            post_url = "https://8upload.com/url.php"
            form_headers = headers.copy()
            form_headers["Referer"] = "https://8upload.com/url.php"
            
            data = {
                "image_url[]": image_data
            }
            res = requests.post(post_url, headers=form_headers, data=data, timeout=30)
            if res.status_code != 200:
                return {
                    "endpoint_id": "8uploads",
                    "success": False,
                    "error": f"Failed to upload URL (HTTP {res.status_code})"
                }
            landing_html = res.text
            final_url = res.url
        else:
            # 2. File upload mode
            if "," in image_data:
                image_data = image_data.split(",")[1]
            binary_data = base64.b64decode(image_data)
            
            upload_url = "https://8upload.com/upload/mt/"
            upload_headers = headers.copy()
            upload_headers["Referer"] = "https://8upload.com/index.php"
            upload_headers["X-Requested-With"] = "XMLHttpRequest"
            
            files = {
                "images[]": ("image.jpg", binary_data, "image/jpeg")
            }
            
            res = requests.post(upload_url, headers=upload_headers, files=files, timeout=30)
            if res.status_code != 200:
                return {
                    "endpoint_id": "8uploads",
                    "success": False,
                    "error": f"Failed to upload file (HTTP {res.status_code})"
                }
            
            fragment = res.text.strip().replace('"', '').replace('\\', '')
            if not fragment.startswith("/"):
                fragment = "/" + fragment
                
            final_url = "https://8upload.com" + fragment
            
            landing_res = requests.get(final_url, headers=headers, timeout=20)
            if landing_res.status_code != 200:
                return {
                    "endpoint_id": "8uploads",
                    "success": False,
                    "error": f"Failed to retrieve landing page (HTTP {landing_res.status_code})"
                }
            landing_html = landing_res.text

        # Parse HTML responses
        soup = BeautifulSoup(landing_html, 'html.parser')
        inputs = soup.find_all('input')
        
        direct_link = None
        view_link = None
        delete_link = None
        
        for inp in inputs:
            val = inp.get('value', '').strip()
            if not val:
                continue
            
            if val.startswith("https://i.8upload.com/") or val.startswith("http://i.8upload.com/"):
                direct_link = val
            elif val.startswith("https://8upload.com/view/") or val.startswith("http://8upload.com/view/"):
                view_link = val
            elif val.startswith("https://8upload.com/remove/") or val.startswith("http://8upload.com/remove/"):
                delete_link = val
                
        if not direct_link:
            for inp in inputs:
                val = inp.get('value', '')
                if "i.8upload.com" in val and not "<" in val and not "[" in val:
                    direct_link = val
                    break

        if direct_link:
            return {
                "endpoint_id": "8uploads",
                "success": True,
                "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
                "data": {
                    "link": direct_link,
                    "view_url": view_link or final_url,
                    "delete_url": delete_link
                }
            }
            
        return {
            "endpoint_id": "8uploads",
            "success": False,
            "error": "Failed to extract uploaded image link from landing page.",
            "details": f"Checked {len(inputs)} inputs. Final landing URL was {final_url}."
        }

    except Exception as e:
        return {
            "endpoint_id": "8uploads",
            "success": False,
            "error": f"Error executing 8upload process: {str(e)}"
        }
