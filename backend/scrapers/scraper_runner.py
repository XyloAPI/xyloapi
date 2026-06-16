import sys
import json
import base64
import time
import os

# Set up module paths
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import modular scrapers
try:
    from imgur_uploader import upload_imgur
    from eight_uploads_uploader import upload_eight_uploads
    from freeimage_uploader import upload_freeimage
    from imghippo_uploader import upload_imghippo
    from catbox_uploader import upload_catbox
    from litterbox_uploader import upload_litterbox
    from uguu_uploader import upload_uguu
    from imgbb_uploader import upload_imgbb
    from yourimageshare_uploader import upload_yourimageshare
    from gofile_uploader import upload_gofile
    from tiktok_downloader import download_tiktok
    from musicaldown_downloader import download_musicaldown
    from ssstik_downloader import download_ssstik
    from tikwm_downloader import download_tikwm
    from instagram_downloader import download_instagram
    from snapdownloader_downloader import download_snapdownloader
    from iqsaved_downloader import download_iqsaved
    from youtube_downloader import download_youtube
    from spotify_downloader import download_spotify
    from soundcloud_downloader import download_soundcloud
    from x_downloader import download_x
    from threads_downloader import download_threads
    from facebook_downloader import download_facebook
except ImportError:
    # Fallback to local import if environment is weird
    import imgur_uploader
    import eight_uploads_uploader
    import freeimage_uploader
    import imghippo_uploader
    import catbox_uploader
    import litterbox_uploader
    import uguu_uploader
    import imgbb_uploader
    import yourimageshare_uploader
    import gofile_uploader
    import tiktok_downloader
    import musicaldown_downloader
    import ssstik_downloader
    import tikwm_downloader
    import instagram_downloader
    import snapdownloader_downloader
    import iqsaved_downloader
    import youtube_downloader
    import spotify_downloader
    import soundcloud_downloader
    import x_downloader
    import threads_downloader
    import facebook_downloader
    upload_imgur = imgur_uploader.upload_imgur
    upload_eight_uploads = eight_uploads_uploader.upload_eight_uploads
    upload_freeimage = freeimage_uploader.upload_freeimage
    upload_imghippo = imghippo_uploader.upload_imghippo
    upload_catbox = catbox_uploader.upload_catbox
    upload_litterbox = litterbox_uploader.upload_litterbox
    upload_uguu = uguu_uploader.upload_uguu
    upload_imgbb = imgbb_uploader.upload_imgbb
    upload_yourimageshare = yourimageshare_uploader.upload_yourimageshare
    upload_gofile = gofile_uploader.upload_gofile
    download_tiktok = tiktok_downloader.download_tiktok
    download_musicaldown = musicaldown_downloader.download_musicaldown
    download_ssstik = ssstik_downloader.download_ssstik
    download_tikwm = tikwm_downloader.download_tikwm
    download_instagram = instagram_downloader.download_instagram
    download_snapdownloader = snapdownloader_downloader.download_snapdownloader
    download_iqsaved = iqsaved_downloader.download_iqsaved
    download_youtube = youtube_downloader.download_youtube
    download_spotify = spotify_downloader.download_spotify
    download_soundcloud = soundcloud_downloader.download_soundcloud
    download_x = x_downloader.download_x
    download_threads = threads_downloader.download_threads
    download_facebook = facebook_downloader.download_facebook

def run_pipeline(endpoint_id, payload):
    if endpoint_id in ["imgur", "image"]:
        return upload_imgur(payload)
    elif endpoint_id in ["8uploads", "8upload"]:
        return upload_eight_uploads(payload)
    elif endpoint_id in ["freeimage", "freeimagehost"]:
        return upload_freeimage(payload)
    elif endpoint_id in ["imghippo"]:
        return upload_imghippo(payload)
    elif endpoint_id in ["catbox"]:
        return upload_catbox(payload)
    elif endpoint_id in ["litterbox"]:
        return upload_litterbox(payload)
    elif endpoint_id in ["uguu"]:
        return upload_uguu(payload)
    elif endpoint_id in ["imgbb"]:
        return upload_imgbb(payload)
    elif endpoint_id in ["yourimageshare"]:
        return upload_yourimageshare(payload)
    elif endpoint_id in ["gofile"]:
        return upload_gofile(payload)
    elif endpoint_id in ["tiktok", "tikdown"]:
        return download_tiktok(payload)
    elif endpoint_id in ["musicaldown"]:
        return download_musicaldown(payload)
    elif endpoint_id in ["ssstik"]:
        return download_ssstik(payload)
    elif endpoint_id in ["tikwm"]:
        return download_tikwm(payload)
    elif endpoint_id in ["instagram", "snapsave"]:
        return download_instagram(payload)
    elif endpoint_id in ["iqsaved"]:
        return download_iqsaved(payload)
    elif endpoint_id in ["youtube"]:
        return download_youtube(payload)
    elif endpoint_id in ["spotify"]:
        return download_spotify(payload)
    elif endpoint_id in ["soundcloud"]:
        return download_soundcloud(payload)
    elif endpoint_id in ["x", "twitter"]:
        return download_x(payload)
    elif endpoint_id in ["threads"]:
        return download_threads(payload)
    elif endpoint_id in ["facebook"]:
        return download_facebook(payload)
    else:
        return {
            "endpoint_id": endpoint_id,
            "success": False,
            "error": f"Endpoint '{endpoint_id}' not supported in active pipelines.",
            "payload_received": payload
        }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "Missing endpoint_id argument"}))
        sys.exit(1)

    endpoint_id = sys.argv[1]

    try:
        payload_b64 = sys.stdin.read().strip()
        payload_str = base64.b64decode(payload_b64).decode('utf-8')
        payload = json.loads(payload_str)
    except Exception as e:
        print(json.dumps({"success": False, "error": f"Failed to parse payload: {str(e)}"}))
        sys.exit(1)

    try:
        result = run_pipeline(endpoint_id, payload)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"success": False, "error": f"Error during execution: {str(e)}"}))
        sys.exit(1)
