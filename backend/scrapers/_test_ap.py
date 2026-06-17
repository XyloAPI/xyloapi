import requests, re
from html import unescape

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,*/*',
    'Accept-Language': 'en-US,en;q=0.9',
}

r = requests.get('https://apnews.com/world-news', headers=headers, timeout=10)
html = r.text

# Get unique article links
links = re.findall(r'href="(https://apnews\.com/article/[^"#?]+)"', html)
unique = list(dict.fromkeys(links))
print(f'Total unique links: {len(unique)}')

# Check if there's data-key or JSON with titles near the links
# Try to find article card structure
sample_url = unique[0]
slug = sample_url.split('/article/')[-1]
idx = html.find(slug)
if idx >= 0:
    snippet = html[max(0,idx-300):idx+500]
    # Find title near the link
    title_m = re.search(r'<h\d[^>]*class="[^"]*PagePromo-title[^"]*"[^>]*>.*?<span[^>]*>(.*?)</span>', snippet, re.DOTALL)
    if title_m:
        print('Title from card:', unescape(title_m.group(1).strip())[:100])
    else:
        # Look for any heading near the link
        h_m = re.search(r'<h[23][^>]*>(.*?)</h[23]>', snippet, re.DOTALL)
        if h_m:
            print('Heading:', unescape(re.sub(r'<[^>]+>','',h_m.group(1)).strip())[:100])
        else:
            print('Snippet around link:')
            print(re.sub(r'\s+',' ',snippet[:400]))
