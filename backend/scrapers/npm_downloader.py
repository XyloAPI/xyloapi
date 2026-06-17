import re
import requests

def parse_npm_url(url: str):
    """
    Extracts npm package name and version from npmjs.com URLs or package name strings.
    Supported formats:
    - https://www.npmjs.com/package/react
    - https://www.npmjs.com/package/react/v/18.2.0
    - https://www.npmjs.com/package/@babel/core
    - react
    - @babel/core
    """
    url = url.strip()
    
    # URL patterns
    # Handles scoped and unscoped packages
    url_pattern = r"npmjs\.com/package/(@?[a-zA-Z0-9-._]+(?:/[a-zA-Z0-9-._]+)?)(?:/v/([a-zA-Z0-9-._]+))?"
    match = re.search(url_pattern, url)
    
    if match:
        pkg_name = match.group(1)
        version = match.group(2)
        return pkg_name, version
        
    # Check if it's a scope/name structure or simple name string
    # e.g., "@babel/core" or "react"
    # Regex to validate standard npm package names
    pkg_pattern = r"^(@[a-zA-Z0-9-._]+/[a-zA-Z0-9-._]+|[a-zA-Z0-9-._]+)$"
    if re.match(pkg_pattern, url):
        return url, None
        
    return None, None

def download_npm(payload):
    url = payload.get("url")
    if not url:
        return {
            "success": False,
            "error": "Missing required parameter: 'url'"
        }
        
    pkg_name, target_version = parse_npm_url(url)
    if not pkg_name:
        return {
            "success": False,
            "error": "Invalid NPM package name or URL format."
        }
        
    registry_url = f"https://registry.npmjs.org/{pkg_name}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    try:
        resp = requests.get(registry_url, headers=headers, timeout=10)
        if resp.status_code == 404:
            return {
                "success": False,
                "error": f"Package '{pkg_name}' not found on the npm registry."
            }
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to fetch data from NPM registry: {str(e)}"
        }
        
    # Fetch weekly downloads
    weekly_downloads = "Unknown"
    try:
        stats_url = f"https://api.npmjs.org/downloads/point/last-week/{pkg_name}"
        stats_resp = requests.get(stats_url, headers=headers, timeout=5)
        if stats_resp.status_code == 200:
            stats_data = stats_resp.json()
            downloads = stats_data.get("downloads", 0)
            weekly_downloads = f"{downloads:,}"
    except Exception:
        pass
        
    # Get metadata
    name = data.get("name", pkg_name)
    description = data.get("description", "No description available.")
    latest_version = data.get("dist-tags", {}).get("latest", "unknown")
    
    # Author & License
    author_info = data.get("author", {})
    author = author_info.get("name") if isinstance(author_info, dict) else str(author_info)
    if not author:
        author = "Unknown Author"
        
    license = data.get("license", "Unknown License")
    homepage = data.get("homepage", "")
    
    # Repository
    repository_info = data.get("repository", {})
    repository = repository_info.get("url") if isinstance(repository_info, dict) else str(repository_info)
    if repository and repository.startswith("git+"):
        repository = repository[4:]
    if repository and repository.endswith(".git"):
        repository = repository[:-4]
        
    # Build package description text
    desc_text = (
        f"NPM Package: {name}\n"
        f"Description: {description}\n"
        f"Author: {author} | License: {license}\n"
        f"Latest version: {latest_version}\n"
        f"Weekly Downloads: {weekly_downloads}"
    )
    
    # Process links/tarballs
    versions = data.get("versions", {})
    links = []
    
    # Sort versions if possible (by semver or pub date, but registry is dict)
    # Let's list the target version first, latest version second, and up to 10 newest versions
    sorted_versions = list(versions.keys())
    # reverse list to show newest first
    sorted_versions.reverse()
    
    # We want to display the target version or the latest version as primary link,
    # followed by other versions.
    primary_version = target_version if target_version and target_version in versions else latest_version
    
    if primary_version in versions:
        v_data = versions[primary_version]
        tarball_url = v_data.get("dist", {}).get("tarball")
        if tarball_url:
            links.append({
                "label": f"DOWNLOAD tarball v{primary_version} (Selected Version)",
                "url": tarball_url
            })
            
    # Add other recent versions (limit to top 15 versions to avoid huge payload)
    added_count = 0
    for v in sorted_versions:
        if v == primary_version:
            continue
        v_data = versions[v]
        tarball_url = v_data.get("dist", {}).get("tarball")
        if tarball_url:
            links.append({
                "label": f"DOWNLOAD tarball v{v}",
                "url": tarball_url
            })
            added_count += 1
            if added_count >= 15:
                break
                
    return {
        "success": True,
        "data": {
            "title": f"{name} (npm package)",
            "creator": "NPM Registry",
            "description": desc_text,
            "cover": "https://upload.wikimedia.org/wikipedia/commons/d/db/Npm-logo.svg",
            "links": links
        }
    }
