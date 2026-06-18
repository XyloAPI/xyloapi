import requests

# Test original URL from RSS (unmodified)
url = 'https://static01.nyt.com/images/2026/06/17/multimedia/17int-iran-ledeall-1-qzcl/17int-iran-ledeall-1-qzcl-mediumSquareAt3X.jpg'
r = requests.head(url, headers={'User-Agent': 'Mozilla/5.0'}, timeout=8)
print(f'Original (mediumSquareAt3X): {r.status_code}')
ct = r.headers.get('Content-Type', '')
print(f'Content-Type: {ct}')

# Try superJumbo suffix  
url2 = url.replace('-mediumSquareAt3X', '-superJumbo')
r2 = requests.head(url2, headers={'User-Agent': 'Mozilla/5.0'}, timeout=8)
print(f'superJumbo: {r2.status_code}')

# articleLarge
url3 = url.replace('-mediumSquareAt3X', '-articleLarge')
r3 = requests.head(url3, headers={'User-Agent': 'Mozilla/5.0'}, timeout=8)
print(f'articleLarge: {r3.status_code}')
