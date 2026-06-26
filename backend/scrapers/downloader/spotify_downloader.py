import requests
import json
import sys

def download_spotify(payload):
    url = payload.get("url") or payload.get("URLT") or payload.get("image")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Content-Type": "application/json",
        "Origin": "https://musicfab.io",
        "Referer": "https://musicfab.io/"
    }

    req_payload = {
        "url": url
    }

    try:
        res = requests.post("https://musicfab.io/api/spotify", json=req_payload, headers=headers, timeout=20)
        if res.status_code == 200:
            res_data = res.json()
            data = res_data.get("data", {})
            metadata = data.get("metadata")
            if metadata and metadata.get("download"):
                title = metadata.get("name") or "Spotify Audio"
                artist = metadata.get("artist") or "Spotify Artist"
                cover = metadata.get("image") or ""
                duration = metadata.get("duration") or "N/A"
                download_url = metadata.get("download")

                return {
                    "success": True,
                    "data": {
                        "title": title,
                        "creator": artist,
                        "description": "Spotify Media Downloader",
                        "duration": duration,
                        "cover": cover,
                        "links": [
                            {
                                "label": "Download Audio (320kbps MP3)",
                                "url": download_url
                            }
                        ]
                    }
                }
            else:
                return {
                    "success": False,
                    "error": "Unable to extract download metadata from musicfab.io."
                }
        else:
            return {
                "success": False,
                "error": f"musicfab.io server returned status code {res.status_code}."
            }
    except Exception as e:
        return {
            "success": False,
            "error": f"Exception occurred during Spotify scraping: {str(e)}"
        }

if __name__ == "__main__":
    test_payload = {"url": "https://open.spotify.com/track/2j1fFjWHCI9KJSwcuYAOyF"}
    print(json.dumps(download_spotify(test_payload), indent=2))
