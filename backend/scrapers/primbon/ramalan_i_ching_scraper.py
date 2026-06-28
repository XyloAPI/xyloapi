import random
import requests
from bs4 import BeautifulSoup

def get_ramalan_i_ching(payload):
    hexa = payload.get("hexa")

    # If not provided or invalid, generate random 6-character binary string
    if not hexa or not isinstance(hexa, str) or len(hexa) != 6 or not all(c in "01" for c in hexa):
        hexa = "".join(random.choice(["0", "1"]) for _ in range(6))

    url = "https://www.primbon.com/ramalan_i_ching.php"
    post_data = {
        "hexa": hexa
    }
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    try:
        response = requests.post(url, data=post_data, headers=headers, timeout=20)
        if response.status_code != 200:
            return {"success": False, "error": f"Failed to fetch from Primbon (HTTP {response.status_code})"}

        soup = BeautifulSoup(response.content, "html.parser")

        b_tag = soup.find("b")
        title = b_tag.get_text().strip() if b_tag else "Unknown Hexagram"

        full_text = soup.get_text().strip()
        description = full_text.replace(title, "").replace("\r", "").replace("\n", "").strip()
        description = description.lstrip("/").strip()

        return {
            "success": True,
            "data": {
                "hexagram": hexa,
                "nama_hexagram": title,
                "deskripsi": description
            }
        }
    except Exception as e:
        return {"success": False, "error": f"Error occurred: {str(e)}"}
