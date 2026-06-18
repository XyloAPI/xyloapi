import requests, re
from xml.etree import ElementTree as ET

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
           'Accept': 'application/rss+xml, application/xml, */*'}

# WordPress-style category RSS
cat_urls = [
    'https://www.ms.now/category/news/feed/',
    'https://www.ms.now/category/politics/feed/',
    'https://www.ms.now/category/opinion/feed/',
    'https://www.ms.now/category/world/feed/',
    'https://www.ms.now/category/business/feed/',
    'https://www.ms.now/category/health/feed/',
    'https://www.ms.now/category/culture/feed/',
    'https://www.ms.now/category/sports/feed/',
    # tag-based
    'https://www.ms.now/tag/news/feed/',
]
for url in cat_urls:
    try:
        r = requests.get(url, headers=headers, timeout=6)
        ctype = r.headers.get('Content-Type', '')
        is_xml = 'xml' in ctype or r.text.strip().startswith('<?xml')
        print(f'{url}: {r.status_code} xml={is_xml} len={len(r.content)}')
    except Exception as e:
        print(f'{url}: FAIL')

print()
# Also check RSS item structure for image in content:encoded
r = requests.get('https://www.ms.now/rss/', headers=headers, timeout=10)
root = ET.fromstring(r.content)
channel = root.find('channel')
items = channel.findall('item')
print(f'Main RSS items: {len(items)}')

CONTENT_NS = 'http://purl.org/rss/1.0/modules/content/'
MEDIA_NS = 'http://search.yahoo.com/mrss/'

item = items[0]
print('Title:', item.findtext('title'))
print('Link:', item.findtext('link'))
encoded = item.find(f'{{{CONTENT_NS}}}encoded')
if encoded is not None and encoded.text:
    imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', encoded.text[:1000])
    print('Imgs in content:encoded:', imgs[:3])
mc = item.find(f'{{{MEDIA_NS}}}content')
print('media:content:', mc.attrib if mc is not None else 'NONE')
