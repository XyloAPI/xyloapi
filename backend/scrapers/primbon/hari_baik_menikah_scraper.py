import requests
from bs4 import BeautifulSoup

URL = "https://cekweton.com/hari_baik_untuk_menikah.php"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
    "Referer": "https://cekweton.com/hari_baik_untuk_menikah.php",
    "Origin": "https://cekweton.com",
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "Cookie": "perf_dv6Tr4n=1",
}

def _extract_after_colon(p_tag):
    txt = p_tag.get_text(" ", strip=True)
    if ":" in txt:
        return txt.split(":", 1)[1].strip()
    return txt.strip()

def get_hari_baik_menikah(payload):
    birth1 = payload.get("birth1", "").strip()
    birth2 = payload.get("birth2", "").strip()

    if not birth1 or not birth2:
        return {"success": False, "error": "Parameter 'birth1' dan 'birth2' harus diisi (format: YYYY-MM-DD)"}

    try:
        res = requests.post(URL, headers=HEADERS, data={"birth1": birth1, "birth2": birth2}, timeout=15)
        res.raise_for_status()
    except Exception as e:
        return {"success": False, "error": f"Gagal mengambil data: {str(e)}"}

    soup = BeautifulSoup(res.content, "html.parser")
    results_div = soup.find("div", id="results")

    if not results_div:
        return {"success": False, "error": "Tidak ada hasil dari server."}

    data = {}

    for p in results_div.find_all("p"):
        strong = p.find("strong")
        if not strong:
            continue
        key = strong.get_text(strip=True).rstrip(":")
        val = _extract_after_colon(p)
        if "Tanggal Lahir Anda" in key:
            data["tanggal_lahir_1"] = val
        elif "Tanggal Lahir Pasangan" in key:
            data["tanggal_lahir_2"] = val
        elif "Weton Anda" in key:
            data["weton_1"] = val
        elif "Weton Pasangan" in key:
            data["weton_2"] = val
        elif "Total Neptu" in key:
            data["total_neptu"] = val

    hari_disarankan = []
    ul = results_div.find("ul")
    if ul:
        for li in ul.find_all("li"):
            strong_date = li.find("strong")
            if strong_date:
                date_str = strong_date.get_text(strip=True)
                full_txt = li.get_text(" ", strip=True)
                detail = full_txt.replace(date_str, "").strip().lstrip("–").strip()
                hari_disarankan.append({"tanggal": date_str, "weton_detail": detail})

    data["hari_disarankan"] = hari_disarankan[:10]

    return {"success": True, "data": data}
