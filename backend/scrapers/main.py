import json
import os
import sys

# Set up module paths
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

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
                            os.environ[key.strip()] = val
                break
            except Exception:
                pass

load_dotenv()

from scraper_runner import run_pipeline

def handler(environ, start_response):
    # Get request method
    method = environ.get('REQUEST_METHOD', 'GET')
    
    if method == 'POST':
        try:
            # Read request body
            request_body_size = int(environ.get('CONTENT_LENGTH', 0))
            request_body = environ['wsgi.input'].read(request_body_size)
            req_data = json.loads(request_body.decode('utf-8'))
            
            slug = req_data.get('slug')
            payload = req_data.get('payload', {})
            
            if not slug:
                status = '400 Bad Request'
                response_headers = [('Content-Type', 'application/json')]
                start_response(status, response_headers)
                return [json.dumps({"success": False, "error": "Missing slug parameter"}).encode('utf-8')]
                
            # Run the scraper runner pipeline
            result = run_pipeline(slug, payload)
            
            status = '200 OK'
            response_headers = [('Content-Type', 'application/json')]
            start_response(status, response_headers)
            return [json.dumps(result).encode('utf-8')]
            
        except Exception as e:
            status = '500 Internal Server Error'
            response_headers = [('Content-Type', 'application/json')]
            start_response(status, response_headers)
            return [json.dumps({"success": False, "error": str(e)}).encode('utf-8')]
            
    else:
        # GET Health check
        status = '200 OK'
        response_headers = [('Content-Type', 'application/json')]
        start_response(status, response_headers)
        return [json.dumps({"status": "ok", "service": "XyloAPI Scrapers Service"}).encode('utf-8')]

handler = handler
app = handler

if __name__ == '__main__':
    from wsgiref.simple_server import make_server
    port = int(os.environ.get('PORT', 8000))
    server = make_server('0.0.0.0', port, handler)
    print(f"[Scrapers Service] Starting Python WSGI Scraper Service on port {port}...")
    server.serve_forever()
