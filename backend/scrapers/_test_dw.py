import requests, re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Accept': 'text/html,*/*'}

# Fetch more HTML and look for any image patterns
url = 'https://www.dw.com/en/eu-g7-pledge-support-amid-drc-ebola-outbreak/a-77588901'
r = requests.get(url, headers=headers, timeout=10)
html = r.text

# Search all meta tags
metas = re.findall(r'<meta[^>]+>', html[:30000])
img_metas = [m for m in metas if 'image' in m.lower() or 'img' in m.lower() or 'og:' in m.lower()]
print('Meta tags with image/og:', len(img_metas))
for m in img_metas[:10]:
    print(' ', m[:150])

# Search all img src in HTML
imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html[:30000])
dw_imgs = [i for i in imgs if 'dw.com' in i or 'static' in i.lower()]
print('\nDW img tags:', dw_imgs[:5])

# Search for JSON with image data
json_imgs = re.findall(r'"(?:image|thumbnail|hero|cover)"\s*:\s*"(https?://[^"]+\.(?:jpg|jpeg|png|webp))', html[:50000], re.I)
print('\nJSON images:', json_imgs[:5])

# Search for any static.dw.com URL
static = re.findall(r'https?://static\.dw\.com/[^\s"\'<>]+', html[:50000])
print('\nstatic.dw.com URLs:', static[:5])
