import requests
from bs4 import BeautifulSoup
import time

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
}

CHANNEL_NAMES = {
    "antv": "ANTV", "gtv": "GTV", "indosiar": "INDOSIAR", "inewstv": "INEWS TV",
    "kompastv": "KOMPAS TV", "mdtv": "MDTV", "metrotv": "METRO TV", "mnctv": "MNCTV",
    "moji": "MOJI", "nettv": "NET TV", "rcti": "RCTI", "rtv": "RTV",
    "sctv": "SCTV", "trans7": "TRANS7", "transtv": "TRANSTV", "tvone": "TVONE",
    "tvri": "TVRI",
}

# Simple cache: {channel: (timestamp, html)}
_cache = {}
CACHE_TTL = 300  # 5 minutes

def _clean_jadwal(schedule):
    cleaned = []
    for item in schedule:
        program = item["program"]
        if "jadwaltv.net" in program.lower() or "Jadwal TV selengkapnya" in program:
            continue
        time = item["time"].replace(".", ":")
        cleaned.append({"time": time, "program": program})
    return cleaned

def get_jadwal_tv(payload):
    channel = (payload.get("channel") or "").strip().lower()
    if not channel:
        channel = "transtv"

    url = f"https://www.jadwaltv.net/channel/{channel}"

    # Check cache
    now = time.time()
    if channel in _cache:
        ts, html = _cache[channel]
        if now - ts < CACHE_TTL:
            soup = BeautifulSoup(html, "html.parser")
            return _parse_schedule(soup, channel)

    try:
        resp = requests.get(url, headers=HEADERS, timeout=30)
        if resp.status_code != 200:
            return {"success": False, "error": f"Channel '{channel}' not found"}
        html = resp.text
    except requests.Timeout:
        return {"success": False, "error": "Request timed out. The site may be slow, please try again."}
    except Exception as e:
        return {"success": False, "error": f"Failed to fetch: {str(e)}"}

    # Cache the HTML
    _cache[channel] = (now, html)

    soup = BeautifulSoup(html, "html.parser")
    return _parse_schedule(soup, channel)

def _parse_schedule(soup, channel):
    entry = soup.find(class_="entry-content") or soup.find("article") or soup
    tables = entry.find_all("table")

    schedule = []
    seen = set()
    for table in tables:
        rows = table.find_all("tr")
        for tr in rows:
            tds = tr.find_all("td")
            if len(tds) < 2:
                continue
            time_val = tds[0].get_text(strip=True)
            program = tds[1].get_text(strip=True)
            if not time_val or not program or time_val == "Jam" or program == "Acara":
                continue
            key = (time_val, program)
            if key in seen:
                continue
            seen.add(key)
            schedule.append({"time": time_val, "program": program})

    schedule = _clean_jadwal(schedule)

    if not schedule:
        return {"success": False, "error": "No schedule found for this channel"}

    display_name = CHANNEL_NAMES.get(channel, channel.upper())

    return {
        "success": True,
        "data": {
            "channel": display_name,
            "channel_slug": channel,
            "schedule": schedule,
            "total": len(schedule),
        }
    }
