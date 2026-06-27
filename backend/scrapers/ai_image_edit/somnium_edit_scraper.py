import io
import base64
import time
import requests
import sys
import os
import tempfile

from PIL import Image
from somnium import Somnium
from flux_scraper import UGUU_HEADERS

# Prompt Presets for different endpoints
PRESETS = {
    "botak": "bald person, completely shaved head, no hair, realistic, keep face same",
    "zombie": "zombie version of the person, scary decayed skin, horror, keep same face shape",
    "blonde": "blonde hair person, keep face same",
    "babi": "pig face version of the person, funny pig nose, pig ears, keep same clothes and background",
    "anime": "anime cartoon illustration of the person, high quality digital art style",
    "brewok": "person with thick beard and mustache, realistic, keep face same",
    "chibi": "chibi 3d cute character, small body, big head, claymation style, colorful, keep face details same",
    "dpr": "person sitting inside Indonesian DPR RI, wearing formal black suit and tie, Indonesian parliament house backdrop, realistic photo, keep face same",
    "kacamata": "person wearing stylish modern glasses, eyeglasses, realistic, keep face same",
    "hijab": "muslim woman wearing a beautiful neat hijab headscarf, realistic, keep face same",
    "lego": "lego minifigure toy of the person, lego style brick character, 3d plastic model, keep face features and hair style",
    "mekkah": "person standing in front of the Kaaba in Mekkah mosque, realistic, keep face same",
    "peci": "man wearing traditional Indonesian black peci songkok cap, realistic, keep face same",
    "putih": "person with bright fair white skin tone, glowing clean face, realistic, keep face same",
    "hitam": "person with dark black skin tone, realistic, keep face same",
    "tua": "very old version of the person, wrinkled face, grey hair, realistic, keep face shape same",
    "bayi": "cute young baby version of the person, toddler, small chubby face, realistic, keep face details same",
    "singapore": "person standing in Singapore Merlion park, Marina Bay Sands backdrop, realistic photo, keep face same",
    "malaysia": "person standing in Kuala Lumpur Malaysia, Petronas Twin Towers backdrop, realistic photo, keep face same",
    "thailand": "person standing in front of traditional temple in Bangkok Thailand, realistic photo, keep face same",
    "jawa": "a single person wearing classic Javanese Kanigaran attire. If female: black velvet Javanese kebaya with gold embroidery, brown batik skirt, hair in a clean Javanese sanggul bun with a small gold tiara, no hats. If male: black Javanese beskap jacket with gold embroidery, brown batik skirt, Javanese tall black kuluk hat on head. Realistic, keep face same",
    "pilot": "person wearing clean professional pilot uniform with pilot hat cap, realistic airplane cockpit dashboard background, keep face same",
    "kantoran": "person wearing formal professional suit and tie, modern office building workplace background, realistic photo, keep face same",
    "wisuda": "person wearing a university graduation academic gown and graduation cap, holding a rolled diploma scroll, graduation ceremony background, realistic, keep face same",
    "hantu": "scary horror spooky ghost version of the person, pale cracked skin, glowing empty eyes, messy long black hair, dark horror background, spooky, keep face same",
    "vampir": "gothic vampire version of the person, pale white skin, small sharp vampire fangs, red glowing eyes, dark gothic clothes, spooky castle backdrop, realistic, keep face same",
    "cyberpunk": "futuristic cyberpunk cyborg version of the person, high-tech glowing cybernetic implants on face, glowing neon accents, modern high-tech clothing, futuristic neon-lit city street at night, sci-fi style",
    "korea": "person wearing elegant traditional Korean Hanbok costume, beautiful Gyeongbokgung Palace courtyard background with cherry blossom trees, realistic photo, keep face same",
    "jepang": "person wearing traditional Japanese Kimono, beautiful Kyoto temple background with pink cherry blossoms, realistic photo, keep face same",
    "arab": "a single person wearing traditional Arab attire, elegant black abaya with matching hijab headscarf for woman, or white thobe with shemagh headscarf and agal headband for man, realistic photo, keep face same",
    "india": "a single person wearing traditional Indian attire, colorful silk sari for woman, or elegant sherwani suit for man, beautiful Taj Mahal palace background, realistic photo, keep face same",
    "dubai": "person standing in Dubai cityscape, Burj Khalifa and Burj Al Arab hotel background, wearing modern luxury clothes, realistic photo, keep face same",
    "gendut": "overweight version of the person, chubby fat round face, double chin, realistic portrait, keep face features same",
    "kurus": "very skinny thin version of the person, slim slender face shape, realistic portrait, keep face features same",
    "kekar": "extremely muscular bodybuilder physique, six pack abs, strong vascular arm veins, posing inside a gym, realistic, keep face same",
    "tni": "person wearing military army camouflage uniform with TNI badges, soldier, tactical gear, military training field background, realistic, keep face same",
    "polisi": "person wearing formal blue police uniform with police badge and cap, realistic police station background, keep face same",
    "dokter": "person wearing a white doctor lab coat, stethoscope around neck, hospital background, realistic, keep face same",
    "punk": "punk rock style person, mohawk hair, leather jacket with studs, piercings, street background, cool rebel attitude, keep face same",
    "kribo": "person with a huge afro kribo hairstyle, realistic hair texture, keep face same",
    "gondrong": "person with cool long hair, realistic flowy hair, keep face same",
    "sdm_tinggi": "nerdy intellectual smart person, wearing round wire glasses, neat haircut, collared shirt, studying in library background, high intelligence look, realistic, keep face same",
    "satan": "demonic satanic version of the person, dark horns growing from head, glowing yellow demonic eyes, hellfire brimstone background, scary fantasy art, keep face shape same",
    "vintage": "vintage polaroid photograph from 1980s, faded retro colors, grainy film texture, old school outfit, realistic, keep face same",
    "bareface": "person with absolutely no makeup, natural clean bare skin, no filters, raw candid portrait, realistic, keep face same"
}

DEFAULT_STYLE = "Realistic v4"


def generate_somnium_edit(payload, default_prompt, default_style=DEFAULT_STYLE):
    """
    Core generic function to perform image editing using Wombo Dream.ai API.
    Handles auto-padding/cropping for aspect ratio preservation.
    """
    try:
        image_data = payload.get("image") or payload.get("url") or payload.get("data") or ""
        if not image_data:
            return {"success": False, "error": "Missing required parameter: image or url"}

        prompt = payload.get("prompt") or default_prompt
        style_name = payload.get("style") or default_style

        # 1. Resolve Style ID from somnium list
        try:
            styles = Somnium.Styles()
            style_id = styles.get(style_name)
            if not style_id:
                style_id = list(styles.values())[0] if styles else 163
        except Exception as e:
            print(f"[somnium_edit] Warning getting style ID: {e}", file=sys.stderr)
            style_id = 163  # default Wombo Realistic v4 ID

        # 2. Get image bytes
        img_bytes = None
        if image_data.startswith("http://") or image_data.startswith("https://"):
            try:
                img_r = requests.get(
                    image_data,
                    headers={"User-Agent": "Mozilla/5.0"},
                    timeout=20
                )
                img_r.raise_for_status()
                img_bytes = img_r.content
            except Exception as e:
                return {"success": False, "error": f"Failed to download image: {e}"}
        else:
            try:
                b64 = image_data.split(",")[1] if "," in image_data else image_data
                img_bytes = base64.b64decode(b64)
            except Exception as e:
                return {"success": False, "error": f"Failed to decode base64: {e}"}

        if not img_bytes or len(img_bytes) < 1000:
            return {"success": False, "error": "Image data is empty or too small"}

        # 3. Read image dimensions & calculate aspect ratio mapping
        try:
            im = Image.open(io.BytesIO(img_bytes))
            orig_w, orig_h = im.size
            orig_ratio = orig_w / orig_h

            # Wombo free tier only supports 1:1 (ratio_1) or 9:16 (ratio_9_16)
            if abs(orig_ratio - 1.0) < abs(orig_ratio - 0.5625):
                target_ratio = 1.0
                wombo_ratio = "ratio_1"
            else:
                target_ratio = 0.5625
                wombo_ratio = "ratio_9_16"

            # Calculate padded dimensions to fit target ratio
            if orig_ratio > target_ratio:
                new_w = orig_w
                new_h = int(orig_w / target_ratio)
            else:
                new_h = orig_h
                new_w = int(orig_h * target_ratio)

            # Pad with solid white background to avoid distortion
            padded_im = Image.new(im.mode if im.mode in ("RGB", "RGBA") else "RGB", (new_w, new_h), (255, 255, 255))
            offset_x = (new_w - orig_w) // 2
            offset_y = (new_h - orig_h) // 2
            padded_im.paste(im, (offset_x, offset_y))

            # Save padded image to a temp file
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
                padded_im.save(tmp.name, format="JPEG", quality=95)
                tmp_path = tmp.name
        except Exception as e:
            return {"success": False, "error": f"Image preprocessing failed: {e}"}

        # 4. Generate via local somnium package (calls Wombo API directly)
        result_url = None
        try:
            result_url = Somnium.Generate(
                text=prompt,
                style=style_id,
                image=tmp_path,
                ratio=wombo_ratio,
                weight=0.65
            )
        except Exception as e:
            return {"success": False, "error": f"Somnium generation failed: {e}"}
        finally:
            try:
                if os.path.exists(tmp_path):
                    os.unlink(tmp_path)
            except:
                pass

        if not result_url:
            return {
                "success": False, 
                "error": "Somnium returned no output image (failed task). This usually happens if the input image or prompt triggered Wombo's NSFW/safety filter, or if Wombo API is temporarily rate-limited."
            }

        # 5. Download generated image & restore original aspect ratio (crop padding)
        try:
            out_r = requests.get(result_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=30)
            out_r.raise_for_status()
            out_bytes = out_r.content

            # Open, resize back to padded size, and crop to original size
            out_im = Image.open(io.BytesIO(out_bytes))
            out_im = out_im.resize((new_w, new_h), Image.Resampling.LANCZOS)
            cropped_im = out_im.crop((offset_x, offset_y, offset_x + orig_w, offset_y + orig_h))

            # Save cropped image back to bytes
            final_bytes_io = io.BytesIO()
            cropped_im.save(final_bytes_io, format="JPEG", quality=95)
            out_bytes = final_bytes_io.getvalue()
        except Exception as e:
            return {"success": False, "error": f"Failed to post-process output image: {e}"}

        # 6. Upload to Uguu for long-term CDN hosting
        try:
            filename = f"edit_{int(time.time())}.jpg"
            uguu_r = requests.post(
                "https://uguu.se/upload.php",
                files={"files[]": (filename, io.BytesIO(out_bytes), "image/jpeg")},
                headers=UGUU_HEADERS,
                timeout=45,
            )
            uguu_r.raise_for_status()
            uguu_data = uguu_r.json()
            if uguu_data.get("success") and uguu_data.get("files"):
                final_url = uguu_data["files"][0].get("url", "")
            else:
                raise Exception("Uguu upload failed")
        except Exception:
            final_url = result_url  # fallback to Wombo direct URL

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "url": final_url,
                "original": image_data if image_data.startswith("http") else image_data[:200]
            }
        }

    except Exception as e:
        return {"success": False, "error": f"Failed to run somnium_edit: {e}"}


# --- Endpoint Wrappers ---

def generate_to_botak(payload):
    return generate_somnium_edit(payload, PRESETS["botak"])

def generate_to_zombie(payload):
    return generate_somnium_edit(payload, PRESETS["zombie"])

def generate_to_blonde(payload):
    return generate_somnium_edit(payload, PRESETS["blonde"])

def generate_to_babi(payload):
    return generate_somnium_edit(payload, PRESETS["babi"])

def generate_to_anime(payload):
    return generate_somnium_edit(payload, PRESETS["anime"], default_style="Anime v3")

def generate_to_brewok(payload):
    return generate_somnium_edit(payload, PRESETS["brewok"])

def generate_to_chibi(payload):
    return generate_somnium_edit(payload, PRESETS["chibi"], default_style="3D v4")

def generate_to_dpr(payload):
    return generate_somnium_edit(payload, PRESETS["dpr"])

def generate_to_kacamata(payload):
    return generate_somnium_edit(payload, PRESETS["kacamata"])

def generate_to_hijab(payload):
    return generate_somnium_edit(payload, PRESETS["hijab"])

def generate_to_lego(payload):
    return generate_somnium_edit(payload, PRESETS["lego"], default_style="3D v4")

def generate_to_mekkah(payload):
    return generate_somnium_edit(payload, PRESETS["mekkah"])

def generate_to_peci(payload):
    return generate_somnium_edit(payload, PRESETS["peci"])

def generate_to_putih(payload):
    return generate_somnium_edit(payload, PRESETS["putih"])

def generate_to_hitam(payload):
    return generate_somnium_edit(payload, PRESETS["hitam"])

def generate_to_tua(payload):
    return generate_somnium_edit(payload, PRESETS["tua"])

def generate_to_bayi(payload):
    return generate_somnium_edit(payload, PRESETS["bayi"])

def generate_to_singapore(payload):
    return generate_somnium_edit(payload, PRESETS["singapore"])

def generate_to_malaysia(payload):
    return generate_somnium_edit(payload, PRESETS["malaysia"])

def generate_to_thailand(payload):
    return generate_somnium_edit(payload, PRESETS["thailand"])

def generate_to_jawa(payload):
    return generate_somnium_edit(payload, PRESETS["jawa"])

def generate_to_pilot(payload):
    return generate_somnium_edit(payload, PRESETS["pilot"])

def generate_to_kantoran(payload):
    return generate_somnium_edit(payload, PRESETS["kantoran"])

def generate_to_wisuda(payload):
    return generate_somnium_edit(payload, PRESETS["wisuda"])

def generate_to_hantu(payload):
    return generate_somnium_edit(payload, PRESETS["hantu"])

def generate_to_vampir(payload):
    return generate_somnium_edit(payload, PRESETS["vampir"])

def generate_to_cyberpunk(payload):
    return generate_somnium_edit(payload, PRESETS["cyberpunk"], default_style="Futurepunk V4")

def generate_to_korea(payload):
    return generate_somnium_edit(payload, PRESETS["korea"])

def generate_to_jepang(payload):
    return generate_somnium_edit(payload, PRESETS["jepang"])

def generate_to_arab(payload):
    return generate_somnium_edit(payload, PRESETS["arab"])

def generate_to_india(payload):
    return generate_somnium_edit(payload, PRESETS["india"])

def generate_to_dubai(payload):
    return generate_somnium_edit(payload, PRESETS["dubai"])

def generate_to_gendut(payload):
    return generate_somnium_edit(payload, PRESETS["gendut"])

def generate_to_kurus(payload):
    return generate_somnium_edit(payload, PRESETS["kurus"])

def generate_to_kekar(payload):
    return generate_somnium_edit(payload, PRESETS["kekar"])

def generate_to_tni(payload):
    return generate_somnium_edit(payload, PRESETS["tni"])

def generate_to_polisi(payload):
    return generate_somnium_edit(payload, PRESETS["polisi"])

def generate_to_dokter(payload):
    return generate_somnium_edit(payload, PRESETS["dokter"])

def generate_to_punk(payload):
    return generate_somnium_edit(payload, PRESETS["punk"])

def generate_to_kribo(payload):
    return generate_somnium_edit(payload, PRESETS["kribo"])

def generate_to_gondrong(payload):
    return generate_somnium_edit(payload, PRESETS["gondrong"])

def generate_to_sdm_tinggi(payload):
    return generate_somnium_edit(payload, PRESETS["sdm_tinggi"])

def generate_to_satan(payload):
    return generate_somnium_edit(payload, PRESETS["satan"])

def generate_to_vintage(payload):
    return generate_somnium_edit(payload, PRESETS["vintage"])

def generate_to_bareface(payload):
    return generate_somnium_edit(payload, PRESETS["bareface"])

