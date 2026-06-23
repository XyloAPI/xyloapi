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
                            # Overwrite only if key is not set OR currently empty
                            key = key.strip()
                            if key not in os.environ or not os.environ[key]:
                                os.environ[key] = val
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
    from cnn_scraper import get_cnn_news as get_cnn_news_global
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
    from usatoday_scraper import get_usatoday
    from independent_scraper import get_independent_news
    from punch_scraper import get_punch_news
    from detik_scraper import get_detik_news
    from kompas_scraper import get_kompas_news
    from cnnindonesia_scraper import get_cnn_news as get_cnn_news_indo
    from liputan6_scraper import get_liputan6_news
    from sindonews_scraper import get_sindo_news
    from antaranews_scraper import get_antara_news
    from bmkg_scraper import get_bmkg_news
    from tempo_scraper import get_tempo_news
    from bisnis_scraper import get_bisnis_news
    from okezone_scraper import get_okezone_news
    from cnbc_scraper import get_cnbc_news
    from times_scraper import get_times_news
    from inilah_scraper import get_inilah_news
    from bi_scraper import get_bi_news
    from hukumonline_scraper import get_hukumonline_news
    from mediaindonesia_scraper import get_mi_news
    from beritajakarta_scraper import get_bj_news
    from tangerangkota_scraper import get_tk_news
    from kompastv_scraper import get_ktv_news
    from viva_scraper import get_viva_news
    from inews_scraper import get_inews_news
    from terkini_scraper import get_terkini_news
    from cna_scraper import get_cna_news
    from merdeka_scraper import get_merdeka_news
    from jakartapost_scraper import get_jakartapost_news
    from removebg_scraper import get_removebg_image
    from upscale_scraper import get_upscale_image
    from sepia_scraper import get_sepia_image
    from invert_scraper import get_inverted_image
    from flip_scraper import get_flipped_image
    from pixelate_scraper import get_pixelated_image
    from round_corners_scraper import get_rounded_image
    from split_scraper import get_split_image
    from noise_scraper import get_noised_image
    from blur_scraper import get_blurred_image
    from sharpen_scraper import get_sharpen_image
    from solarize_scraper import get_solarized_image
    from glow_scraper import get_glow_image
    from posterize_scraper import get_posterized_image
    from blurface_scraper import get_blurface_image
    from enhance_scraper import get_enhanced_image
    from qr_scraper import get_qr_code
    from qr_decoder_scraper import get_decoded_qr
    from tinyurl_scraper import get_short_url
    from isgd_scraper import get_isgd_url
    from vgd_scraper import get_vgd_url
    from ulvis_scraper import get_ulvis_url
    from dagd_scraper import get_dagd_url
    from cleanuri_scraper import get_cleanuri_url
    from llama_scraper import get_llama_chat
    from groq_scraper import get_groq_chat
    from qwen_scraper import get_qwen_chat
    from minimax_scraper import get_minimax_chat
    from deepseek_scraper import get_deepseek_chat
    from deepseek_flash_scraper import get_deepseek_flash_chat
    from kimi_scraper import get_kimi_chat
    from glm_scraper import get_glm_chat
    from nemotron_scraper import get_nemotron_chat
    from chatgpt_scraper import get_chatgpt_chat
    from granite_scraper import get_granite_chat
    from mistral_scraper import get_mistral_chat
    from quillbot_scraper import get_quillbot_chat
    from perplexity_scraper import get_perplexity_chat
    from gemini_scraper import get_gemini_chat
    from pollinations_scraper import get_pollinations_chat
    from asynt_scraper import get_asynt_chat
    from muslimai_scraper import get_muslimai_chat
    from gitaai_scraper import get_gitaai_chat
    from powerbrainai_scraper import get_powerbrainai_chat
    from felo_scraper import get_felo_chat
    from mathgpt_scraper import get_mathgpt_chat
    from jeeves_scraper import get_jeeves_chat
    from sahabatai_scraper import get_sahabatai_chat
    from aya_scraper import get_aya_chat
    from ansari_scraper import get_ansari_chat
    from olabiba_scraper import get_olabiba_chat
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
    import forbes_scraper
    import euronews_scraper
    import usatoday_scraper
    import wmtv_scraper
    import independent_scraper
    import punch_scraper
    import detik_scraper
    import kompas_scraper
    import cnnindonesia_scraper
    import liputan6_scraper
    import sindonews_scraper
    import antaranews_scraper
    import bmkg_scraper
    import tempo_scraper
    import bisnis_scraper
    import okezone_scraper
    import cnbc_scraper
    import times_scraper
    import inilah_scraper
    import bi_scraper
    import hukumonline_scraper
    import mediaindonesia_scraper
    import beritajakarta_scraper
    import tangerangkota_scraper
    import kompastv_scraper
    import viva_scraper
    import inews_scraper
    import terkini_scraper
    import cna_scraper
    import merdeka_scraper
    import jakartapost_scraper
    import removebg_scraper
    import upscale_scraper
    import sepia_scraper
    import invert_scraper
    import flip_scraper
    import pixelate_scraper
    import round_corners_scraper
    import split_scraper
    import noise_scraper
    import blur_scraper
    import sharpen_scraper
    import solarize_scraper
    import glow_scraper
    import posterize_scraper
    import blurface_scraper
    import enhance_scraper
    import qr_scraper
    import qr_decoder_scraper
    import tinyurl_scraper
    import isgd_scraper
    import vgd_scraper
    import ulvis_scraper
    import dagd_scraper
    import cleanuri_scraper
    import llama_scraper
    import groq_scraper
    import qwen_scraper
    import minimax_scraper
    import deepseek_scraper
    import deepseek_flash_scraper
    import kimi_scraper
    import glm_scraper
    import nemotron_scraper
    import chatgpt_scraper
    import granite_scraper
    import mistral_scraper
    import quillbot_scraper
    import perplexity_scraper
    import gemini_scraper
    import pollinations_scraper
    import asynt_scraper
    import muslimai_scraper
    import gitaai_scraper
    import powerbrainai_scraper
    import felo_scraper
    import mathgpt_scraper
    import jeeves_scraper
    import sahabatai_scraper
    import aya_scraper
    import ansari_scraper
    import olabiba_scraper
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
    get_cnn_news_global = cnn_scraper.get_cnn_news
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
    get_usatoday = usatoday_scraper.get_usatoday
    get_independent_news = independent_scraper.get_independent_news
    get_punch_news = punch_scraper.get_punch_news
    get_detik_news = detik_scraper.get_detik_news
    get_kompas_news = kompas_scraper.get_kompas_news
    get_cnn_news_indo = cnnindonesia_scraper.get_cnn_news
    get_liputan6_news = liputan6_scraper.get_liputan6_news
    get_sindo_news = sindonews_scraper.get_sindo_news
    get_antara_news = antaranews_scraper.get_antara_news
    get_bmkg_news = bmkg_scraper.get_bmkg_news
    get_tempo_news = tempo_scraper.get_tempo_news
    get_bisnis_news = bisnis_scraper.get_bisnis_news
    get_okezone_news = okezone_scraper.get_okezone_news
    get_cnbc_news = cnbc_scraper.get_cnbc_news
    get_times_news = times_scraper.get_times_news
    get_inilah_news = inilah_scraper.get_inilah_news
    get_bi_news = bi_scraper.get_bi_news
    get_hukumonline_news = hukumonline_scraper.get_hukumonline_news
    get_mi_news = mediaindonesia_scraper.get_mi_news
    get_bj_news = beritajakarta_scraper.get_bj_news
    get_tk_news = tangerangkota_scraper.get_tk_news
    get_ktv_news = kompastv_scraper.get_ktv_news
    get_viva_news = viva_scraper.get_viva_news
    get_inews_news = inews_scraper.get_inews_news
    get_terkini_news = terkini_scraper.get_terkini_news
    get_cna_news = cna_scraper.get_cna_news
    get_merdeka_news = merdeka_scraper.get_merdeka_news
    get_jakartapost_news = jakartapost_scraper.get_jakartapost_news
    get_removebg_image = removebg_scraper.get_removebg_image
    get_upscale_image = upscale_scraper.get_upscale_image
    get_sepia_image = sepia_scraper.get_sepia_image
    get_inverted_image = invert_scraper.get_inverted_image
    get_flipped_image = flip_scraper.get_flipped_image
    get_pixelated_image = pixelate_scraper.get_pixelated_image
    get_rounded_image = round_corners_scraper.get_rounded_image
    get_split_image = split_scraper.get_split_image
    get_noised_image = noise_scraper.get_noised_image
    get_blurred_image = blur_scraper.get_blurred_image
    get_sharpen_image = sharpen_scraper.get_sharpen_image
    get_solarized_image = solarize_scraper.get_solarized_image
    get_glow_image = glow_scraper.get_glow_image
    get_posterized_image = posterize_scraper.get_posterized_image
    get_blurface_image = blurface_scraper.get_blurface_image
    get_enhanced_image = enhance_scraper.get_enhanced_image
    get_qr_code = qr_scraper.get_qr_code
    get_decoded_qr = qr_decoder_scraper.get_decoded_qr
    get_short_url = tinyurl_scraper.get_short_url
    get_isgd_url = isgd_scraper.get_isgd_url
    get_vgd_url = vgd_scraper.get_vgd_url
    get_ulvis_url = ulvis_scraper.get_ulvis_url
    get_dagd_url = dagd_scraper.get_dagd_url
    get_cleanuri_url = cleanuri_scraper.get_cleanuri_url
    get_llama_chat = llama_scraper.get_llama_chat
    get_groq_chat = groq_scraper.get_groq_chat
    get_qwen_chat = qwen_scraper.get_qwen_chat
    get_minimax_chat = minimax_scraper.get_minimax_chat
    get_deepseek_chat = deepseek_scraper.get_deepseek_chat
    get_deepseek_flash_chat = deepseek_flash_scraper.get_deepseek_flash_chat
    get_kimi_chat = kimi_scraper.get_kimi_chat
    get_glm_chat = glm_scraper.get_glm_chat
    get_nemotron_chat = nemotron_scraper.get_nemotron_chat
    get_chatgpt_chat = chatgpt_scraper.get_chatgpt_chat
    get_granite_chat = granite_scraper.get_granite_chat
    get_mistral_chat = mistral_scraper.get_mistral_chat
    get_quillbot_chat = quillbot_scraper.get_quillbot_chat
    get_perplexity_chat = perplexity_scraper.get_perplexity_chat
    get_gemini_chat = gemini_scraper.get_gemini_chat
    get_pollinations_chat = pollinations_scraper.get_pollinations_chat
    get_asynt_chat = asynt_scraper.get_asynt_chat
    get_muslimai_chat = muslimai_scraper.get_muslimai_chat
    get_gitaai_chat = gitaai_scraper.get_gitaai_chat
    get_powerbrainai_chat = powerbrainai_scraper.get_powerbrainai_chat
    get_felo_chat = felo_scraper.get_felo_chat
    get_mathgpt_chat = mathgpt_scraper.get_mathgpt_chat
    get_jeeves_chat = jeeves_scraper.get_jeeves_chat
    get_sahabatai_chat = sahabatai_scraper.get_sahabatai_chat
    get_aya_chat = aya_scraper.get_aya_chat
    get_ansari_chat = ansari_scraper.get_ansari_chat
    get_olabiba_chat = olabiba_scraper.get_olabiba_chat

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
        return get_cnn_news_global(payload)
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
    elif endpoint_id in ["thetimes", "the-times"]:
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
    elif endpoint_id in ["usatoday", "usa-today"]:
        return get_usatoday(payload)
    elif endpoint_id in ["independent", "independent-news", "the-independent"]:
        return get_independent_news(payload)
    elif endpoint_id in ["punch", "punch-news"]:
        return get_punch_news(payload)
    elif endpoint_id in ["detik", "detik-news"]:
        return get_detik_news(payload)
    elif endpoint_id in ["kompas", "kompas-news"]:
        return get_kompas_news(payload)
    elif endpoint_id in ["cnnindonesia", "cnn-indonesia", "cnnindo"]:
        return get_cnn_news_indo(payload)
    elif endpoint_id in ["liputan6", "liputan-6"]:
        return get_liputan6_news(payload)
    elif endpoint_id in ["sindonews", "sindo-news", "sindo"]:
        return get_sindo_news(payload)
    elif endpoint_id in ["antaranews", "antara-news", "antara"]:
        return get_antara_news(payload)
    elif endpoint_id in ["bmkg", "bmkg-news", "bmkg-berita"]:
        return get_bmkg_news(payload)
    elif endpoint_id in ["tempo", "tempo-news", "tempo-co"]:
        return get_tempo_news(payload)
    elif endpoint_id in ["bisnis", "bisnis-news", "bisnis-com"]:
        return get_bisnis_news(payload)
    elif endpoint_id in ["okezone", "okezone-news"]:
        return get_okezone_news(payload)
    elif endpoint_id in ["cnbc", "cnbcindonesia", "cnbc-news"]:
        return get_cnbc_news(payload)
    elif endpoint_id in ["times", "timesindonesia", "times-news"]:
        return get_times_news(payload)
    elif endpoint_id in ["inilah", "inilah-com", "inilah-news"]:
        return get_inilah_news(payload)
    elif endpoint_id in ["bi", "bi-news", "bank-indonesia", "bi-release"]:
        return get_bi_news(payload)
    elif endpoint_id in ["hukumonline", "hukumonline-news", "hukumonline-berita"]:
        return get_hukumonline_news(payload)
    elif endpoint_id in ["mediaindonesia", "media-indonesia", "mediaindonesia-news"]:
        return get_mi_news(payload)
    elif endpoint_id in ["beritajakarta", "berita-jakarta", "beritajakarta-news"]:
        return get_bj_news(payload)
    elif endpoint_id in ["tangerangkota", "tangerang-kota", "tangerangkota-news"]:
        return get_tk_news(payload)
    elif endpoint_id in ["kompastv", "kompas-tv", "kompastv-news"]:
        return get_ktv_news(payload)
    elif endpoint_id in ["viva", "viva-news", "vivaco"]:
        return get_viva_news(payload)
    elif endpoint_id in ["inews", "inews-news", "inewsid"]:
        return get_inews_news(payload)
    elif endpoint_id in ["terkini", "terkini-news", "terkiniid"]:
        return get_terkini_news(payload)
    elif endpoint_id in ["cna", "cna-news", "cnaid"]:
        return get_cna_news(payload)
    elif endpoint_id in ["merdeka", "merdeka-news", "merdekacom"]:
        return get_merdeka_news(payload)
    elif endpoint_id in ["jakartapost", "jakarta-post", "jakpost", "thejakartapost"]:
        return get_jakartapost_news(payload)
    elif endpoint_id in ["removebg", "remove-bg"]:
        return get_removebg_image(payload)
    elif endpoint_id in ["upscale", "upscaler"]:
        return get_upscale_image(payload)
    elif endpoint_id in ["sepia", "sepia-effect"]:
        return get_sepia_image(payload)
    elif endpoint_id in ["invert", "invert-colors"]:
        return get_inverted_image(payload)
    elif endpoint_id in ["flip", "flip-image"]:
        return get_flipped_image(payload)
    elif endpoint_id in ["pixelate", "pixelate-effect"]:
        return get_pixelated_image(payload)
    elif endpoint_id in ["round-corners", "rounded-corners"]:
        return get_rounded_image(payload)
    elif endpoint_id in ["split", "split-image"]:
        return get_split_image(payload)
    elif endpoint_id in ["add-noise", "noise"]:
        return get_noised_image(payload)
    elif endpoint_id in ["blur", "blur-image"]:
        return get_blurred_image(payload)
    elif endpoint_id in ["sharpen", "sharpen-image"]:
        return get_sharpen_image(payload)
    elif endpoint_id in ["solarize", "solarize-effect"]:
        return get_solarized_image(payload)
    elif endpoint_id in ["glow", "glow-effect"]:
        return get_glow_image(payload)
    elif endpoint_id in ["posterize", "posterize-effect"]:
        return get_posterized_image(payload)
    elif endpoint_id in ["blurface", "blur-faces", "blurface-effect"]:
        return get_blurface_image(payload)
    elif endpoint_id in ["enhance", "enhance-image", "enhance-effect"]:
        return get_enhanced_image(payload)
    elif endpoint_id in ["qr", "qr-generator", "qr-code", "generate-qr", "generate"]:
        return get_qr_code(payload)
    elif endpoint_id in ["qr-decode", "qr-decoder", "decode-qr", "qr-read"]:
        return get_decoded_qr(payload)
    elif endpoint_id in ["tinyurl", "shorten", "shortlink"]:
        return get_short_url(payload)
    elif endpoint_id in ["isgd", "is.gd", "shorten-isgd"]:
        return get_isgd_url(payload)
    elif endpoint_id in ["vgd", "v.gd", "shorten-vgd"]:
        return get_vgd_url(payload)
    elif endpoint_id in ["ulvis", "ulvis.net", "shorten-ulvis"]:
        return get_ulvis_url(payload)
    elif endpoint_id in ["dagd", "da.gd", "shorten-dagd"]:
        return get_dagd_url(payload)
    elif endpoint_id in ["cleanuri", "cleanuri.com", "shorten-cleanuri"]:
        return get_cleanuri_url(payload)
    elif endpoint_id in ["llama", "llama-ai", "llama-chat"]:
        return get_llama_chat(payload)
    elif endpoint_id in ["groq", "groq-ai", "groq-chat", "groq-compound"]:
        return get_groq_chat(payload)
    elif endpoint_id in ["qwen", "qwen-ai", "qwen-chat", "qwen-compound"]:
        return get_qwen_chat(payload)
    elif endpoint_id in ["minimax", "minimax-ai", "minimax-chat", "minimax-m3"]:
        return get_minimax_chat(payload)
    elif endpoint_id in ["deepseek", "deepseek-ai", "deepseek-chat", "deepseek-v4", "deepseek-v4-pro"]:
        return get_deepseek_chat(payload)
    elif endpoint_id in ["deepseek-flash", "deepseek-v4-flash", "deepseek-ai-flash"]:
        return get_deepseek_flash_chat(payload)
    elif endpoint_id in ["kimi", "kimi-ai", "kimi-chat", "kimi-k2.6"]:
        return get_kimi_chat(payload)
    elif endpoint_id in ["glm", "glm-5.1", "z-ai-glm"]:
        return get_glm_chat(payload)
    elif endpoint_id in ["nemotron", "nemotron-3", "nemotron-3-ultra"]:
        return get_nemotron_chat(payload)
    elif endpoint_id in ["chatgpt", "gpt", "gpt-oss", "gpt-oss-120b", "openai-gpt"]:
        return get_chatgpt_chat(payload)
    elif endpoint_id in ["granite", "granite-4", "granite-4.0", "ibm-granite"]:
        return get_granite_chat(payload)
    elif endpoint_id in ["mistral", "mistral-ai", "mistral-medium", "mistral-chat"]:
        return get_mistral_chat(payload)
    elif endpoint_id in ["quillbot", "quillbot-ai", "quillbot-chat"]:
        return get_quillbot_chat(payload)
    elif endpoint_id in ["perplexity", "perplexity-ai", "perplexity-chat"]:
        return get_perplexity_chat(payload)
    elif endpoint_id in ["gemini", "gemini-ai", "gemini-chat", "google-gemini"]:
        return get_gemini_chat(payload)
    elif endpoint_id in ["pollinations", "pollinations-ai", "pollinations-chat"]:
        return get_pollinations_chat(payload)
    elif endpoint_id in ["asynt", "asynt-ai", "asyntai"]:
        return get_asynt_chat(payload)
    elif endpoint_id in ["muslimai", "muslim-ai", "muslim"]:
        return get_muslimai_chat(payload)
    elif endpoint_id in ["gitaai", "gita-ai", "gita", "askthegita"]:
        return get_gitaai_chat(payload)
    elif endpoint_id in ["powerbrainai", "powerbrain", "powerbrain-ai"]:
        return get_powerbrainai_chat(payload)
    elif endpoint_id in ["felo", "felo-ai", "feloai"]:
        return get_felo_chat(payload)
    elif endpoint_id in ["mathgpt", "math-gpt", "mathgpt-ai"]:
        return get_mathgpt_chat(payload)
    elif endpoint_id in ["jeeves", "jeeves-ai", "jeevesai"]:
        return get_jeeves_chat(payload)
    elif endpoint_id in ["sahabatai", "sahabat-ai", "sahabat"]:
        return get_sahabatai_chat(payload)
    elif endpoint_id in ["aya", "aya-ai", "ayaai", "cohere-aya"]:
        return get_aya_chat(payload)
    elif endpoint_id in ["ansari", "ansari-ai", "ansariai", "askansari"]:
        return get_ansari_chat(payload)
    elif endpoint_id in ["olabiba", "olabiba-ai", "labia"]:
        return get_olabiba_chat(payload)
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
