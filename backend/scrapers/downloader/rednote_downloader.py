import requests

def download_rednote(payload):
    url = payload.get("url")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }

    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        api_url = "https://www.rednote-downloader.com/api/extract"
        req_payload = {
            "url": url,
            "retryCount": 1
        }
        resp = requests.post(api_url, json=req_payload, headers=headers, timeout=15)
        
        if resp.status_code != 200:
            return {
                "success": False,
                "error": f"RedNote API returned status code {resp.status_code}"
            }
            
        data = resp.json()
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to connect to RedNote extraction service: {str(e)}"
        }

    title = data.get("title") or "RedNote / Xiaohongshu Post"
    video_url = data.get("videoUrl")
    images = data.get("images") or []
    preview_url = data.get("previewUrl")

    links = []
    
    # 1. Add video link if present
    if video_url:
        links.append({
            "label": "DOWNLOAD VIDEO (Direct Stream)",
            "url": video_url
        })
        
    # 2. Add images if present
    for idx, img_url in enumerate(images):
        links.append({
            "label": f"DOWNLOAD IMAGE {idx + 1} (High Quality)" if len(images) > 1 else "DOWNLOAD IMAGE (High Quality)",
            "url": img_url
        })

    # Set cover image
    cover_image = preview_url
    if not cover_image and images:
        cover_image = images[0]
    if not cover_image:
        cover_image = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Xiaohongshu_Logo.png" # Fallback Xiaohongshu logo

    if not links:
        return {
            "success": False,
            "error": "No downloadable media (images or videos) found for this RedNote / Xiaohongshu URL."
        }

    return {
        "success": True,
        "data": {
            "title": title,
            "creator": "Xiaohongshu / RedNote",
            "description": f"Extracted media from Xiaohongshu / RedNote: {title}",
            "cover": cover_image,
            "links": links
        }
    }
