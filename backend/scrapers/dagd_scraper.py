import socket
import requests
import time

# Store original getaddrinfo
_orig_getaddrinfo = socket.getaddrinfo
_resolved_ip = None

def _custom_getaddrinfo(host, port, *args, **kwargs):
    if host == "da.gd" and _resolved_ip:
        return _orig_getaddrinfo(_resolved_ip, port, *args, **kwargs)
    return _orig_getaddrinfo(host, port, *args, **kwargs)

# Hook socket.getaddrinfo
socket.getaddrinfo = _custom_getaddrinfo

def resolve_dagd_doh():
    global _resolved_ip
    # 1. Try Cloudflare DoH
    try:
        r = requests.get(
            "https://cloudflare-dns.com/dns-query?name=da.gd&type=A",
            headers={"accept": "application/dns-json"},
            timeout=5
        )
        if r.status_code == 200:
            data = r.json()
            answers = data.get("Answer", [])
            for ans in answers:
                if ans.get("type") == 1 and ans.get("data"):
                    _resolved_ip = ans.get("data")
                    return True
    except Exception:
        pass

    # 2. Try Google DoH
    try:
        r = requests.get(
            "https://dns.google/resolve?name=da.gd&type=A",
            timeout=5
        )
        if r.status_code == 200:
            data = r.json()
            answers = data.get("Answer", [])
            for ans in answers:
                if ans.get("type") == 1 and ans.get("data"):
                    _resolved_ip = ans.get("data")
                    return True
    except Exception:
        pass

    # 3. Hardcoded fallback Cloudflare IPs for da.gd
    _resolved_ip = "104.21.49.215"
    return True

def get_dagd_url(payload):
    try:
        url = payload.get("url") or payload.get("link") or ""
        if isinstance(url, list):
            url = url[0] if url else ""
            
        if not url:
            return {"success": False, "error": "Missing required parameter: url or link"}

        shorturl = payload.get("shorturl") or payload.get("short_url") or ""
        if isinstance(shorturl, list):
            shorturl = shorturl[0] if shorturl else ""

        # Filter out placeholder string (e.g. ":shorturl") sent by frontend Docs parameter form
        if shorturl == ":shorturl" or (isinstance(shorturl, str) and shorturl.startswith(":")):
            shorturl = ""

        # Resolve da.gd via DoH to bypass local ISP DNS hijacks/blocks
        resolve_dagd_doh()

        api_url = f"https://da.gd/shorten?url={requests.utils.quote(url)}"
        if shorturl:
            api_url += f"&shorturl={requests.utils.quote(shorturl)}"

        session = requests.Session()
        session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        })

        r = session.get(api_url, timeout=15)
        if r.status_code != 200:
            return {"success": False, "error": f"da.gd API returned status code {r.status_code}: {r.text.strip()}"}
        
        short_url = r.text.strip()
        if not short_url.startswith("http://") and not short_url.startswith("https://"):
            return {"success": False, "error": f"Invalid response from da.gd: {short_url}"}

        return {
            "success": True,
            "retrieved_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                "short": short_url,
                "original": url
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Failed to shorten URL: {str(e)}"}
