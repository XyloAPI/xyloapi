import requests, re
from xml.etree import ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
MEDIA_NS = 'http://search.yahoo.com/mrss/'
DC_NS = 'http://purl.org/dc/elements/1.1/'

r = requests.get('https://time.com/feed/', headers=headers, timeout=10)
root = ET.fromstring(r.content)
items = root.find('channel').findall('item')

print(f'Items: {len(items)}')
for i, item in enumerate(items[:5]):
    link = item.findtext('link') or ''
    title = item.findtext('title') or ''
    mg = item.find(f'{{{MEDIA_NS}}}group')
    thumb = ''
    if mg is not None:
        mt = mg.find(f'{{{MEDIA_NS}}}thumbnail')
        if mt is not None:
            thumb = mt.get('url', '')
    print(f'\n[{i}] {title[:60]}')
    print(f'  media:thumbnail: {thumb[:80]}')

# Test og:image from a non-video article
url2 = items[2].findtext('link') or ''
print(f'\nTest article: {url2}')
rp = requests.get(url2, headers={'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html,*/*'}, timeout=8)
html = rp.text[:8000]
og = re.search(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)
if not og:
    og = re.search(r'<meta[^>]+content=["\']([^"\']+)["\']\s+property=["\']og:image["\']', html, re.I)
print(f'  og:image: {og.group(1)[:120] if og else "NOT FOUND"}')
print(f'  status: {rp.status_code}')
