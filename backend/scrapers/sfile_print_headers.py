from curl_cffi import requests
from bs4 import BeautifulSoup

session = requests.Session()
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

url = "https://sfile.co/agNixA1YkHq"
resp = session.get(url, headers=headers, impersonate="chrome120")
soup = BeautifulSoup(resp.text, "html.parser")
dw_url = soup.find(id="download").get("data-dw-url")

print("--- Requesting dw_url ---")
headers["Referer"] = url
resp2 = session.get(dw_url, headers=headers, impersonate="chrome120", allow_redirects=False)
print("Status code:", resp2.status_code)
print("Headers:")
for k, v in resp2.headers.items():
    print(f" - {k}: {v}")
