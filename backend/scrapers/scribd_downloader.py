import re
import uuid
import os
import io
try:
    from PIL import Image
except ImportError:
    Image = None
try:
    from curl_cffi import requests
except ImportError:
    import requests
from bs4 import BeautifulSoup

def download_scribd(payload):
    url = payload.get("url")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }

    # Extract ID
    match = re.search(r'/(?:document|doc|embeds)/(\d+)', url)
    if not match:
        match = re.search(r'\b(\d{8,12})\b', url)
    if not match:
        return {
            "success": False,
            "error": "Could not extract Scribd Document ID from the provided URL"
        }
        
    doc_id = match.group(1)
    embed_url = f"https://www.scribd.com/embeds/{doc_id}/content?start_page=1&view_mode=scroll"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    try:
        try:
            resp = requests.get(embed_url, headers=headers, impersonate="chrome120", timeout=10)
        except TypeError:
            resp = requests.get(embed_url, headers=headers, timeout=10)
            
        if resp.status_code != 200:
            return {
                "success": False,
                "error": f"Scribd returned status code {resp.status_code}"
            }
        html = resp.text
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to retrieve Scribd embed content: {str(e)}"
        }
        
    # Extract Title
    soup = BeautifulSoup(html, "html.parser")
    title = None
    title_tag = soup.find("title")
    if title_tag:
        title = title_tag.text.strip()
    if not title or title.lower() == "scribd":
        title_match = re.search(r'"title"\s*:\s*"([^"]+)"', html)
        if title_match:
            try:
                title = title_match.group(1).encode().decode('unicode-escape', errors='ignore')
            except Exception:
                title = title_match.group(1)
    if not title or title.lower() == "scribd":
        title = f"Scribd Document {doc_id}"
        
    # Extract page images from orig attributes
    raw_urls = re.findall(r'orig="([^"]+html\.scribd\.com/[^"]+)"|orig="([^"]+scribdassets\.com/[^"]+)"', html)
    
    cleaned_urls = []
    seen_sigs = set()
    
    for match_group in raw_urls:
        u = match_group[0] or match_group[1]
        u = u.replace('\\/', '/')
        # Use secure https protocol for direct stream
        if u.startswith("http://"):
            u = "https://" + u[7:]
            
        filename = u.split('/')[-1]
        name_parts = filename.split('-')
        if len(name_parts) >= 2:
            sig = name_parts[1].split('.')[0]
        else:
            sig = filename
            
        # Ignore blurry overlay placeholder images (typically .png) or duplicated signatures
        if filename.endswith(".png") or sig in seen_sigs:
            continue
            
        seen_sigs.add(sig)
        cleaned_urls.append(u)
        
    if not cleaned_urls:
        # Check if the document was deleted
        if "deleted by owner" in html.lower() or "can't display this document" in html.lower():
            return {
                "success": False,
                "error": "This Scribd document has been deleted by its owner."
            }
        return {
            "success": False,
            "error": "No downloadable pages found on the provided Scribd document page."
        }

    # Optional: Generate PDF if metadata is provided and Pillow is available
    req_host = payload.get("_reqHost")
    req_protocol = payload.get("_protocol", "https")
    pdf_url = None
    
    if Image and req_host:
        try:
            pdf_filename = f"{re.sub(r'[^a-zA-Z0-9_-]', '_', title)[:60]}.pdf"
            pdf_id = str(uuid.uuid4())
            downloads_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "downloads", pdf_id))
            os.makedirs(downloads_dir, exist_ok=True)
            pdf_path = os.path.join(downloads_dir, pdf_filename)
            
            pdf_images = []
            for img_url in cleaned_urls:
                try:
                    r = requests.get(img_url, timeout=10)
                    if r.status_code == 200:
                        img = Image.open(io.BytesIO(r.content)).convert("RGB")
                        pdf_images.append(img)
                except Exception:
                    continue
            
            if pdf_images:
                pdf_images[0].save(pdf_path, save_all=True, append_images=pdf_images[1:])
                pdf_url = f"{req_protocol}://{req_host}/api/downloads/{pdf_id}/{pdf_filename}"
        except Exception:
            pass

    links = []
    if pdf_url:
        links.append({
            "label": "DOWNLOAD FULL DOCUMENT (PDF)",
            "url": pdf_url
        })
        
    for idx, img_url in enumerate(cleaned_urls):
        links.append({
            "label": f"DOWNLOAD PAGE {idx + 1} (Original Quality)",
            "url": img_url
        })
        
    cover_image = cleaned_urls[0] if cleaned_urls else "https://www.scribd.com/favicon.ico"

    return {
        "success": True,
        "data": {
            "title": title,
            "creator": "Scribd",
            "description": f"Extracted {len(cleaned_urls)} pages as PDF and original quality images from Scribd Document ID {doc_id}",
            "cover": cover_image,
            "links": links
        }
    }
