import requests, re, json

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Accept': 'text/html,*/*'}
r = requests.get('https://edition.cnn.com/2026/06/17/world/live-news/iran-war-g7-summit', headers=headers, timeout=10)
html = r.text

# Extract JSON-LD
ld_m = re.search(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', html, re.DOTALL)
if ld_m:
    try:
        data = json.loads(ld_m.group(1))
        if isinstance(data, list):
            data = data[0]
        print('headline:', data.get('headline', '')[:80])
        print('datePublished:', data.get('datePublished', ''))
        img = data.get('image', '')
        if isinstance(img, dict):
            img = img.get('url', '')
        print('image:', img[:100] if img else 'NONE')
        print('description:', str(data.get('description', ''))[:100])
    except Exception as e:
        print('JSON parse error:', e)
        print(ld_m.group(1)[:500])
else:
    print('NO JSON-LD FOUND')
    # check raw html
    idx = html.find('datePublished')
    print(html[max(0,idx-100):idx+200])
