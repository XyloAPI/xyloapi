import requests
from xml.etree import ElementTree as ET

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
MEDIA_NS = 'http://search.yahoo.com/mrss/'

r = requests.get('https://www.theguardian.com/world/rss', headers=HEADERS, timeout=10)
root = ET.fromstring(r.content)
channel = root.find('channel')
item = channel.findall('item')[0]

# Get all media:content elements
mcs = item.findall(f'{{{MEDIA_NS}}}content')
print(f'media:content count: {len(mcs)}')
for mc in mcs:
    w = mc.get('width', '?')
    url = mc.get('url', '')
    print(f'  width={w}: {url[:120]}')
    rh = requests.head(url, timeout=5)
    print(f'    Status: {rh.status_code}')
