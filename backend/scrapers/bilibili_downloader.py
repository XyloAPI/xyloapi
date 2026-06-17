import os
import uuid
import json
import base64
import requests
import datetime
from urllib.parse import urlparse
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.asymmetric import rsa, padding as asympad
from cryptography.hazmat.primitives import hashes, padding as sympad, serialization

SERVER_PUBLIC_PEM = """-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvDU+dR2bSews55172x4L
s/ja+Dxt9ViZcj/nY0YodYo7l4jEKtEiCNV28lpFj3CkP4HKRCjL/jYkQNKGPwVg
gUCGr/jBF1FpDLsqa0kg+dtfkm5Xm9QAyMBeG/jPdl5BEPOVh33A1UkPO/Xw6kSH
rfghOUwBMzRBtXeYuJiYs5sKrf+Wy5sv708TI6G4hAPJG/69W4NNFJi/ipBNxntG
dAoUHpEy4iYsvBgiccE7U0MBDnSHSqBBtIdMMFRHARn/tc+jXaadS0a4YmhTygiN
eAJU4QuqAE25CsvkzIYIVEmlRXVcC0afw76XcwDpKBMVR5bEPzd3tMEfA+R34L1D
fQIDAQAB
-----END PUBLIC KEY-----"""

def sha256_bytes(s: str) -> bytes:
    h = hashes.Hash(hashes.SHA256())
    h.update(s.encode("utf-8"))
    return h.finalize()

def gen_client_keypair():
    priv = rsa.generate_private_key(public_exponent=65537, key_size=1024)
    priv_pem = priv.private_bytes(
        serialization.Encoding.PEM,
        serialization.PrivateFormat.PKCS8,
        serialization.NoEncryption()
    ).decode("utf-8")
    pub_pem = priv.public_key().public_bytes(
        serialization.Encoding.PEM,
        serialization.PublicFormat.SubjectPublicKeyInfo
    ).decode("utf-8")
    return priv_pem, pub_pem

def encrypt_request(payload: dict, client_pub_pem: str) -> dict:
    t = os.urandom(16).hex()
    key = sha256_bytes(t)
    iv = os.urandom(16)
    
    plaintext = json.dumps(payload, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    
    padder = sympad.PKCS7(128).padder()
    padded = padder.update(plaintext) + padder.finalize()
    
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
    encryptor = cipher.encryptor()
    ct = encryptor.update(padded) + encryptor.finalize()
    
    encrypted_data = base64.b64encode(iv + ct).decode("ascii")
    
    server_pub = serialization.load_pem_public_key(SERVER_PUBLIC_PEM.encode("utf-8"))
    encrypted_key = base64.b64encode(
        server_pub.encrypt(t.encode("utf-8"), asympad.PKCS1v15())
    ).decode("ascii")
    
    return {
        "encrypted_key": encrypted_key,
        "encrypted_data": encrypted_data,
        "client_public_key": client_pub_pem
    }

def decrypt_response(resp_dict: dict, client_priv_pem: str) -> dict:
    priv = serialization.load_pem_private_key(client_priv_pem.encode("utf-8"), password=None)
    n = priv.decrypt(base64.b64decode(resp_dict["encrypted_key"]), asympad.PKCS1v15()).decode("utf-8")
    key = sha256_bytes(n)
    
    raw = base64.b64decode(resp_dict["encrypted_data"])
    iv, ct = raw[:16], raw[16:]
    
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
    decryptor = cipher.decryptor()
    padded = decryptor.update(ct) + decryptor.finalize()
    
    unpadder = sympad.PKCS7(128).unpadder()
    plaintext = unpadder.update(padded) + unpadder.finalize()
    
    return json.loads(plaintext.decode("utf-8"))

def download_bilibili(payload):
    url = payload.get("url") or payload.get("URLT") or payload.get("image")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }

    headers = {
        'accept': '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'content-type': 'application/json',
        'origin': 'https://snapwc.com',
        'priority': 'u=1, i',
        'referer': 'https://snapwc.com/',
        'sec-ch-ua': '"Chromium";v="120", "Not-A.Brand";v="24", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }

    try:
        session = requests.Session()
        
        # 1. Initialize visitor cookies
        session.post('https://api.snapwc.com/api.visitor/init', json={}, headers=headers, timeout=15)
        
        # Sync cookies to headers if necessary
        cookie_dict = requests.utils.dict_from_cookiejar(session.cookies)
        if cookie_dict:
            cookie_str = "; ".join([f"{k}={v}" for k, v in cookie_dict.items()])
            headers['cookie'] = cookie_str

        # 2. Log events to match client behavior
        page_session_id = str(uuid.uuid4())
        client_timestamp = datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
        base_event_data = {
            "page_session_id": page_session_id,
            "client_timestamp": client_timestamp,
            "page_path": "/zh",
            "page_search": "",
            "page_hash": "",
            "referrer_host": "",
            "has_visitor_id": True
        }
        
        session.post('https://api.snapwc.com/api.event/log', headers=headers, json={
            "name": "frontend_visitor_init_reused",
            "data": base_event_data,
            "channel": "frontend_debug"
        }, timeout=15)

        parsed_url = urlparse(url)
        event2_data = base_event_data.copy()
        event2_data.update({
            "platform": "homepage",
            "url_present": True,
            "url_host": parsed_url.hostname or "",
            "url_protocol": parsed_url.scheme or "",
            "url_pathname": parsed_url.path or ""
        })
        
        session.post('https://api.snapwc.com/api.event/log', headers=headers, json={
            "name": "frontend_parse_submit_started",
            "data": event2_data,
            "channel": "frontend_debug"
        }, timeout=15)

        # 3. Check captcha status
        session.post('https://api.snapwc.com/api.captcha/is_required', headers=headers, json={
            "scenario": "parser",
            "data": {"url": url}
        }, timeout=15)

        # 4. Generate client RSA keys and encrypt request
        client_priv_pem, client_pub_pem = gen_client_keypair()
        req_body = encrypt_request({"url": url}, client_pub_pem)

        # 5. Send encrypted request to parse endpoint
        resp = session.post(
            'https://api.snapwc.com/api.parser/parse',
            headers=headers,
            json=req_body,
            timeout=30
        )
        
        if resp.status_code != 200:
            return {
                "success": False,
                "error": f"Bilibili Downloader connection failed with status: {resp.status_code}"
            }

        # 6. Decrypt and parse response
        resp_json = resp.json()
        if "encrypted_data" not in resp_json:
            error_msg = resp_json.get("msg") or "Failed to parse video data."
            return {
                "success": False,
                "error": f"Bilibili Downloader Error: {error_msg}"
            }

        raw_data = decrypt_response(resp_json, client_priv_pem)
        
        title = raw_data.get('title') or "Bilibili Video"
        cover = raw_data.get('cover') or ""
        
        links = []
        
        # Parse Muxed (Combined video + audio) streams first
        muxed_streams = raw_data.get("muxed") or []
        for s in muxed_streams:
            dl_url = s.get("url")
            if dl_url:
                quality = s.get("quality") or "Muxed"
                size_mb = f" ({round(int(s['size'])/1024/1024, 2)} MB)" if s.get("size") else ""
                links.append({
                    "label": f"DOWNLOAD VIDEO ({quality}){size_mb}".upper(),
                    "url": dl_url
                })
        
        # Parse Separate Videos streams next
        video_streams = raw_data.get("videos") or []
        for s in video_streams:
            dl_url = s.get("url")
            if dl_url:
                quality = s.get("quality") or "Video Only"
                size_mb = f" ({round(int(s['size'])/1024/1024, 2)} MB)" if s.get("size") else ""
                links.append({
                    "label": f"DOWNLOAD VIDEO ONLY ({quality}){size_mb}".upper(),
                    "url": dl_url
                })
        
        # Parse Separate Audios streams
        audio_streams = raw_data.get("audios") or []
        for s in audio_streams:
            dl_url = s.get("url")
            if dl_url:
                quality = s.get("quality") or "Audio"
                size_mb = f" ({round(int(s['size'])/1024/1024, 2)} MB)" if s.get("size") else ""
                links.append({
                    "label": f"DOWNLOAD AUDIO ({quality}){size_mb}".upper(),
                    "url": dl_url
                })

        if not links:
            return {
                "success": False,
                "error": "Bilibili Downloader Error: No download links found in response."
            }

        return {
            "success": True,
            "data": {
                "title": title,
                "creator": "Bilibili Creator",
                "description": "Bilibili video downloader",
                "cover": cover,
                "links": links
            }
        }

    except Exception as e:
        return {
            "success": False,
            "error": f"Bilibili Downloader Error: {str(e)}"
        }

if __name__ == "__main__":
    test_url = "https://www.bilibili.tv/id/video/4799619896056320"
    res = download_bilibili({"url": test_url})
    print(json.dumps(res, indent=2))
