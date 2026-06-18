import requests

CATEGORIES = {
    "latest":                  ("TIMES Terbaru", "all", None),
    "ekonomi":                 ("Ekonomi", "cat", "3"),
    "politik":                 ("Politik", "cat", "2"),
    "olahraga":                ("Olahraga", "cat", "6"),
    "tekno":                   ("Tekno", "cat", "4"),
    "wisata":                  ("Wisata", "cat", "8"),
    "pendidikan":              ("Pendidikan", "cat", "9"),
    "gaya-hidup":              ("Gaya Hidup", "cat", "12"),
    "kopi-times":              ("Kopi TIMES", "cat", "15"),
    "entertainment":           ("Entertainment", "cat", "21"),
    "peristiwa-nasional":      ("Peristiwa Nasional", "cat", "23"),
    "peristiwa-daerah":        ("Peristiwa Daerah", "cat", "24"),
    "peristiwa-internasional": ("Peristiwa Internasional", "cat", "25"),
    "english":                 ("English", "cat", "32"),
    "pemerintahan":            ("Pemerintahan", "cat", "34"),
    "hukum-kriminal":          ("Hukum dan Kriminal", "cat", "37"),
    "religi":                  ("Religi", "cat", "49"),
    "sosok":                   ("Sosok", "cat", "51"),
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "x-api-key": "VT926Xevq9juBMyR2Iddjm5OZRLP",
    "Content-Type": "application/json",
}


def get_times_news(payload):
    category = (payload.get("category") or "latest").strip().lower()

    if category not in CATEGORIES:
        valid = ", ".join(CATEGORIES.keys())
        return {"success": False, "error": f"Invalid category '{category}'. Valid: {valid}"}

    display_name, news_type, cat_id = CATEGORIES[category]

    url = "https://timesindonesia.co.id/api/news/all"
    params = {
        "news_type": news_type,
        "limit": "20",
        "offset": "0",
    }
    if cat_id:
        params["cat_id"] = cat_id

    try:
        resp = requests.get(url, params=params, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"Times Indonesia API returned HTTP {resp.status_code}"}
        res_data = resp.json()
    except Exception as e:
        return {"success": False, "error": f"Request failed: {str(e)}"}

    raw_articles = res_data.get("data", [])
    articles = []

    for art in raw_articles:
        title = art.get("news_title") or ""
        desc = art.get("news_description") or ""
        image = art.get("news_image_new") or ""
        date_pub = art.get("news_datepub") or ""

        # Construct article full URL
        url_path = art.get("url_ci4") or art.get("url_ci") or ""
        if url_path.startswith("/"):
            article_url = f"https://timesindonesia.co.id{url_path}"
        elif url_path:
            article_url = f"https://timesindonesia.co.id/{url_path}"
        else:
            article_url = f"https://timesindonesia.co.id/read/news/{art.get('news_id')}"

        articles.append({
            "title": title,
            "url": article_url,
            "description": desc,
            "published": date_pub,
            "image": image,
            "source": "TIMES Indonesia",
        })

    return {
        "success": True,
        "data": {
            "category": display_name,
            "source": "TIMES Indonesia",
            "articles": articles,
            "total": len(articles),
        }
    }
