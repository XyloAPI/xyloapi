import requests
import json
import sys

def download_threads(payload):
    url = payload.get("url") or payload.get("URLT") or payload.get("image")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }

    # Normalize threads.com to threads.net if user enters threads.com
    if "threads.com" in url:
        url = url.replace("threads.com", "threads.net")

    api_url = "https://www.threadsdl.app/api/threads"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Origin": "https://www.threadsdl.app",
        "Referer": "https://www.threadsdl.app/"
    }

    try:
        post_payload = {"url": url}
        res = requests.post(api_url, json=post_payload, headers=headers, timeout=25)
        if res.status_code != 200:
            return {
                "success": False,
                "error": f"ThreadsDL API returned status code {res.status_code}"
            }
            
        data = res.json()
        
        username = data.get("username") or "Threads User"
        avatar = data.get("avatar") or ""
        text = data.get("text") or "Threads Post"
        medias = data.get("medias", [])
        
        links = []
        for idx, item in enumerate(medias):
            # Check for videos first
            videos = item.get("videos", [])
            images = item.get("images", [])
            
            if videos:
                # Get first video (usually best quality)
                vid_url = videos[0].get("url")
                if vid_url:
                    links.append({
                        "label": f"Download Video {idx+1}" if len(medias) > 1 else "Download Video (MP4)",
                        "url": vid_url
                    })
            elif images:
                # Get first image (usually best quality)
                img_url = images[0].get("url")
                if img_url:
                    links.append({
                        "label": f"Download Image {idx+1}" if len(medias) > 1 else "Download Image (JPG)",
                        "url": img_url
                    })
                    
        if not links:
            return {
                "success": False,
                "error": "No media (video or image) could be found in this Threads post."
            }
            
        return {
            "success": True,
            "data": {
                "title": f"Threads post by @{username}",
                "creator": f"@{username}",
                "description": text,
                "duration": "N/A",
                "cover": avatar,
                "links": links
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Exception occurred during Threads scraping: {str(e)}"
        }

if __name__ == "__main__":
    test_payload = {"url": "https://www.threads.net/@tukuafterrunning/post/DZoULTBE2_i"}
    print(json.dumps(download_threads(test_payload), indent=2))
