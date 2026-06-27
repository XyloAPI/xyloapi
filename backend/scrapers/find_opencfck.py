import requests
import re

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

res = requests.get("https://headshotmaster.io/_nuxt/DBzpOCJD.js", headers=headers)
js_content = res.text

# Let's search for "openCfCk"
matches = [m.start() for m in re.finditer(r'openCfCk', js_content)]
print(f"Found {len(matches)} matches")
for idx in matches[:10]:
    start = max(0, idx - 150)
    end = min(len(js_content), idx + 250)
    print(f"Match context: {js_content[start:end].encode('ascii', errors='replace').decode('ascii')!r}")
