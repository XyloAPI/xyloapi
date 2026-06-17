import re
import os
import urllib.parse
try:
    from curl_cffi import requests
except ImportError:
    import requests
from bs4 import BeautifulSoup

def download_sfile(payload):
    url = payload.get("url")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }

    # Normalize url (allow sfile.mobi and sfile.co)
    if "sfile.mobi" in url:
        url = url.replace("sfile.mobi", "sfile.co")
    if not url.startswith("http"):
        url = "https://" + url

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    session = requests.Session()

    # 1. Fetch main page
    try:
        try:
            resp = session.get(url, headers=headers, impersonate="chrome120", timeout=12)
        except TypeError:
            resp = session.get(url, headers=headers, timeout=12)

        if resp.status_code != 200:
            return {
                "success": False,
                "error": f"Failed to access sfile landing page (Status: {resp.status_code})"
            }
        html_first = resp.text
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to retrieve sfile page: {str(e)}"
        }

    soup_first = BeautifulSoup(html_first, "html.parser")
    
    # Extract metadata from first page
    first_text = soup_first.get_text()
    
    uploaded = "Unknown"
    uploaded_match = re.search(r'Uploaded:\s*([^\n\r]+)', first_text)
    if uploaded_match:
        uploaded = uploaded_match.group(1).strip()

    downloads = "0"
    downloads_match = re.search(r'Downloads:\s*([^\n\r]+)', first_text)
    if downloads_match:
        downloads = downloads_match.group(1).strip()

    file_type = "Unknown"
    # Often sfile has file type like image/jpeg, application/zip, etc. in a list or div
    # Let's search for common MIME patterns
    mime_match = re.search(r'\b([a-zA-Z0-9\-]+/[a-zA-Z0-9\-+.]+)\b', first_text)
    if mime_match:
        file_type = mime_match.group(1).strip()

    download_btn = soup_first.find(id="download")
    if not download_btn:
        return {
            "success": False,
            "error": "Could not find download button on sfile page. The file might have been deleted."
        }

    dw_url = download_btn.get("data-dw-url")
    if not dw_url:
        # Fallback to standard href if data-dw-url isn't present
        dw_url = download_btn.get("href")
        if not dw_url or dw_url == "#":
            return {
                "success": False,
                "error": "Could not find intermediate download page URL."
            }

    # 2. Fetch the intermediate page
    headers["Referer"] = url
    try:
        try:
            resp_dw = session.get(dw_url, headers=headers, impersonate="chrome120", timeout=12)
        except TypeError:
            resp_dw = session.get(dw_url, headers=headers, timeout=12)

        if resp_dw.status_code != 200:
            return {
                "success": False,
                "error": f"Failed to access intermediate download page (Status: {resp_dw.status_code})"
            }
        html_dw = resp_dw.text
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to retrieve download page: {str(e)}"
        }

    # Extract direct download link using regex search for adblock fallback in scripts
    direct_link_match = re.search(r'https?:\\?/\\?/download[^.]+\.sfile\.co\\?/downloadfile\\?/[^"]+', html_dw)
    if not direct_link_match:
        return {
            "success": False,
            "error": "Could not extract direct download link from sfile download page."
        }

    direct_url = direct_link_match.group(0).replace('\\/', '/')

    # Parse filename from direct download link path
    filename = "downloaded_file"
    try:
        parsed_path = urllib.parse.urlparse(direct_url).path
        filename = os.path.basename(parsed_path)
    except Exception:
        pass

    # Extract file size from button text on the second page
    soup_dw = BeautifulSoup(html_dw, "html.parser")
    dw_btn_second = soup_dw.find(id="download")
    size_str = "Unknown"
    if dw_btn_second:
        btn_text = dw_btn_second.get_text()
        size_match = re.search(r'\(([^)]+)\)', btn_text)
        if size_match:
            size_str = size_match.group(1).strip()

    # Deduce clean title
    title = filename if filename != "downloaded_file" else "sfile Download"

    return {
        "success": True,
        "data": {
            "title": title,
            "creator": "sfile.co",
            "description": f"File Name: {filename} | Size: {size_str} | Downloads: {downloads} | Uploaded: {uploaded}",
            "cover": "https://sfile.co/favicon.ico",
            "links": [
                {
                    "label": f"DOWNLOAD FILE ({size_str})",
                    "url": direct_url
                }
            ],
            "metadata": {
                "filename": filename,
                "filesize": size_str,
                "filetype": file_type,
                "downloads": downloads,
                "uploaded": uploaded
            }
        }
    }
