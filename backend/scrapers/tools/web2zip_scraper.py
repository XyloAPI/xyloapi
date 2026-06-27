import time
import io
import urllib.parse
import string
import random
import requests

def _upload_to_filebin(binary: bytes, filename: str) -> str:
    # Generate a random bin_id (16 chars alphanumeric lowercase)
    bin_id = "xyloapi" + "".join(random.choices(string.ascii_lowercase + string.digits, k=10))
    url = f"https://filebin.net/{bin_id}/{filename}"
    headers = {
        "Content-Type": "application/zip",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    res = requests.post(url, data=binary, headers=headers, timeout=60)
    res.raise_for_status()
    return url

def copy_site(payload):
    """
    Clone a website using SaveWeb2Zip copier API and upload the renamed ZIP archive to Filebin.
    """
    url = payload.get("url") or payload.get("link")
    if not url:
        return {"success": False, "error": "Missing required parameter: url"}
        
    rename_assets = True
    save_structure = True
    alternative_algorithm = True
    mobile_version = True

    headers = {
        "Content-Type": "application/json",
        "Origin": "https://saveweb2zip.com",
        "Referer": "https://saveweb2zip.com/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    post_payload = {
        "url": url,
        "renameAssets": rename_assets,
        "saveStructure": save_structure,
        "alternativeAlgorithm": alternative_algorithm,
        "mobileVersion": mobile_version
    }
    
    try:
        # Start the copying process
        r = requests.post("https://copier.saveweb2zip.com/api/copySite", json=post_payload, headers=headers, timeout=30)
        if r.status_code != 200:
            return {"success": False, "error": f"Cloner service returned status code {r.status_code}"}
            
        initial_data = r.json()
        if not initial_data.get("success"):
            error_text = initial_data.get("errorText") or "Unknown clone initiation error"
            return {"success": False, "error": f"Failed to initiate site clone: {error_text}"}
            
        md5_hash = initial_data.get("md5")
        if not md5_hash:
            return {"success": False, "error": "No MD5 identifier returned from cloner"}
            
        # Poll status until finished
        is_finished = initial_data.get("isFinished", False)
        attempts = 0
        max_attempts = 45  # Up to ~90 seconds
        
        status_data = initial_data
        while not is_finished and attempts < max_attempts:
            time.sleep(2)
            attempts += 1
            status_res = requests.get(f"https://copier.saveweb2zip.com/api/getStatus/{md5_hash}", headers=headers, timeout=15)
            if status_res.status_code == 200:
                status_data = status_res.json()
                is_finished = status_data.get("isFinished", False)
            else:
                # If getStatus fails, continue trying
                pass
                
        if not is_finished:
            return {"success": False, "error": "Site cloning timed out on saveweb2zip side"}
            
        if not status_data.get("success"):
            error_text = status_data.get("errorText") or "Cloner processing failed"
            return {"success": False, "error": f"Cloner error: {error_text}"}
            
        # Download ZIP archive
        download_url = f"https://copier.saveweb2zip.com/api/downloadArchive/{md5_hash}"
        zip_res = requests.get(download_url, headers=headers, timeout=60)
        if zip_res.status_code != 200:
            return {"success": False, "error": "Failed to download ZIP archive from cloner"}
            
        zip_bytes = zip_res.content
        
        # Sanitize target URL to build a clean filename (avoid saveweb2zip signature)
        parsed = urllib.parse.urlparse(url)
        domain = parsed.netloc.replace("www.", "") or "site"
        domain_clean = "".join([c for c in domain if c.isalnum() or c in ".-_"])
        custom_filename = f"cloned_{domain_clean}_{int(time.time())}.zip"
        
        # Upload to Filebin with custom renamed filename
        try:
            filebin_url = _upload_to_filebin(zip_bytes, custom_filename)
        except Exception as e:
            return {"success": False, "error": f"Failed to upload zip archive to Filebin: {str(e)}"}
            
        # Calculate pretty size
        size_bytes = len(zip_bytes)
        if size_bytes < 1024 * 1024:
            size_str = f"{size_bytes / 1024:.2f} KB"
        else:
            size_str = f"{size_bytes / (1024 * 1024):.2f} MB"
            
        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "url": url,
                "download": filebin_url,
                "filename": custom_filename,
                "size": size_str,
                "copied_files": status_data.get("copiedFilesAmount", 0)
            }
        }
        
    except Exception as e:
        return {"success": False, "error": f"Error during site cloning: {str(e)}"}
