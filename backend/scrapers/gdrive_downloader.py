import re
import requests
from bs4 import BeautifulSoup

def extract_gdrive_id(url: str):
    patterns = [
        (r"drive\.google\.com/file/d/([a-zA-Z0-9_-]{25,50})", "file"),
        (r"drive\.google\.com/open\?id=([a-zA-Z0-9_-]{25,50})", "file"),
        (r"drive\.google\.com/uc\?id=([a-zA-Z0-9_-]{25,50})", "file"),
        (r"drive\.usercontent\.com/uc\?id=([a-zA-Z0-9_-]{25,50})", "file"),
        (r"docs\.google\.com/document/d/([a-zA-Z0-9_-]{25,50})", "document"),
        (r"docs\.google\.com/spreadsheets/d/([a-zA-Z0-9_-]{25,50})", "spreadsheet"),
        (r"docs\.google\.com/presentation/d/([a-zA-Z0-9_-]{25,50})", "presentation")
    ]
    for pattern, file_type in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1), file_type
    return None, None

def get_gdrive_title(file_id: str, file_type: str):
    if file_type == "file":
        url = f"https://drive.google.com/file/d/{file_id}/view"
    elif file_type == "document":
        url = f"https://docs.google.com/document/d/{file_id}/edit"
    elif file_type == "spreadsheet":
        url = f"https://docs.google.com/spreadsheets/d/{file_id}/edit"
    else:
        url = f"https://docs.google.com/presentation/d/{file_id}/edit"
        
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "html.parser")
            og_title = soup.find("meta", property="og:title")
            if og_title and og_title.get("content"):
                return og_title.get("content")
            title_tag = soup.find("title")
            if title_tag:
                t = title_tag.text.strip()
                if t.endswith(" - Google Drive"):
                    t = t[:-15]
                elif t.endswith(" - Google Docs"):
                    t = t[:-14]
                elif t.endswith(" - Google Sheets"):
                    t = t[:-16]
                elif t.endswith(" - Google Slides"):
                    t = t[:-16]
                return t
    except Exception:
        pass
    
    type_labels = {
        "file": "Google Drive File",
        "document": "Google Doc Document",
        "spreadsheet": "Google Sheet Spreadsheet",
        "presentation": "Google Slides Presentation"
    }
    return type_labels.get(file_type, "Google Drive File")

def download_gdrive(payload):
    url = payload.get("url") or payload.get("URLT") or payload.get("image")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }
        
    file_id, file_type = extract_gdrive_id(url)
    if not file_id:
        return {
            "success": False,
            "error": "Could not extract a valid Google Drive file or document ID from the URL."
        }
        
    title = get_gdrive_title(file_id, file_type)
    
    links = []
    
    if file_type == "file":
        # Direct usercontent link
        direct_url = f"https://drive.usercontent.com/uc?id={file_id}&export=download"
        links.append({
            "label": "DOWNLOAD FILE (Direct Link)",
            "url": direct_url
        })
        # Alternative uc download link
        links.append({
            "label": "DOWNLOAD FILE (Alternative Link)",
            "url": f"https://drive.google.com/uc?id={file_id}&export=download"
        })
    elif file_type == "document":
        links.append({
            "label": "EXPORT AS DOCX (Word Document)",
            "url": f"https://docs.google.com/document/d/{file_id}/export?format=docx"
        })
        links.append({
            "label": "EXPORT AS PDF (Acrobat PDF)",
            "url": f"https://docs.google.com/document/d/{file_id}/export?format=pdf"
        })
        links.append({
            "label": "EXPORT AS ODT (OpenDocument)",
            "url": f"https://docs.google.com/document/d/{file_id}/export?format=odt"
        })
    elif file_type == "spreadsheet":
        links.append({
            "label": "EXPORT AS XLSX (Excel Spreadsheet)",
            "url": f"https://docs.google.com/spreadsheets/d/{file_id}/export?format=xlsx"
        })
        links.append({
            "label": "EXPORT AS PDF (Acrobat PDF)",
            "url": f"https://docs.google.com/spreadsheets/d/{file_id}/export?format=pdf"
        })
        links.append({
            "label": "EXPORT AS ODS (OpenDocument)",
            "url": f"https://docs.google.com/spreadsheets/d/{file_id}/export?format=ods"
        })
    elif file_type == "presentation":
        links.append({
            "label": "EXPORT AS PPTX (PowerPoint Presentation)",
            "url": f"https://docs.google.com/presentation/d/{file_id}/export?format=pptx"
        })
        links.append({
            "label": "EXPORT AS PDF (Acrobat PDF)",
            "url": f"https://docs.google.com/presentation/d/{file_id}/export?format=pdf"
        })
        links.append({
            "label": "EXPORT AS ODP (OpenDocument)",
            "url": f"https://docs.google.com/presentation/d/{file_id}/export?format=odp"
        })
        
    return {
        "success": True,
        "data": {
            "title": title,
            "creator": "Google Drive",
            "description": f"Extracted direct download / export links for Google Drive resource ID: {file_id}",
            "cover": "https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg",
            "links": links
        }
    }
