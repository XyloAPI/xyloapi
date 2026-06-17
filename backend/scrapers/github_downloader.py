import re
import requests

def parse_github_url(url: str):
    url = url.strip().rstrip("/")
    if not url.startswith("http"):
        url = "https://" + url
        
    pattern = r"https?://(?:www\.)?github\.com/([^/]+)/([^/]+)"
    match = re.match(pattern, url, re.IGNORECASE)
    if not match:
        return None
        
    owner = match.group(1)
    repo = match.group(2)
    path_suffix = url[match.end():]
    
    res = {
        "owner": owner,
        "repo": repo,
        "type": "repo",
        "branch": None,
        "path": None
    }
    
    if path_suffix.startswith("/releases"):
        res["type"] = "releases"
    elif path_suffix.startswith("/blob/"):
        parts = path_suffix[6:].split("/", 1)
        res["type"] = "blob"
        res["branch"] = parts[0]
        res["path"] = parts[1] if len(parts) > 1 else ""
    elif path_suffix.startswith("/tree/"):
        parts = path_suffix[6:].split("/", 1)
        res["type"] = "tree"
        res["branch"] = parts[0]
        res["path"] = parts[1] if len(parts) > 1 else ""
        
    return res

def format_size(bytes_size):
    if not bytes_size:
        return ""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes_size < 1024.0:
            return f"{bytes_size:.2f} {unit}"
        bytes_size /= 1024.0
    return f"{bytes_size:.2f} TB"

def download_github(payload):
    url = payload.get("url") or payload.get("URLT") or payload.get("image")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }
        
    parsed = parse_github_url(url)
    if not parsed:
        return {
            "success": False,
            "error": "Invalid GitHub repository or resource URL."
        }
        
    owner = parsed["owner"]
    repo = parsed["repo"]
    
    # Fetch main repo metadata to find default branch
    repo_api = f"https://api.github.com/repos/{owner}/{repo}"
    headers = {"User-Agent": "Mozilla/5.0"}
    
    desc = ""
    cover = f"https://github.com/{owner}.png"
    default_branch = "main"
    
    try:
        resp = requests.get(repo_api, headers=headers, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            desc = data.get("description") or ""
            cover = data.get("owner", {}).get("avatar_url") or cover
            default_branch = data.get("default_branch") or default_branch
        elif resp.status_code == 404:
            return {
                "success": False,
                "error": "GitHub repository not found (it may be private or deleted)."
            }
    except Exception:
        pass
        
    links = []
    
    # 2. Add resource-specific links first
    if parsed["type"] == "blob":
        branch = parsed["branch"] or default_branch
        path = parsed["path"]
        raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}"
        links.append({
            "label": f"DOWNLOAD RAW FILE ({path.split('/')[-1]})",
            "url": raw_url
        })
    elif parsed["type"] == "tree":
        # Specific folder
        branch = parsed["branch"] or default_branch
        path = parsed["path"]
        downgit_url = f"https://minhaskamal.github.io/DownGit/#/home?url={url}"
        links.append({
            "label": f"DOWNLOAD FOLDER '{path.split('/')[-1]}' ZIP (DownGit)",
            "url": downgit_url
        })
        
    # 3. Add default repo zipball/tarball download links
    links.append({
        "label": f"DOWNLOAD REPOSITORY ZIP ({default_branch})",
        "url": f"https://github.com/{owner}/{repo}/archive/refs/heads/{default_branch}.zip"
    })
    links.append({
        "label": f"DOWNLOAD REPOSITORY TAR.GZ ({default_branch})",
        "url": f"https://github.com/{owner}/{repo}/archive/refs/heads/{default_branch}.tar.gz"
    })
    
    # 4. Fetch releases if available
    try:
        releases_api = f"https://api.github.com/repos/{owner}/{repo}/releases"
        resp_rel = requests.get(releases_api, headers=headers, timeout=10)
        if resp_rel.status_code == 200:
            rel_data = resp_rel.json()
            for rel in rel_data[:5]:  # Get top 5 releases
                tag = rel.get("tag_name")
                links.append({
                    "label": f"RELEASE {tag} (ZIP)",
                    "url": f"https://github.com/{owner}/{repo}/archive/refs/tags/{tag}.zip"
                })
                links.append({
                    "label": f"RELEASE {tag} (TAR.GZ)",
                    "url": f"https://github.com/{owner}/{repo}/archive/refs/tags/{tag}.tar.gz"
                })
                # Assets
                for asset in rel.get("assets", []):
                    name = asset.get("name")
                    size = asset.get("size")
                    size_str = f" ({format_size(size)})" if size else ""
                    download_url = asset.get("browser_download_url")
                    if download_url:
                        links.append({
                            "label": f"RELEASE {tag} ASSET: {name}{size_str}",
                            "url": download_url
                        })
    except Exception:
        pass
        
    title = f"{owner} / {repo}"
    if parsed["type"] == "blob":
        title += f" - {parsed['path'].split('/')[-1]}"
    elif parsed["type"] == "tree":
        title += f" - {parsed['path'].split('/')[-1]}/"
        
    return {
        "success": True,
        "data": {
            "title": title[:100],
            "creator": owner,
            "description": desc or f"GitHub repository for {owner}/{repo}.",
            "cover": cover,
            "links": links
        }
    }
