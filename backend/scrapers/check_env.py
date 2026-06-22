import os, sys
sys.path.append('e:/project/xyloapi/backend/scrapers')
import scraper_runner
print('NVIDIA_TOKEN present:', 'NVIDIA_TOKEN' in os.environ)
print('Value (first 10):', os.getenv('NVIDIA_TOKEN','<none>')[:10])
