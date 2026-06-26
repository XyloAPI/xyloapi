import requests
import json
import os

KODEPOS_URL = "https://cdn.jsdelivr.net/gh/sooluh/kodepos@main/data/kodepos.json"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
}

# Module-level cache
_kodepos_data = None

def _load_kodepos():
    global _kodepos_data
    if _kodepos_data is not None:
        return _kodepos_data
    try:
        resp = requests.get(KODEPOS_URL, headers=HEADERS, timeout=30)
        if resp.status_code != 200:
            raise Exception(f"HTTP {resp.status_code}")
        _kodepos_data = resp.json()
        return _kodepos_data
    except Exception as e:
        raise Exception(f"Failed to load kodepos data: {str(e)}")

def _match_entry(entry, query):
    """Check if an entry matches a text query across all text fields"""
    q = query.lower()
    fields = ["village", "district", "regency", "province"]
    return any(q in entry.get(f, "").lower() for f in fields)

def get_kodepos(payload):
    try:
        data = _load_kodepos()
    except Exception as e:
        return {"success": False, "error": str(e)}

    # Single query parameter: accepts name or code
    query = (payload.get("query") or "").strip()
    limit = 50
    if payload.get("limit"):
        try:
            limit = int(payload.get("limit"))
        except ValueError:
            pass

    is_code_search = query.isdigit()

    results = []
    for entry in data:
        if is_code_search:
            # Search by postal code prefix
            entry_code = str(entry.get("code", ""))
            if not entry_code.startswith(query):
                continue
        elif query:
            # Search by text across all fields
            if not _match_entry(entry, query):
                continue
        # If no query, return all (but limited)
        results.append(entry)

    # Group by code for cleaner output
    grouped = {}
    for r in results:
        c = r["code"]
        if c not in grouped:
            grouped[c] = {
                "code": c,
                "province": r["province"],
                "regency": r["regency"],
                "timezone": r.get("timezone"),
                "areas": [],
            }
        grouped[c]["areas"].append({
            "village": r["village"],
            "district": r["district"],
            "latitude": r.get("latitude"),
            "longitude": r.get("longitude"),
            "elevation": r.get("elevation"),
        })

    return {
        "success": True,
        "data": {
            "total": len(results),
            "total_grouped": len(grouped),
            "kodepos": list(grouped.values()),
        }
    }
