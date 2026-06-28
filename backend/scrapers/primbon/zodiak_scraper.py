import requests
from bs4 import BeautifulSoup

def get_zodiak(payload):
    zodiak = payload.get("zodiak")
    if not zodiak:
        return {"success": False, "error": "Parameter 'zodiak' is required"}

    zod_lower = zodiak.strip().lower()
    valid_zodiacs = ["capricorn", "aquarius", "pisces", "aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagitarius"]

    if zod_lower == "sagittarius":
        zod_lower = "sagitarius"

    if zod_lower not in valid_zodiacs:
        return {"success": False, "error": f"Invalid zodiac name. Choose one of: {', '.join(valid_zodiacs)}"}

    url = f"https://www.primbon.com/zodiak/{zod_lower}.htm"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers, timeout=20)
        if response.status_code != 200:
            return {"success": False, "error": f"Failed to fetch from Primbon (HTTP {response.status_code})"}

        soup = BeautifulSoup(response.content, "html.parser")
        body_div = soup.find("div", id="body")
        if not body_div:
            return {"success": False, "error": "Failed to parse result from Primbon"}

        # Get h1 title
        title_tag = body_div.find("h1")
        title = title_tag.get_text().strip() if title_tag else ""

        # Extract text nodes
        texts = []
        for content in body_div.contents:
            if not content.name:
                txt = str(content).strip()
                if txt:
                    texts.append(txt)
            elif content.name not in ["a", "script", "style", "h1", "br"]:
                txt = content.get_text().strip()
                if txt:
                    texts.append(txt)

        range_val = ""
        sifat_val = ""
        info_pairs = {}
        karakter = ""
        asmara = ""

        for t in texts:
            t_clean = t.replace("\xa0", " ").strip()
            if not t_clean or "END: CONTENT" in t_clean or "BEGIN: CONTENT" in t_clean:
                continue

            if t_clean.startswith("(") and t_clean.endswith(")"):
                range_val = t_clean
                continue

            if ":" in t_clean:
                parts = t_clean.split(":", 1)
                k = parts[0].strip()
                v = parts[1].strip()
                if k.lower() in ["nomor keberuntungan", "aroma keberuntungan", "planet yang mengitari", "bunga keberuntungan", "warna keberuntungan", "batu keberuntungan", "elemen keberuntungan", "pasangan serasi"]:
                    info_pairs[k] = v
                    continue
                elif k.lower().startswith("asmara"):
                    asmara = t_clean
                    continue

            if not sifat_val and len(t_clean.split(",")) > 2:
                sifat_val = t_clean
                continue

            if "asmara" in t_clean.lower() or t_clean.lower().startswith("asmara"):
                asmara = t_clean
            else:
                if t_clean != title:
                    if karakter:
                        karakter += "\n\n" + t_clean
                    else:
                        karakter = t_clean

        return {
            "success": True,
            "data": {
                "zodiak": title,
                "rentang_tanggal": range_val,
                "sifat": sifat_val,
                "karakteristik": info_pairs,
                "penjelasan_karakter": karakter,
                "asmara": asmara
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Error occurred: {str(e)}"}
