def download_mega(payload):
    """
    MEGA downloads are handled directly by the Node.js backend via megajs.
    This Python stub exists only to satisfy the scraper_runner import chain.
    The Node.js route intercepts /api/downloader/mega before calling Python.
    """
    url = payload.get("url") or payload.get("URLT") or payload.get("image")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }

    if not ("mega.nz" in url or "mega.co.nz" in url):
        return {
            "success": False,
            "error": "Invalid MEGA URL. Must be a mega.nz link."
        }

    return {
        "success": False,
        "error": "MEGA downloads are handled by the Node.js layer. If you see this error, the Node.js intercept failed."
    }
