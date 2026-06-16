import requests
import re
import urllib.parse
from bs4 import BeautifulSoup
import json

def normalize_ig_url(url):
    if "iqsaved.com" in url:
        parsed = urllib.parse.urlparse(url)
        segments = [s for s in parsed.path.split('/') if s]
        if segments:
            shortcode = segments[-1]
            return f"https://www.instagram.com/p/{shortcode}/"
    return url

def download_instagram(payload):
    url = payload.get("url") or payload.get("URLT") or payload.get("image")
    if url:
        if "iqsaved.com" in url:
            try:
                from iqsaved_downloader import download_iqsaved
                iq_res = download_iqsaved(payload)
                if iq_res.get("success"):
                    return iq_res
            except Exception:
                pass

        normalized_url = normalize_ig_url(url)
        # Create a copy of payload and replace url values
        payload = dict(payload)
        for key in ["url", "URLT", "image"]:
            if payload.get(key):
                payload[key] = normalized_url

    # Try the primary snapsave scraper first
    res = _download_instagram_primary(payload)
    if res.get("success"):
        return res
        
    # If primary fails, fallback to igvideodownloader (snapdownloader) scraper
    try:
        from snapdownloader_downloader import download_snapdownloader
        fallback_res = download_snapdownloader(payload)
        if fallback_res.get("success"):
            return fallback_res
    except Exception:
        pass

    # If that also fails, fallback to iqsaved scraper
    try:
        from iqsaved_downloader import download_iqsaved
        fallback_res2 = download_iqsaved(payload)
        if fallback_res2.get("success"):
            return fallback_res2
    except Exception:
        pass
        
    # If all fail, return the primary error
    return res

def _download_instagram_primary(payload):
    url = payload.get("url") or payload.get("URLT") or payload.get("image")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }

    # Normalize url format if needed
    action_url = "https://snapsave.app/action.php?lang=id"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Origin": "https://snapsave.app",
        "Referer": "https://snapsave.app/id",
        "Accept": "*/*",
    }
    
    post_data = {
        "url": url
    }

    try:
        session = requests.Session()
        # Initialize cookies/session
        session.get("https://snapsave.app/id", headers=headers, timeout=15)
        
        res = session.post(action_url, headers=headers, data=post_data, timeout=30)
        if res.status_code != 200:
            return {
                "success": False,
                "error": "Failed to download media."
            }

        text = res.text
        
        # Parse IIFE arguments from the bottom of the script
        match = re.search(r'\((["\'])(.*?)\1\s*,\s*(\d+)\s*,\s*(["\'])(.*?)\4\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\)', text)
        if not match:
            # Check if it directly returned an error in the response
            if "Unable to connect" in text or "Error" in text:
                return {
                    "success": False,
                    "error": "Failed to download media."
                }
            return {
                "success": False,
                "error": "Failed to download media."
            }

        h = match.group(2)
        u = int(match.group(3))
        n = match.group(5)
        t = int(match.group(6))
        e = int(match.group(7))
        r_val = int(match.group(8))

        # Decode the obfuscated script
        separator = n[e]
        chunks = h.split(separator)
        decoded_chars = []
        for chunk in chunks:
            if not chunk:
                continue
            s_val = chunk
            for j, char_n in enumerate(n):
                s_val = s_val.replace(char_n, str(j))
            try:
                val = int(s_val, e)
                decoded_chars.append(chr(val - t))
            except ValueError:
                continue

        raw_js = "".join(decoded_chars)
        decrypted_script = urllib.parse.unquote(raw_js)

        # Check for connection errors inside the decrypted script
        if "Unable to connect to Instagram server" in decrypted_script:
            return {
                "success": False,
                "error": "Failed to download media."
            }

        # Extract HTML content from JavaScript
        html_content = decrypted_script
        
        # Look for any quoted strings containing HTML tags or download items in Javascript
        patterns = [
            r'"([^"\\]*(?:\\.[^"\\]*)*)"',
            r"'([^'\\]*(?:\\.[^'\\]*)*)'",
            r"`([^`\\]*(?:\\.[^`\\]*)*)`"
        ]
        
        candidates = []
        for pat in patterns:
            for match_str in re.finditer(pat, decrypted_script):
                content = match_str.group(1)
                # Unescape Javascript string escapes
                unescaped = content.replace('\\"', '"').replace("\\'", "'").replace('\\/', '/').replace('\\n', '\n').replace('\\t', '\t')
                if any(k in unescaped for k in ["<div", "<table", "<a", "href=", "download"]):
                    candidates.append(unescaped)
                    
        if candidates:
            # Sort by length, longest candidate is likely the main HTML block
            candidates.sort(key=len, reverse=True)
            html_content = candidates[0]
        else:
            # Fallback regex if for some reason the string matching didn't yield results
            html_match = re.search(r'innerHTML\s*=\s*(["\'`])(.*?)\1', decrypted_script, re.DOTALL)
            if html_match:
                html_content = html_match.group(2).replace('\\"', '"').replace("\\'", "'").replace('\\/', '/')

        soup = BeautifulSoup(html_content, "html.parser")
        
        # Locate download links
        links = []
        # Find all <a> tags with href
        anchors = soup.find_all("a", href=True)
        for a in anchors:
            href = a.get("href")
            text = a.get_text(strip=True)
            classes = " ".join(a.get("class", []))
            
            # Skip advertisement/social sharing links
            href_lower = href.lower()
            if any(s in href_lower for s in ["facebook.com", "twitter.com", "instagram.com", "snapback"]):
                continue
                
            # Match download links
            is_download = False
            # Check keywords in text/class/href (including Indonesian "unduh")
            keywords = ["download", "unduh", "dl", "action", "/t/", "render", "button", "btn", "is-success", "click"]
            
            if any(kw in text.lower() for kw in keywords):
                is_download = True
            elif any(kw in classes.lower() for kw in keywords):
                is_download = True
            elif any(kw in href_lower for kw in keywords):
                is_download = True
            elif href.startswith("http") and not any(kw in href_lower for kw in ["ad", "advertise", "track"]):
                # Generic fallback for any http link that isn't obviously an ad
                is_download = True
                
            if is_download:
                label = text or "Download Media"
                # Deduplicate links
                if not any(link["url"] == href for link in links):
                    links.append({
                        "label": label,
                        "url": href
                    })

        if not links:
            # Final fallback: get any link at all that starts with http
            for a in soup.find_all("a", href=True):
                href = a.get("href")
                if href and href.startswith("http") and not any(s in href.lower() for s in ["facebook.com", "twitter.com", "instagram.com", "snapback"]):
                    links.append({
                        "label": a.get_text(strip=True) or "Download Link",
                        "url": href
                    })

        # Filter out promotional / app download links from the final list
        filtered_links = []
        skip_keywords = [
            "download more", "download other", "download with app", 
            "unduh dengan aplikasi", "unduh lainnya", "unduh lebih banyak",
            "app", "play store", "app store", "download another", "unduh lagi",
            "download video lain", "unduh video lain"
        ]
        for link in links:
            label_lower = link["label"].lower()
            if not any(sk in label_lower for sk in skip_keywords):
                filtered_links.append(link)
        links = filtered_links

        if not links:
            return {
                "success": False,
                "error": "Failed to download media."
            }

        # Extract cover image or preview if available
        cover_img = ""
        img_tag = soup.find("img")
        if img_tag:
            cover_img = img_tag.get("src", "")

        return {
            "success": True,
            "data": {
                "title": "Instagram Media Download",
                "creator": "Instagram User",
                "description": "Instagram video or image.",
                "cover": cover_img,
                "links": links
            }
        }

    except Exception as e:
        return {
            "success": False,
            "error": "Failed to download media."
        }

if __name__ == "__main__":
    test_payload = {"url": "https://www.instagram.com/p/DA_7l5pMRr7/"}
    print(json.dumps(download_instagram(test_payload), indent=2))
