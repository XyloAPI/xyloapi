import requests, re, json

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Accept': 'text/html,*/*'}
url = 'https://www.aljazeera.com/news/2026/6/17/iran-confirms-that-mou-has-been-signed-electronically-by-both-sides'
r = requests.get(url, headers=headers, timeout=10)
html = r.text[:15000]

# og: tags
for prop in ['og:title', 'og:description', 'og:image', 'article:published_time']:
    m = re.search(rf'<meta[^>]+property=["\']({prop})["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)
    if not m:
        m = re.search(rf'<meta[^>]+content=["\']([^"\']+)["\']\s+property=["\']({prop})["\']', html, re.I)
    val = m.group(2) if m and len(m.groups()) > 1 else (m.group(1) if m else 'NOT FOUND')
    print(f'{prop}: {val[:100]}')

# JSON-LD
ld = re.search(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', html, re.DOTALL)
if ld:
    try:
        data = json.loads(ld.group(1))
        if isinstance(data, list): data = data[0]
        print('\nJSON-LD headline:', data.get('headline','')[:80])
        print('datePublished:', data.get('datePublished',''))
        img = data.get('image','')
        if isinstance(img, dict): img = img.get('url','')
        elif isinstance(img, list): img = img[0].get('url','') if img else ''
        print('image:', img[:100])
    except: pass
