import requests
import time
import os
import sys

from somnium import Somnium

# 1. Download image
print("[*] Downloading test image...")
img_r = requests.get("https://i.imgur.com/w64pN5J.jpeg", headers={"User-Agent": "Mozilla/5.0"})
img_bytes = img_r.content

tmp_path = "test_input.jpg"
with open(tmp_path, "wb") as f:
    f.write(img_bytes)

# 2. Run Somnium.Generate directly
print("[*] Calling Somnium.Generate...")
try:
    # Let's get the style ID for "Realistic v4" or similar
    styles = Somnium.Styles()
    style_id = styles.get("Realistic v4", 120)  # default to 120 if not found
    print(f"Style ID: {style_id}")
    
    # We will pass the local image path
    result = Somnium.Generate(
        text="bald person, completely shaved head, no hair, realistic, keep face same",
        style=style_id,
        image=tmp_path,
        weight=0.5
    )
    print("Result:", result)
except Exception as e:
    print("Error:", e)

# Clean up
if os.path.exists(tmp_path):
    os.remove(tmp_path)
