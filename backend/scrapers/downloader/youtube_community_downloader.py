import re
import requests
from bs4 import BeautifulSoup

def download_youtube_community(payload):
    url = payload.get("url") or payload.get("URLT") or payload.get("image")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Origin": "https://tubepilot.ai",
        "Referer": "https://tubepilot.ai/youtube-community-post-image-downloader/"
    }

    ajax_url = "https://tubepilot.ai/wp-admin/admin-ajax.php"
    data = {
        "action": "community_post_image",
        "yt_url": url
    }

    try:
        resp = requests.post(ajax_url, data=data, headers=headers, timeout=20)
        if resp.status_code != 200:
            return {
                "success": False,
                "error": f"YouTube Community Downloader API returned status code: {resp.status_code}"
            }
            
        html = resp.text
        if "#ERR" in html or "Could not find" in html:
            # Try to extract the clean error text
            soup_err = BeautifulSoup(html, "html.parser")
            err_text = soup_err.get_text().strip() or "Could not find community post image data."
            return {
                "success": False,
                "error": err_text
            }
            
        soup = BeautifulSoup(html, "html.parser")
        items = soup.find_all(class_="ytc-img")
        if not items:
            return {
                "success": False,
                "error": "No community post images found in the response."
            }
            
        links = []
        cover = ""
        
        for idx, item in enumerate(items):
            img = item.find("img")
            img_src = img.get("src", "") if img else ""
            
            if not cover and img_src:
                cover = img_src
                
            # Find all size-links in this item
            size_anchors = item.find_all("a", class_="size-link")
            for a in size_anchors:
                href = a.get("href")
                if not href:
                    continue
                # Clean up dimensions from non-ascii characters (like multiplication signs)
                dim = a.text.strip()
                dim_clean = re.sub(r'[^\x00-\x7F]+', 'x', dim)
                
                links.append({
                    "label": f"Image {idx + 1} ({dim_clean})",
                    "url": href
                })
                
        # If no cover was set, use the href of the first link
        if not cover and links:
            cover = links[0]["url"]
            
        return {
            "success": True,
            "data": {
                "title": "YouTube Community Post Images",
                "creator": "YouTube User",
                "description": f"Extracted {len(items)} images from YouTube community post.",
                "cover": cover,
                "links": links
            }
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"YouTube Community Downloader Error: {str(e)}"
        }

if __name__ == "__main__":
    test_url = "https://www.youtube.com/post/UgkxHU_brINfE3uqhUT_bdhQu-QVNQVIzYKL"
    res = download_youtube_community({"url": test_url})
    import json
    print(json.dumps(res, indent=2))
