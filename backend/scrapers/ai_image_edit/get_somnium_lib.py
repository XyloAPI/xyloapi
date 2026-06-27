import requests

r = requests.get("https://huggingface.co/spaces/vauth/somnium/raw/main/somnium.py")
if r.status_code == 200:
    with open("somnium_lib.py", "w", encoding="utf-8") as f:
        f.write(r.text)
    print("Done")
else:
    print("Failed:", r.status_code, r.text[:300])
