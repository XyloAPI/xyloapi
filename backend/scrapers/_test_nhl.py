import requests, json

headers = {'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

# Check context of items — looking for NHL-wide vs team-specific
r = requests.get('https://forge-dapi.d3.nhle.com/v2/content/en-us/stories?limit=25', headers=headers, timeout=10)
data = r.json()
items = data.get('items', [])

for item in items[:5]:
    ctx = item.get('context', {})
    ctx_slug = ctx.get('slug', 'N/A')
    tags = [t.get('title','') for t in item.get('tags', [])]
    thumb = item.get('thumbnail', {})
    img_url = thumb.get('templateUrl', '').replace('{formatInstructions}', 't_ratio16_9-size60/f_auto')
    pub = item.get('contentDate', '')[:10]
    title = item.get('title', '')[:60]
    print(f'{title}')
    print(f'  ctx={ctx_slug} tags={tags} pub={pub}')
    print(f'  img={img_url[:90]}')

# Try to filter only NHL-level content
print('\n--- NHL context filter ---')
nhl_filters = [
    'https://forge-dapi.d3.nhle.com/v2/content/en-us/stories?context.slug=nhl&limit=20',
    'https://forge-dapi.d3.nhle.com/v2/content/en-us/articles?context.slug=nhl&limit=20',
    'https://forge-dapi.d3.nhle.com/v2/content/en-us/news?context.slug=nhl&limit=20',
]
for url in nhl_filters:
    try:
        rp = requests.get(url, headers=headers, timeout=6)
        d = rp.json()
        items_count = len(d.get('items', []))
        if items_count > 0:
            sample = d['items'][0]
            print(f'{url.split("nhle.com")[1]}: {rp.status_code} items={items_count} title={sample.get("title","")[:50]}')
        else:
            print(f'{url.split("nhle.com")[1]}: {rp.status_code} items=0')
    except Exception as e:
        print(f'{url}: {rp.status_code} FAIL')
