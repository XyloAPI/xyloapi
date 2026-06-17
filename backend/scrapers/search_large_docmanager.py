import re

with open("scribd_embed_large.html", "r", encoding="utf-8") as f:
    html = f.read()

# Look for docManager
matches = re.findall(r'docManager', html)
print("docManager occurrences in large HTML:", len(matches))

# Look for titles
title_match = re.search(r'<title>([^<]+)</title>', html)
if title_match:
    print("Title:", title_match.group(1).strip())
