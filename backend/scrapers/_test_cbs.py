import requests, re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Accept': 'text/html,*/*'}
r = requests.get('https://www.cbsnews.com/news/us-iran-deal-memorandum-of-understanding-text/', headers=headers, timeout=10)
html = r.text[:10000]
print('Status:', r.status_code, 'size:', len(r.text))

m = re.search(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)
if not m:
    m = re.search(r'<meta[^>]+content=["\']([^"\']+)["\']\s+property=["\']og:image["\']', html, re.I)
print('og:image:', m.group(1)[:120] if m else 'NOT FOUND')

pub = re.search(r'<meta[^>]+property=["\']article:published_time["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)
print('published:', pub.group(1) if pub else 'NOT FOUND')

# Check thumbnail size options from RSS
thumb_url = 'https://assets3.cbsnewsstatic.com/hub/i/r/2026/06/17/d8f5acce-7461-4083-a2ce-9a3b169f8fa3/thumbnail/60x60/b3cb21994e410aa5489ea89e3689fc21/ap26168422564376.jpg'
for size in ['620x348', '960x540', '1280x720', '620x413']:
    u = thumb_url.replace('/thumbnail/60x60/', f'/thumbnail/{size}/')
    rh = requests.head(u, timeout=5)
    print(f'{size}: {rh.status_code}')
