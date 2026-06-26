import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import unquote

def download_pinterest(payload):
    url = payload.get("url")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
    }

    try:
        # Fetch the Pinterest page, following redirects (e.g. pin.it short links)
        resp = requests.get(url, headers=headers, timeout=10, allow_redirects=True)
        resp.raise_for_status()
        html = resp.text
        final_url = resp.url
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to retrieve Pinterest content: {str(e)}"
        }

    soup = BeautifulSoup(html, "html.parser")

    # 1. Extract Title
    title = None
    og_title = soup.find("meta", property="og:title")
    if og_title and og_title.get("content"):
        title = og_title.get("content").strip()
    if not title:
        title_tag = soup.find("title")
        if title_tag:
            title = title_tag.text.strip()
    if not title:
        title = "Pinterest Pin"

    # 2. Extract Description
    description = ""
    og_desc = soup.find("meta", property="og:description")
    if og_desc and og_desc.get("content"):
        description = og_desc.get("content").strip()
    if not description:
        desc_meta = soup.find("meta", attrs={"name": "description"})
        if desc_meta and desc_meta.get("content"):
            description = desc_meta.get("content").strip()

    # 3. Extract all pinimg URLs (handling JSON escapes)
    raw_matches = re.findall(r'https?:(?:\\/\\/|//)[a-zA-Z0-9-._~%]+pinimg\.com(?:\\/|/)[a-zA-Z0-9-._~%\\/]+', html)
    pinimg_urls = list(set([m.replace('\\/', '/') for m in raw_matches]))

    is_single_pin = "/pin/" in final_url

    # 4. Extract videos
    videos = []
    for u in pinimg_urls:
        if "v1.pinimg.com" in u or "v2.pinimg.com" in u or "/videos/" in u:
            if u.endswith(".mp4") or ".mp4?" in u or u.endswith(".m3u8") or ".m3u8?" in u:
                videos.append(u)

    # 5. Extract and reconstruct original images
    def get_images(allow_placeholder=False):
        extracted = []
        seen_sigs = set()
        for u in pinimg_urls:
            if "i.pinimg.com" not in u:
                continue
            # Exclude avatars and UI elements
            if any(x in u for x in ["_RS", "_sq", "_Sq", "_30x30", "_75x75", "_150x150", "_280x280", "avatar", "logo", "favicon", "/user/", "/website/"]):
                continue
                
            filename = u.split('/')[-1].split('?')[0]
            if not filename:
                continue
                
            name_parts = filename.split('.')
            if len(name_parts) < 2:
                continue
            sig = name_parts[0]
            ext = name_parts[-1]
            
            if ext.lower() not in ["jpg", "jpeg", "png", "webp", "gif"]:
                continue
            if len(sig) < 20:
                continue
            # Exclude default gradient placeholder unless allowed
            if not allow_placeholder and sig == "d53b014d86a6b6761bf649a0ed813c2b":
                continue
                
            if sig in seen_sigs:
                continue
            seen_sigs.add(sig)
            
            part1 = sig[0:2]
            part2 = sig[2:4]
            part3 = sig[4:6]
            orig_url = f"https://i.pinimg.com/originals/{part1}/{part2}/{part3}/{sig}.{ext}"
            extracted.append(orig_url)
        return extracted

    images = get_images(allow_placeholder=False)
    if not images:
        images = get_images(allow_placeholder=True)

    # 6. Look for main sharing image CSS custom property if it's a single pin
    main_image_orig = None
    if is_single_pin:
        share_match = re.search(r'--[a-zA-Z0-9_-]+-background-url\s*:\s*url\((https?://(?:\\/|/|[^)])+pinimg\.com(?:\\/|/|[^)])+)\)', html)
        if share_match:
            raw_url = share_match.group(1).replace('\\/', '/')
            if "d53b014d86a6b6761bf649a0ed813c2b" not in raw_url:
                filename = raw_url.split('/')[-1].split('?')[0]
                name_parts = filename.split('.')
                if len(name_parts) >= 2:
                    sig = name_parts[0]
                    ext = name_parts[-1]
                    part1 = sig[0:2]
                    part2 = sig[2:4]
                    part3 = sig[4:6]
                    main_image_orig = f"https://i.pinimg.com/originals/{part1}/{part2}/{part3}/{sig}.{ext}"

    # 7. Formulate links
    links = []

    # Prioritize videos
    unique_videos = list(set(videos))
    for idx, v_url in enumerate(unique_videos):
        label = "DOWNLOAD VIDEO (Direct Stream)" if len(unique_videos) == 1 else f"DOWNLOAD VIDEO {idx+1} (Direct Stream)"
        links.append({"label": label, "url": v_url})

    # Add images
    if is_single_pin:
        prioritized_images = []
        if main_image_orig:
            prioritized_images.append(main_image_orig)
            if main_image_orig in images:
                images.remove(main_image_orig)
        prioritized_images.extend(images)
        
        if prioritized_images:
            links.append({
                "label": "DOWNLOAD IMAGE (Original Quality)",
                "url": prioritized_images[0]
            })
            for idx, img_url in enumerate(prioritized_images[1:]):
                links.append({
                    "label": f"DOWNLOAD RELATED IMAGE {idx+1} (Original Quality)",
                    "url": img_url
                })
        cover_image = prioritized_images[0] if prioritized_images else "https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png"
    else:
        for idx, img_url in enumerate(images[:100]):
            links.append({
                "label": f"DOWNLOAD IMAGE {idx+1} (Original Quality)",
                "url": img_url
            })
        cover_image = images[0] if images else "https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png"

    # Fallback to OpenGraph image if no links found
    if not links:
        og_image = soup.find("meta", property="og:image")
        if og_image and og_image.get("content"):
            img_url = og_image.get("content")
            cover_image = img_url
            links.append({
                "label": "DOWNLOAD IMAGE (High Quality)",
                "url": img_url
            })

    if not links:
        return {
            "success": False,
            "error": "No downloadable media (images or videos) found on the provided Pinterest page."
        }

    return {
        "success": True,
        "data": {
            "title": title,
            "creator": "Pinterest",
            "description": description or f"Extracted media from Pinterest URL: {final_url}",
            "cover": cover_image,
            "links": links
        }
    }

