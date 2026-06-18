import requests, re
from xml.etree import ElementTree as ET

gnews_headers = {'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'}

r = requests.get('https://news.google.com/rss/search?q=site:news24.com&hl=en&gl=ZA&ceid=ZA:en',
                 headers=gnews_headers, timeout=10)
root = ET.fromstring(r.content)
items = root.find('channel').findall('item')
print(f'Total items: {len(items)}')

# Check item structure
item = items[0]
print('\n--- First item ---')
for child in item:
    tag = child.tag.split('}')[-1] if '}' in child.tag else child.tag
    val = (child.text or '')[:100] if child.text else repr(child.attrib)[:80]
    print(f'  {tag}: {val}')

# Try section-specific searches
sections = [
    ('south-africa', 'site:news24.com/southafrica'),
    ('world', 'site:news24.com/world'),
    ('politics', 'site:news24.com/politics'),
    ('business', 'site:news24.com/business'),
    ('sport', 'site:news24.com/sport'),
    ('technology', 'site:news24.com/technology'),
]
print('\n--- Section feeds ---')
for name, query in sections:
    url = f'https://news.google.com/rss/search?q={query}&hl=en&gl=ZA&ceid=ZA:en'
    try:
        fr = requests.get(url, headers=gnews_headers, timeout=6)
        froot = ET.fromstring(fr.content)
        fitems = froot.find('channel').findall('item')
        n24_items = [i for i in fitems if 'news24' in (i.find('source').text or '' if i.find('source') is not None else '').lower()]
        print(f'  {name}: {len(fitems)} total, {len(n24_items)} news24')
    except Exception as e:
        print(f'  {name}: FAIL')
