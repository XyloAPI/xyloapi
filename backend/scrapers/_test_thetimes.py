import requests, re
from xml.etree import ElementTree as ET

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
           'Accept': 'text/html,application/xhtml+xml,*/*'}

# Test direct access
r = requests.get('https://www.thetimes.com/', headers=headers, timeout=8)
print(f'Direct: {r.status_code} size={len(r.text)}')

# Test RSS feeds
feeds = [
    'https://www.thetimes.com/rss/',
    'https://www.thetimes.com/feed/',
    'https://feeds.thetimes.co.uk/web/standard/world/rss',
    'https://www.thetimes.co.uk/rss/',
    'https://www.thetimes.co.uk/topic/world/rss',
    'https://feeds.thetimes.co.uk/tto/news/rss/latest',
    'https://www.thetimes.com/sitemap.xml',
]
for url in feeds:
    try:
        fr = requests.get(url, headers={**headers, 'Accept': 'application/rss+xml,*/*'}, timeout=6)
        ctype = fr.headers.get('Content-Type', '')
        start = fr.text.strip()[:50].replace('\n', '')
        print(f'{url}: {fr.status_code} CT={ctype[:30]} start={start[:40]}')
    except Exception as e:
        print(f'{url}: FAIL - {str(e)[:60]}')

print()
# Try Google News RSS for The Times
gnews_headers = {'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)'}
r2 = requests.get('https://news.google.com/rss/search?q=site:thetimes.com&hl=en-GB&gl=GB&ceid=GB:en', headers=gnews_headers, timeout=8)
root = ET.fromstring(r2.content)
items = root.find('channel').findall('item')
times_items = [i for i in items if 'Times' in (i.find('source').text if i.find('source') is not None else '')]
print(f'Google News: total={len(items)}, times={len(times_items)}')
if times_items:
    print('Sample:', times_items[0].findtext('title')[:70])
    print('pubDate:', times_items[0].findtext('pubDate')[:22])
    src = times_items[0].find('source')
    print('Source:', src.text if src is not None else 'N/A')
