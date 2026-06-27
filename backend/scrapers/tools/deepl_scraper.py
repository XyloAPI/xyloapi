import time
import random
import requests
import sys
import os
import json

try:
    from curl_cffi import requests as curl_requests
except ImportError:
    curl_requests = None

def getICount(translateText) -> int:
    return translateText.count("i")

def getRandomNumber() -> int:
    random.seed(time.time())
    num = random.randint(8300000, 8399998)
    return num * 1000

def getTimestamp(iCount: int) -> int:
    ts = int(time.time() * 1000)
    if iCount == 0:
        return ts
    iCount += 1
    return ts - ts % iCount + iCount

def _execute_translate(text, from_lang, to_lang, proxy=None):
    from_lang = from_lang.upper()
    to_lang = to_lang.upper()
    
    iCount = getICount(text)
    id = getRandomNumber()
    
    postData = {
        "jsonrpc": "2.0",
        "method": "LMT_handle_texts",
        "id": id,
        "params": {
            "texts": [{"text": text, "requestAlternatives": 0}],
            "splitting": "newlines",
            "lang": {
                "source_lang_user_selected": from_lang,
                "target_lang": to_lang,
            },
            "timestamp": getTimestamp(iCount),
            "commonJobParams": {
                "wasSpoken": False,
                "transcribe_as": "",
            },
        },
    }
    
    postDataStr = json.dumps(postData, ensure_ascii=False)

    if (id + 5) % 29 == 0 or (id + 3) % 13 == 0:
        postDataStr = postDataStr.replace('"method":"', '"method" : "', -1)
    else:
        postDataStr = postDataStr.replace('"method":"', '"method": "', -1)

    headers = {
        "Content-Type": "application/json",
        "Accept": "*/*",
        "x-app-os-name": "iOS",
        "x-app-os-version": "16.3.0",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "x-app-device": "iPhone13,2",
        "User-Agent": "DeepL-iOS/2.9.1 iOS 16.3.0 (iPhone13,2)",
        "x-app-build": "510265",
        "x-app-version": "2.9.1",
        "Connection": "keep-alive",
    }

    proxies_dict = {"http": proxy, "https": proxy} if proxy else None

    try:
        if curl_requests is not None:
            r = curl_requests.post(
                "https://www2.deepl.com/jsonrpc",
                data=postDataStr.encode("utf-8"),
                headers=headers,
                proxies=proxies_dict,
                impersonate="chrome120",
                timeout=8
            )
        else:
            r = requests.post(
                "https://www2.deepl.com/jsonrpc",
                data=postDataStr.encode("utf-8"),
                headers=headers,
                proxies=proxies_dict,
                timeout=8
            )

        if r.status_code != 200:
            return {"success": False, "error": f"DeepL returned status code {r.status_code}"}

        res_json = r.json()
        if "error" in res_json:
            return {"success": False, "error": res_json["error"].get("message", "Unknown DeepL RPC error")}

        result = res_json.get("result")
        if not result or "texts" not in result or len(result["texts"]) == 0:
            return {"success": False, "error": "Empty or invalid response from DeepL translation service"}

        translated_item = result["texts"][0]
        translated_text = translated_item.get("text", "")
        detected_lang = result.get("lang", from_lang)

        return {
            "success": True,
            "translated": translated_text.strip(),
            "detected_lang": detected_lang.lower()
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


def translate_deepl(payload):
    """
    Translate text using DeepL's web interface via JSON-RPC.
    Supports proxy rotation as fallback when rate limited,
    or official DEEPL_API_KEY if configured in .env.
    """
    text = payload.get("text") or payload.get("q")
    if not text:
        return {"success": False, "error": "Failed to process request"}

    to_lang = (payload.get("to") or payload.get("tl") or "id").upper()
    from_lang = (payload.get("from") or payload.get("sl") or "auto").upper()

    # 1. Try direct connection first
    res = _execute_translate(text, from_lang, to_lang)
    if res.get("success"):
        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "translated": res["translated"],
                "source": text.strip(),
                "from": res["detected_lang"],
                "to": to_lang.lower()
            }
        }
    else:
        print(f"Direct connection failed: {res.get('error')}", file=sys.stderr)

    # 2. Try proxy rotation fallback
    try:
        from ideogram_scraper import find_working_proxies
        # Find 4 working proxies (try cached ones first)
        proxies = find_working_proxies(count=4, force_new=False)
        for proxy in proxies:
            res = _execute_translate(text, from_lang, to_lang, proxy=proxy)
            if res.get("success"):
                return {
                    "success": True,
                    "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
                    "data": {
                        "translated": res["translated"],
                        "source": text.strip(),
                        "from": res["detected_lang"],
                        "to": to_lang.lower()
                    }
                }
            else:
                print(f"Proxy {proxy} failed: {res.get('error')}", file=sys.stderr)

        # If all cached proxies failed, harvest fresh new proxies
        print("All cached proxies failed. Harvesting fresh proxies...", file=sys.stderr)
        fresh_proxies = find_working_proxies(count=4, force_new=True)
        for proxy in fresh_proxies:
            res = _execute_translate(text, from_lang, to_lang, proxy=proxy)
            if res.get("success"):
                return {
                    "success": True,
                    "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
                    "data": {
                        "translated": res["translated"],
                        "source": text.strip(),
                        "from": res["detected_lang"],
                        "to": to_lang.lower()
                    }
                }
            else:
                print(f"Fresh proxy {proxy} failed: {res.get('error')}", file=sys.stderr)
    except Exception as proxy_ex:
        print(f"Proxy fallback error: {str(proxy_ex)}", file=sys.stderr)

    # If all fail, return uniform error message to comply with user rules
    return {"success": False, "error": "Failed to process request"}
