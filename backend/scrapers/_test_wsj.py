import requests, re
from xml.etree import ElementTree as ET

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', 'Accept': 'text/html,*/*'}

# Test direct WSJ article page
url = 'https://www.wsj.com/articles/palestinians-flock-back-to-northern-gaza-on-foot-after-hostage-release-breakthrough-3f60e2db'
r = requests.get(url, headers=headers, timeout=10)
print(f'WSJ article: {r.status_code} size={len(r.text)}')
html = r.text[:5000]
og_img = re.search(r'property=["\']og:image["\']\s+content=["\']([^"\']+)["\']', html, re.I)
og_title = re.search(r'property=["\']og:title["\']\s+content=["\']([^"\']+)["\']', html, re.I)
print('og:title:', og_title.group(1)[:80] if og_title else 'NOT FOUND')
print('og:image:', og_img.group(1)[:100] if og_img else 'NOT FOUND')

print()
# Test Google News RSS for WSJ
gnews_headers = {'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'}
cats = {
    'top': 'site:wsj.com',
    'business': 'site:wsj.com/business',
    'markets': 'site:wsj.com/markets',
    'tech': 'site:wsj.com/tech',
    'politics': 'site:wsj.com/politics',
    'opinion': 'site:wsj.com/opinion',
    'world': 'site:wsj.com/world',
    'economy': 'site:wsj.com/economy',
}
for cat, q in cats.items():
    r = requests.get(f'https://news.google.com/rss/search?q={q}&hl=en-US&gl=US&ceid=US:en', headers=gnews_headers, timeout=8)
    root = ET.fromstring(r.content)
    items = root.find('channel').findall('item')
    wsj_items = [i for i in items if 'Wall Street Journal' in (i.find('source').text if i.find('source') is not None else '') or 'WSJ' in (i.find('source').text if i.find('source') is not None else '')]
    print(f'{cat}: total={len(items)}, wsj={len(wsj_items)}')
    if wsj_items:
        t = wsj_items[0].findtext('title') or ''
        pub = wsj_items[0].findtext('pubDate') or ''
        print(f'  Sample: {t[:60]} | {pub[:22]}')
