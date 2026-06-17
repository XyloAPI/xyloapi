import os
import sys
import uuid
import shutil
import re
from mega import Mega

def download_mega(payload):
    url = payload.get("url") or payload.get("URLT") or payload.get("image")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }
        
    url = url.strip()
    
    # Simple regex to check MEGA URL format
    # E.g. https://mega.nz/file/... or https://mega.nz/folder/...
    if not ("mega.nz" in url or "mega.co.nz" in url):
        return {
            "success": False,
            "error": "Invalid MEGA URL. Must be a mega.nz link."
        }
        
    # We create a unique temporary folder in the downloads directory
    base_downloads_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "downloads")
    os.makedirs(base_downloads_dir, exist_ok=True)
    
    unique_id = str(uuid.uuid4())
    dest_path = os.path.join(base_downloads_dir, unique_id)
    os.makedirs(dest_path, exist_ok=True)
    
    mega = Mega()
    try:
        m = mega.login()
        # Fetch public url info without downloading to verify
        # E.g. to get filename
        info = m.get_public_url_info(url)
        filename = info.get("name") if info else None
        
        # Download the file to our target unique path
        # mega.py download method will decrypt the file automatically
        output_file_path = m.download_url(url, dest_path=dest_path)
        
        # Determine actual file name and path
        if output_file_path and os.path.exists(output_file_path):
            filename = os.path.basename(output_file_path)
            
            return {
                "success": True,
                "data": {
                    "title": filename,
                    "creator": "MEGA",
                    "description": f"Successfully decrypted and resolved MEGA file: {filename}",
                    "cover": "https://mega.nz/favicon.ico",
                    "file_id": unique_id,
                    "filename": filename,
                    "links": [] # Express will populate this dynamically with the stream URL
                }
            }
        else:
            # Clean up directory on failure
            shutil.rmtree(dest_path, ignore_errors=True)
            return {
                "success": False,
                "error": "Failed to download and decrypt the MEGA file."
            }
            
    except Exception as e:
        shutil.rmtree(dest_path, ignore_errors=True)
        return {
            "success": False,
            "error": f"MEGA decryption error: {str(e)}"
        }
