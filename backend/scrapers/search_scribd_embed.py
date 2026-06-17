import re

with open("scribd_embed.html", "r", encoding="utf-8") as f:
    html = f.read()

# Search for any URL patterns that might be the document content
urls = re.findall(r'https?://[^\s"\'\(\)]+', html)
unique_urls = list(set(urls))

print(f"Total unique URLs found: {len(unique_urls)}")
print("\nSome URLs:")
for u in sorted(unique_urls):
    if "scribd" in u or "html5" in u or "s3" in u or ".json" in u or "orig" in u:
        print(" -", u)

# Search for specific Javascript variables like access_key, document_key or jsonp
print("\nSearching Javascript variables:")
js_vars = ["access_key", "doc_key", "secret", "jsonp", "pages", "viewMode", "title", "original_format"]
for var in js_vars:
    matches = re.findall(rf'"{var}"\s*:\s*[^,\n}}]+|{var}\s*=\s*[^;\n]+', html, re.IGNORECASE)
    if matches:
        print(f"Variable '{var}' matches:")
        for m in matches[:5]:
            print("  ", m.strip())
