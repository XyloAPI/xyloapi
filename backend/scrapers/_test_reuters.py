import requests, re
from xml.etree import ElementTree as ET

gnews_headers = {'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'}

# Check multiple Reuters category queries
cats = {
    'top': 'site:reuters.com',
    'world': 'site:reuters.com/world',
    'business': 'site:reuters.com/business',
    'technology': 'site:reuters.com/technology',
    'science': 'site:reuters.com/science',
    'sports': 'site:reuters.com/sports',
    'lifestyle': 'site:reuters.com/lifestyle',
    'legal': 'site:reuters.com/legal',
    'markets': 'site:reuters.com/markets',
}

for cat, q in cats.items():
    r = requests.get(
        f'https://news.google.com/rss/search?q={q}&hl=en-US&gl=US&ceid=US:en',
        headers=gnews_headers, timeout=10
    )
    root = ET.fromstring(r.content)
    items = root.find('channel').findall('item')
    # Count Reuters-only items
    reuters_items = [i for i in items if 'Reuters' in (i.find('source').text if i.find('source') is not None else '')]
    print(f'{cat}: total={len(items)}, reuters_only={len(reuters_items)}')
    for item in reuters_items[:2]:
        t = item.findtext('title') or ''
        pub = item.findtext('pubDate') or ''
        desc_html = item.findtext('description') or ''
        # Try extract real URL from description
        url_m = re.search(r'href="(https://www\.reuters\.com/[^"]+)"', desc_html)
        url = url_m.group(1) if url_m else 'google redirect'
        print(f'  {t[:60]} | {pub[:22]}')
        print(f'  URL: {url[:80]}')
