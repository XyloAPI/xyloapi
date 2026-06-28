import requests
from bs4 import BeautifulSoup
import re

URL = "https://cekweton.com/weton_jodoh.php"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
    "Referer": "https://cekweton.com/weton_jodoh.php",
    "Origin": "https://cekweton.com",
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "Cookie": "perf_dv6Tr4n=1",
}

# Kategori & maknanya berdasarkan Primbon
KATEGORI_MAP = {
    "Ratu":    "Sangat cocok dan harmonis. Kehidupan rumah tangga akan bahagia, saling menghormati, dan penuh keserasian.",
    "Pandu":   "Pasangan yang baik dan saling mendukung. Rumah tangga berjalan lancar meski sesekali ada gesekan kecil.",
    "Pegat":   "Kurang cocok. Berpotensi mengalami perpisahan atau banyak masalah dalam rumah tangga.",
    "Wasesa":  "Cukup baik. Salah satu pasangan cenderung dominan, namun dapat berjalan dengan komunikasi yang baik.",
    "Topo":    "Kurang harmonis. Kehidupan rumah tangga penuh dengan ujian dan perlu kesabaran ekstra.",
    "Tinari":  "Beruntung. Pasangan akan saling melengkapi dan mendatangkan rezeki serta kebahagiaan.",
    "Pesthi":  "Sangat cocok. Kehidupan rumah tangga damai, tentram, dan penuh kasih sayang.",
    "Demang":  "Cukup baik namun memerlukan usaha lebih untuk menjaga keharmonisan.",
    "Srikandi": "Baik. Salah satu pasangan berjiwa kuat dan menjadi tulang punggung keluarga.",
    "Ratu/Padu": "Campuran antara kecocokan dan pertentangan. Perlu saling pengertian.",
}

def _parse_result_text(text):
    """Extract value after colon from a <p> text."""
    if ":" in text:
        return text.split(":", 1)[1].strip()
    return text.strip()

def get_weton_jodoh(payload):
    birth1  = payload.get("birth1", "").strip()
    gender1 = payload.get("gender1", "").strip()
    birth2  = payload.get("birth2", "").strip()
    gender2 = payload.get("gender2", "").strip()

    if not birth1 or not birth2:
        return {"success": False, "error": "Parameter 'birth1' dan 'birth2' harus diisi (format: YYYY-MM-DD)"}
    if not gender1:
        gender1 = "Laki-laki"
    if not gender2:
        gender2 = "Perempuan"

    try:
        res = requests.post(URL, headers=HEADERS, data={
            "birth1": birth1,
            "gender1": gender1,
            "birth2": birth2,
            "gender2": gender2,
        }, timeout=15)
        res.raise_for_status()
    except Exception as e:
        return {"success": False, "error": f"Gagal mengambil data: {str(e)}"}

    soup = BeautifulSoup(res.content, "html.parser")
    results_div = soup.find("div", id="results")

    if not results_div:
        return {"success": False, "error": "Tidak ada hasil ditemukan dari server."}

    data = {}
    for p in results_div.find_all("p"):
        if "note" in p.get("class", []):
            continue
        strong = p.find("strong")
        if strong:
            key   = strong.get_text(strip=True)
            value = _parse_result_text(p.get_text())
            # Map keys
            if key == "Tanggal Lahir Anda":
                data["tanggal_lahir_1"] = value
            elif key == "Tanggal Lahir Pasangan":
                data["tanggal_lahir_2"] = value
            elif key == "Weton Anda":
                data["weton_1"] = value
            elif key == "Weton Pasangan":
                data["weton_2"] = value
            elif key == "Total Neptu":
                data["total_neptu"] = value
            elif key == "Kategori Kecocokan":
                data["kategori"] = value

    kategori = data.get("kategori", "")
    data["makna"] = KATEGORI_MAP.get(kategori, "Tidak ada keterangan khusus untuk kategori ini.")

    return {"success": True, "data": data}
