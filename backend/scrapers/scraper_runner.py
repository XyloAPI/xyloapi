import sys
import json
import base64
import time
import os

# Set up module paths
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def load_dotenv():
    possible_paths = [
        os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env'),
        os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env'),
        os.path.join(os.getcwd(), 'backend', '.env'),
        os.path.join(os.getcwd(), '.env'),
    ]
    for path in possible_paths:
        if os.path.exists(path):
            try:
                with open(path, 'r') as f:
                    for line in f:
                        line = line.strip()
                        if not line or line.startswith('#'):
                            continue
                        if '=' in line:
                            key, val = line.split('=', 1)
                            val = val.strip().strip('"').strip("'")
                            os.environ[key.strip()] = val
                break
            except Exception:
                pass

load_dotenv()

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
    from bilibili_downloader import download_bilibili
    from snackvideo_downloader import download_snackvideo
    from capcut_downloader import download_capcut
    from cocofun_downloader import download_cocofun
    from douyin_downloader import download_douyin
    from youtube_community_downloader import download_youtube_community
    from github_downloader import download_github
    from gdrive_downloader import download_gdrive
    from mediafire_downloader import download_mediafire
    from mega_downloader import download_mega
    from npm_downloader import download_npm
    from pinterest_downloader import download_pinterest
    from rednote_downloader import download_rednote
    from scribd_downloader import download_scribd
    from sfile_downloader import download_sfile
    from terabox_downloader import download_terabox
    from dailymotion_downloader import download_dailymotion
    from ph_downloader import download_ph
    from pornhd_downloader import download_pornhd
    from xnxx_downloader import download_xnxx
    from straitstimes_scraper import get_straitstimes_news
    from cna_scraper import get_cna_news
    from bbc_scraper import get_bbc_news
    from cnn_scraper import get_cnn_news
    from mothership_scraper import get_mothership_news
    from aljazeera_scraper import get_aljazeera_news
    from abc_scraper import get_abc_news
    from washingtonpost_scraper import get_washingtonpost_news
    from apnews_scraper import get_apnews
    from foxnews_scraper import get_foxnews
    from reuters_scraper import get_reuters
    from cbs_scraper import get_cbs_news
    from nytimes_scraper import get_nytimes
    from msnow_scraper import get_msnow
    from wsj_scraper import get_wsj
    from guardian_scraper import get_guardian
    from time_scraper import get_time_news
    from skynews_scraper import get_skynews
    from npr_scraper import get_npr
    from bloomberg_scraper import get_bloomberg
    from thetimes_scraper import get_thetimes
    from dw_scraper import get_dw
    from nhl_scraper import get_nhl
    from news24_scraper import get_news24
    from newsweek_scraper import get_newsweek
    from yahoonews_scraper import get_yahoonews
    from usnews_scraper import get_usnews
    from nbc_scraper import get_nbc
    from nasa_scraper import get_nasa
    from freep_scraper import get_freep
    from masslive_scraper import get_masslive
    from wmtv_scraper import get_wmtv
    from forbes_scraper import get_forbes
    from euronews_scraper import get_euronews
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
    import bilibili_downloader
    import snackvideo_downloader
    import capcut_downloader
    import cocofun_downloader
    import douyin_downloader
    import youtube_community_downloader
    import github_downloader
    import gdrive_downloader
    import mediafire_downloader
    import mega_downloader
    import npm_downloader
    import pinterest_downloader
    import rednote_downloader
    import scribd_downloader
    import sfile_downloader
    import terabox_downloader
    import dailymotion_downloader
    import ph_downloader
    import pornhd_downloader
    import xnxx_downloader
    import straitstimes_scraper
    import cna_scraper
    import bbc_scraper
    import cnn_scraper
    import mothership_scraper
    import aljazeera_scraper
    import abc_scraper
    import washingtonpost_scraper
    import apnews_scraper
    import foxnews_scraper
    import reuters_scraper
    import cbs_scraper
    import nytimes_scraper
    import msnow_scraper
    import wsj_scraper
    import guardian_scraper
    import time_scraper
    import skynews_scraper
    import npr_scraper
    import bloomberg_scraper
    import thetimes_scraper
    import dw_scraper
    import nhl_scraper
    import news24_scraper
    import newsweek_scraper
    import yahoonews_scraper
    import usnews_scraper
    import nbc_scraper
    import nasa_scraper
    import freep_scraper
    import masslive_scraper
    import wmtv_scraper
    import forbes_scraper
    import euronews_scraper
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
    download_bilibili = bilibili_downloader.download_bilibili
    download_snackvideo = snackvideo_downloader.download_snackvideo
    download_capcut = capcut_downloader.download_capcut
    download_cocofun = cocofun_downloader.download_cocofun
    download_douyin = douyin_downloader.download_douyin
    download_youtube_community = youtube_community_downloader.download_youtube_community
    download_github = github_downloader.download_github
    download_gdrive = gdrive_downloader.download_gdrive
    download_mediafire = mediafire_downloader.download_mediafire
    download_mega = mega_downloader.download_mega
    download_npm = npm_downloader.download_npm
    download_pinterest = pinterest_downloader.download_pinterest
    download_rednote = rednote_downloader.download_rednote
    download_scribd = scribd_downloader.download_scribd
    download_sfile = sfile_downloader.download_sfile
    download_terabox = terabox_downloader.download_terabox
    download_dailymotion = dailymotion_downloader.download_dailymotion
    download_ph = ph_downloader.download_ph
    download_pornhd = pornhd_downloader.download_pornhd
    download_xnxx = xnxx_downloader.download_xnxx
    get_straitstimes_news = straitstimes_scraper.get_straitstimes_news
    get_cna_news = cna_scraper.get_cna_news
    get_bbc_news = bbc_scraper.get_bbc_news
    get_cnn_news = cnn_scraper.get_cnn_news
    get_mothership_news = mothership_scraper.get_mothership_news
    get_aljazeera_news = aljazeera_scraper.get_aljazeera_news
    get_abc_news = abc_scraper.get_abc_news
    get_washingtonpost_news = washingtonpost_scraper.get_washingtonpost_news
    get_apnews = apnews_scraper.get_apnews
    get_foxnews = foxnews_scraper.get_foxnews
    get_reuters = reuters_scraper.get_reuters
    get_cbs_news = cbs_scraper.get_cbs_news
    get_nytimes = nytimes_scraper.get_nytimes
    get_msnow = msnow_scraper.get_msnow
    get_wsj = wsj_scraper.get_wsj
    get_guardian = guardian_scraper.get_guardian
    get_time_news = time_scraper.get_time_news
    get_skynews = skynews_scraper.get_skynews
    get_npr = npr_scraper.get_npr
    get_bloomberg = bloomberg_scraper.get_bloomberg
    get_thetimes = thetimes_scraper.get_thetimes
    get_dw = dw_scraper.get_dw
    get_nhl = nhl_scraper.get_nhl
    get_news24 = news24_scraper.get_news24
    get_newsweek = newsweek_scraper.get_newsweek
    get_yahoonews = yahoonews_scraper.get_yahoonews
    get_usnews = usnews_scraper.get_usnews
    get_nbc = nbc_scraper.get_nbc
    get_nasa = nasa_scraper.get_nasa
    get_freep = freep_scraper.get_freep
    get_masslive = masslive_scraper.get_masslive
    get_wmtv = wmtv_scraper.get_wmtv
    get_forbes = forbes_scraper.get_forbes
    get_euronews = euronews_scraper.get_euronews

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
    elif endpoint_id in ["bilibili"]:
        return download_bilibili(payload)
    elif endpoint_id in ["snackvideo", "snack"]:
        return download_snackvideo(payload)
    elif endpoint_id in ["capcut"]:
        return download_capcut(payload)
    elif endpoint_id in ["cocofun", "coco"]:
        return download_cocofun(payload)
    elif endpoint_id in ["douyin"]:
        return download_douyin(payload)
    elif endpoint_id in ["youtube-community", "yt-community"]:
        return download_youtube_community(payload)
    elif endpoint_id in ["github", "git"]:
        return download_github(payload)
    elif endpoint_id in ["gdrive", "google-drive"]:
        return download_gdrive(payload)
    elif endpoint_id in ["mediafire"]:
        return download_mediafire(payload)
    elif endpoint_id in ["mega"]:
        return download_mega(payload)
    elif endpoint_id in ["npm"]:
        return download_npm(payload)
    elif endpoint_id in ["pinterest", "pin"]:
        return download_pinterest(payload)
    elif endpoint_id in ["rednote", "xiaohongshu"]:
        return download_rednote(payload)
    elif endpoint_id in ["scribd"]:
        return download_scribd(payload)
    elif endpoint_id in ["sfile"]:
        return download_sfile(payload)
    elif endpoint_id in ["terabox"]:
        return download_terabox(payload)
    elif endpoint_id in ["dailymotion", "daily"]:
        return download_dailymotion(payload)
    elif endpoint_id in ["ph", "pornhub"]:
        return download_ph(payload)
    elif endpoint_id in ["pornhd", "faphouse"]:
        return download_pornhd(payload)
    elif endpoint_id in ["xnxx"]:
        return download_xnxx(payload)
    elif endpoint_id in ["straitstimes", "st", "straits-times"]:
        return get_straitstimes_news(payload)
    elif endpoint_id in ["cna", "channelnewsasia", "channel-news-asia"]:
        return get_cna_news(payload)
    elif endpoint_id in ["bbc", "bbc-news"]:
        return get_bbc_news(payload)
    elif endpoint_id in ["cnn", "cnn-news"]:
        return get_cnn_news(payload)
    elif endpoint_id in ["mothership", "mothership-sg"]:
        return get_mothership_news(payload)
    elif endpoint_id in ["aljazeera", "al-jazeera", "aj"]:
        return get_aljazeera_news(payload)
    elif endpoint_id in ["abc", "abcnews", "abc-news"]:
        return get_abc_news(payload)
    elif endpoint_id in ["washingtonpost", "wapo", "washington-post"]:
        return get_washingtonpost_news(payload)
    elif endpoint_id in ["apnews", "ap", "ap-news"]:
        return get_apnews(payload)
    elif endpoint_id in ["foxnews", "fox", "fox-news"]:
        return get_foxnews(payload)
    elif endpoint_id in ["reuters"]:
        return get_reuters(payload)
    elif endpoint_id in ["cbs", "cbsnews", "cbs-news"]:
        return get_cbs_news(payload)
    elif endpoint_id in ["nytimes", "nyt", "new-york-times"]:
        return get_nytimes(payload)
    elif endpoint_id in ["msnow", "msnbc", "ms-now"]:
        return get_msnow(payload)
    elif endpoint_id in ["wsj", "wall-street-journal"]:
        return get_wsj(payload)
    elif endpoint_id in ["guardian", "theguardian", "the-guardian"]:
        return get_guardian(payload)
    elif endpoint_id in ["time", "time-magazine", "timemag"]:
        return get_time_news(payload)
    elif endpoint_id in ["skynews", "sky", "sky-news"]:
        return get_skynews(payload)
    elif endpoint_id in ["npr", "national-public-radio"]:
        return get_npr(payload)
    elif endpoint_id in ["bloomberg", "bbg"]:
        return get_bloomberg(payload)
    elif endpoint_id in ["thetimes", "the-times", "times"]:
        return get_thetimes(payload)
    elif endpoint_id in ["dw", "deutsche-welle"]:
        return get_dw(payload)
    elif endpoint_id in ["nhl"]:
        return get_nhl(payload)
    elif endpoint_id in ["news24", "news-24"]:
        return get_news24(payload)
    elif endpoint_id in ["newsweek", "news-week"]:
        return get_newsweek(payload)
    elif endpoint_id in ["yahoonews", "yahoo-news", "yahoo"]:
        return get_yahoonews(payload)
    elif endpoint_id in ["usnews", "us-news"]:
        return get_usnews(payload)
    elif endpoint_id in ["nbc", "nbcnews", "nbc-news"]:
        return get_nbc(payload)
    elif endpoint_id in ["nasa", "nasa-news", "nasanews"]:
        return get_nasa(payload)
    elif endpoint_id in ["detroit", "freep", "detroit-free-press"]:
        return get_freep(payload)
    elif endpoint_id in ["masslive", "mass-live"]:
        return get_masslive(payload)
    elif endpoint_id in ["wmtv", "wmtv-news", "wmtv15"]:
        return get_wmtv(payload)
    elif endpoint_id in ["forbes", "forbes-news"]:
        return get_forbes(payload)
    elif endpoint_id in ["euronews", "euro-news"]:
        return get_euronews(payload)
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
