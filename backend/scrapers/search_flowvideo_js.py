from bs4 import BeautifulSoup

with open("flowvideo.html", "r", encoding="utf-8") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")
scripts = soup.find_all("script")
# We know script 4 is inline length 12664
js_content = scripts[4].string

# Let's save it to flowvideo_player.js
with open("flowvideo_player.js", "w", encoding="utf-8") as f:
    f.write(js_content)
print("Saved flowvideo_player.js. Length:", len(js_content))
