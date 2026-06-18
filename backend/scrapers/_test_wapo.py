import requests, re
from xml.etree import ElementTree as ET

headers_gnews = {'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'}
headers_wapo = {
    'User-Agent': 'LinkedInBot/1.0 (compatible; Mozilla/5.0; Jakarta Commons-HttpClient/3.1 +http://www.linkedin.com)',
    'Accept': 'text/html,*/*',
    'Accept-Language': 'en-US,en;q=0.9',
}
headers_wapo2 = {
    'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
    'Accept': 'text/html,*/*',
}
headers_wapo3 = {
    'User-Agent': 'Twitterbot/1.0',
    'Accept': 'text/html,*/*',
}

# Fetch Google News RSS to get article titles
r = requests.get(
    'https://news.google.com/rss/search?q=site:washingtonpost.com&hl=en-US&gl=US&ceid=US:en',
    headers=headers_gnews, timeout=15
)
root = ET.fromstring(r.content)
channel = root.find('channel')
items = channel.findall('item')

# Get one article title, strip " - The Washington Post" suffix
item = items[0]
raw_title = item.findtext('title') or ''
title = re.sub(r'\s*[-–]\s*The Washington Post\s*$', '', raw_title).strip()
glink = item.findtext('link') or ''
print(f'Title: {title}')
print(f'Google link: {glink[:80]}')

# Try different UAs to access WaPo article
test_url = 'https://www.washingtonpost.com/technology/2026/06/16/anthropic-claude-white-house-trust/'
for name, hdrs in [('LinkedInBot', headers_wapo), ('facebookexternalhit', headers_wapo2), ('Twitterbot', headers_wapo3)]:
    try:
        r2 = requests.get(test_url, headers=hdrs, timeout=10)
        html = r2.text[:5000]
        og_img = re.search(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)
        print(f'{name}: HTTP {r2.status_code}, size={len(r2.text)}, og:image={"YES: " + og_img.group(1)[:60] if og_img else "NO"}')
    except Exception as e:
        print(f'{name}: FAIL - {e}')
