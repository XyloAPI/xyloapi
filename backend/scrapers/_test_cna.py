import requests
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
r = requests.get('https://www.channelnewsasia.com/singapore', headers=headers, timeout=15)
html = r.text

# All unique article links (pattern: /category/slug-NNNNNNN)
all_links = re.findall(r'href="(/[a-z-]+/[a-z0-9-]+-(\d{6,}))"', html)
seen = set()
unique = []
for url, nid in all_links:
    if nid not in seen:
        seen.add(nid)
        unique.append(url)

print(f"Unique articles: {len(unique)}")
for u in unique[:10]:
    print(u)
