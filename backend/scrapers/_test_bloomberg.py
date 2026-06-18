import requests, re
from xml.etree import ElementTree as ET

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

# Check item structure
r = requests.get('https://feeds.bloomberg.com/markets/news.rss', headers=headers, timeout=10)
root = ET.fromstring(r.content)
channel = root.find('channel')
items = channel.findall('item')
print(f'Markets items: {len(items)}')

MEDIA_NS = 'http://search.yahoo.com/mrss/'

item = items[0]
print('\n--- First item ---')
for child in item:
    tag = child.tag.split('}')[-1] if '}' in child.tag else child.tag
    ns = child.tag.split('}')[0].strip('{') if '}' in child.tag else ''
    val = (child.text or '')[:100] if child.text else repr(child.attrib)[:100]
    print(f'  [{ns[-25:] if ns else ""}] {tag}: {val}')

# Check more feeds
extra = [
    'https://feeds.bloomberg.com/bview/news.rss',
    'https://feeds.bloomberg.com/wealth/news.rss',
    'https://feeds.bloomberg.com/sports/news.rss',
    'https://feeds.bloomberg.com/healthcare/news.rss',
    'https://feeds.bloomberg.com/law/news.rss',
    'https://feeds.bloomberg.com/pursuits/news.rss',
    'https://feeds.bloomberg.com/citylab/news.rss',
    'https://feeds.bloomberg.com/businessweek/news.rss',
]
print('\n--- Extra feeds ---')
for url in extra:
    try:
        fr = requests.get(url, headers=headers, timeout=6)
        print(f'{url.split("/")[-2]}: {fr.status_code} len={len(fr.content)}')
    except Exception as e:
        print(f'{url}: FAIL')
