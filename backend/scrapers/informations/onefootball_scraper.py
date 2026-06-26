import requests
import json
import re
import time

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
ONE_FOOTBALL_URL = "https://onefootball.com/id/pertandingan"

_cache = None
_cache_ts = 0
CACHE_TTL = 120  # 2 minutes

def _fetch_matches():
    global _cache, _cache_ts
    now = time.time()
    if _cache and now - _cache_ts < CACHE_TTL:
        return _cache

    try:
        resp = requests.get(ONE_FOOTBALL_URL, headers=HEADERS, timeout=30)
        if resp.status_code != 200:
            return {"success": False, "error": f"HTTP {resp.status_code}"}
        html = resp.text
    except Exception as e:
        return {"success": False, "error": f"Failed to fetch: {str(e)}"}

    # Extract __NEXT_DATA__
    scripts = re.findall(r'<script[^>]*id="__NEXT_DATA__"[^>]*>(.*?)</script>', html, re.DOTALL)
    if not scripts:
        return {"success": False, "error": "No Next.js data found"}

    try:
        data = json.loads(scripts[0])
        containers = data["props"]["pageProps"]["containers"]
    except Exception as e:
        return {"success": False, "error": f"Failed to parse data: {str(e)}"}

    # Parse matches grouped by competition
    competitions = []
    current_competition = None

    for c in containers:
        comp = c.get("type", {}).get("fullWidth", {}).get("component", {})
        ct = comp.get("contentType", {})
        case = ct.get("$case", "")

        if case == "sectionHeader":
            sh = ct.get("sectionHeader", {})
            current_competition = {
                "competition": sh.get("title", ""),
                "date": sh.get("subtitle", ""),
                "matches": [],
            }

        elif case == "matchCardsList":
            mc = ct.get("matchCardsList", {})
            section = mc.get("sectionHeader", {})
            comp_name = section.get("title", "") if section else ""
            match_cards = mc.get("matchCards", [])

            if not match_cards:
                continue

            # If no current competition, or this is a sub-group, create entry
            group = {
                "competition": comp_name,
                "date": "",
                "matches": [],
            }

            for m in match_cards:
                ht = m.get("homeTeam", {})
                at = m.get("awayTeam", {})
                
                # Get competition from tracking events if not in section header
                cname = comp_name
                if not cname:
                    for te in m.get("trackingEvents", []):
                        for param_name, param_data in (te.get("typedServerParameter", {}) or {}).items():
                            if param_name == "competition" and isinstance(param_data, dict):
                                cname = param_data.get("value", "")
                                break
                        if cname:
                            break

                match_data = {
                    "match_id": m.get("matchId"),
                    "status": m.get("timePeriod", ""),
                    "kickoff": m.get("kickoff", ""),
                    "kickoff_time": m.get("kickoffTimeFormatted", ""),
                    "home_team": {
                        "name": ht.get("name", ""),
                        "score": ht.get("score"),
                        "crest": ht.get("imageObject", {}).get("path", "") if ht.get("imageObject") else "",
                    },
                    "away_team": {
                        "name": at.get("name", ""),
                        "score": at.get("score"),
                        "crest": at.get("imageObject", {}).get("path", "") if at.get("imageObject") else "",
                    },
                    "competition": cname or "",
                    "link": m.get("link", ""),
                }
                group["matches"].append(match_data)

            # Merge with current competition or add as standalone
            if current_competition and not current_competition["competition"]:
                # This is the "Pertandingan Hari Ini" header -> merge matches into it
                competitions.append(group)
            else:
                # Separate competition group
                competitions.append(group)

            current_competition = None

    result = {
        "success": True,
        "data": {
            "source": "onefootball.com",
            "total_competitions": len(competitions),
            "total_matches": sum(len(c["matches"]) for c in competitions),
            "competitions": competitions,
        }
    }

    _cache = result
    _cache_ts = now
    return result

def get_jadwal_bola(payload):
    return _fetch_matches()
