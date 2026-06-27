import sys
import json
import base64
import os
import importlib
from registry import SCRAPER_REGISTRY

scrapers_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(scrapers_dir)
categories = [
    'ai_chat',
    'ai_image',
    'bmkg',
    'downloader',
    'image_tools',
    'informations',
    'local_news',
    'news',
    'qr_tools',
    'shortlink_tools',
    'uploader',
    'maker',
    'ai_image_edit',
    'tools'
]
for cat in categories:
    sys.path.append(os.path.join(scrapers_dir, cat))

def load_dotenv():
    possible_paths = [
        os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env'),
        os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env'),
        os.path.join(os.getcwd(), 'backend', '.env'),
        os.path.join(os.getcwd(), '.env'),
    ]
    for path in possible_paths:
        if os.path.exists(path):
            try:
                with open(path, 'r') as f:
                    for line in f:
                        line = line.strip()
                        if not line or line.startswith('#'):
                            continue
                        if '=' in line:
                            key, val = line.split('=', 1)
                            val = val.strip().strip('"').strip("'")
                            key = key.strip()
                            if key not in os.environ or not os.environ[key]:
                                os.environ[key] = val
            except Exception:
                pass

load_dotenv()

def run_pipeline(endpoint_id, payload):
    entry = SCRAPER_REGISTRY.get(endpoint_id)
    if not entry:
        return {
            "endpoint_id": endpoint_id,
            "success": False,
            "error": f"Endpoint '{endpoint_id}' not supported in active pipelines.",
            "payload_received": payload
        }

    module_name, func_name = entry
    try:
        mod = importlib.import_module(module_name)
    except ImportError:
        local_name = module_name.split('.')[-1]
        try:
            mod = importlib.import_module(local_name)
        except ImportError as e:
            return {
                "endpoint_id": endpoint_id,
                "success": False,
                "error": f"Failed to load scraper module '{module_name}': {str(e)}",
                "payload_received": payload
            }

    func = getattr(mod, func_name, None)
    if not func:
        return {
            "endpoint_id": endpoint_id,
            "success": False,
            "error": f"Scraper function '{func_name}' not found in module '{module_name}'.",
            "payload_received": payload
        }

    return func(payload)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "Missing endpoint_id argument"}))
        sys.exit(1)

    endpoint_id = sys.argv[1]

    try:
        payload_b64 = sys.stdin.read().strip()
        payload_str = base64.b64decode(payload_b64).decode('utf-8')
        payload = json.loads(payload_str)
    except Exception as e:
        print(json.dumps({"success": False, "error": f"Failed to parse payload: {str(e)}"}))
        sys.exit(1)

    try:
        result = run_pipeline(endpoint_id, payload)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"success": False, "error": f"Error during execution: {str(e)}"}))
        sys.exit(1)
