import requests
import json

def download_tikwm(payload):
    url = payload.get("url") or payload.get("URLT") or payload.get("image")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }

    api_url = f"https://www.tikwm.com/api/?url={url}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    }

    try:
        res = requests.get(api_url, headers=headers, timeout=15)
        if res.status_code != 200:
            return {
                "success": False,
                "error": f"TikWM server returned status code {res.status_code}"
            }

        data = res.json()
        if data.get("code") != 0 or not data.get("data"):
            return {
                "success": False,
                "error": data.get("msg", "Failed to retrieve data from TikWM API.")
            }

        video_data = data["data"]
        title = video_data.get("title", "TikTok Video")
        creator = video_data.get("author", {}).get("nickname", "Unknown")
        
        duration_sec = video_data.get("duration", 0)
        duration = f"{duration_sec // 60:02d}:{duration_sec % 60:02d}"

        cover = video_data.get("cover", "")
        
        links = {}
        if video_data.get("play"):
            links["nowatermark"] = video_data["play"]
        if video_data.get("wmplay"):
            links["watermark"] = video_data["wmplay"]
        if video_data.get("music"):
            links["audio"] = video_data["music"]

        return {
            "success": True,
            "data": {
                "title": title,
                "creator": creator,
                "description": title,
                "duration": duration,
                "cover": cover,
                "links": links
            }
        }

    except Exception as e:
        return {
            "success": False,
            "error": f"Exception occurred during TikWM scraping: {str(e)}"
        }

if __name__ == "__main__":
    test_payload = {"url": "https://www.tiktok.com/@scout2015/video/6718335390845095173"}
    print(json.dumps(download_tikwm(test_payload), indent=2))
