import requests, re
from xml.etree import ElementTree as ET

headers_gnews = {'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'}
r = requests.get(
    'https://news.google.com/rss/search?q=site:washingtonpost.com&hl=en-US&gl=US&ceid=US:en',
    headers=headers_gnews, timeout=15
)
root = ET.fromstring(r.content)
items = root.find('channel').findall('item')
glink = items[0].findtext('link') or ''
title = (items[0].findtext('title') or '')[:40]

session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,*/*;q=0.9',
    'Accept-Language': 'en-US,en;q=0.9',
})

r2 = session.get(glink, allow_redirects=True, timeout=10)
html = r2.text
print(f'HTML size: {len(html)}')

# Search for all Google-hosted thumbnail images (encrypted-tbn or lh3)
all_imgs = re.findall(r'https://(?:encrypted-tbn\d+\.gstatic\.com/images\?[^"\s\\]+|lh3\.googleusercontent\.com/[^"\s\\]+)', html)
unique_imgs = list(dict.fromkeys(all_imgs))
print(f'Total unique Google-hosted images: {len(unique_imgs)}')
for img in unique_imgs[:10]:
    print(f'  {img[:120]}')

print()
# Also search for any washingtonpost image CDN
wapo_imgs = re.findall(r'https://(?:static|images|www)\.washingtonpost\.com/[^"\'<\s\\]+\.(?:jpg|png|jpeg|webp)[^"\'<\s\\]*', html)
print(f'WaPo CDN images: {len(wapo_imgs)}')
for img in wapo_imgs[:5]:
    print(f'  {img[:120]}')
