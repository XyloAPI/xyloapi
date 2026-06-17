with open("sfile_dw.html", "r", encoding="utf-8") as f:
    html = f.read()

import re
matches = re.finditer(r"document\.cookie", html)
for m in matches:
    start = max(0, m.start() - 50)
    end = min(len(html), m.end() + 150)
    print("MATCH:", html[start:end].replace('\n', ' '))
