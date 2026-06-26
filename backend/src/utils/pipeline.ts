import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import http from 'http';
import https from 'https';
import { URL } from 'url';

const execAsync = promisify(exec);

export async function executePipeline(slug: string, payload: any, reqHost: string, protocol: string): Promise<any> {
  if (!reqHost.includes('localhost') && !reqHost.includes('127.0.0.1')) {
    try {
      const scrapersUrl = `${protocol}://${reqHost}/_/scrapers`;
      
      const response = await (global as any).fetch(scrapersUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ slug, payload })
      });
      
      if (response.ok) {
        const result = await response.json();
        return result;
      }
    } catch (httpError: any) {
      // silent
    }
  }

  let pythonPath = process.env.PYTHON_PATH || 'python';
  
  const winVenvPath = path.join(__dirname, '..', '..', 'scrapers', '.venv', 'Scripts', 'python.exe');
  const nixVenvPath = path.join(__dirname, '..', '..', 'scrapers', '.venv', 'bin', 'python');
  if (fs.existsSync(winVenvPath)) {
    pythonPath = winVenvPath;
  } else if (fs.existsSync(nixVenvPath)) {
    pythonPath = nixVenvPath;
  }

  const scriptPath = path.join(__dirname, '..', '..', 'scrapers', 'scraper_runner.py');
  
  const enrichedPayload = {
    ...(payload || {}),
    _reqHost: reqHost,
    _protocol: protocol
  };
  const payloadStr = JSON.stringify(enrichedPayload);
  const payloadBase64 = Buffer.from(payloadStr).toString('base64');

  const { stdout, stderr } = await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    const child = exec(
      `"${pythonPath}" "${scriptPath}" "${slug}"`,
      { maxBuffer: 1024 * 1024 * 50, env: { ...process.env }, timeout: 300000 },
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve({ stdout, stderr });
        }
      }
    );
    if (child.stdin) {
      child.stdin.write(payloadBase64);
      child.stdin.end();
    }
  });

  if (stderr && !stdout) {
    throw new Error(stderr);
  }

  return JSON.parse(stdout.trim());
}

export async function fetchImageWithRedirects(imageUrl: string, redirectCount = 0): Promise<{ headers: any; stream: any }> {
  if (redirectCount > 5) {
    throw new Error('Too many redirects');
  }

  const urlObj = new URL(imageUrl);
  const client = urlObj.protocol === 'https:' ? https : http;

  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
    },
    rejectUnauthorized: false
  };

  return new Promise((resolve, reject) => {
    client.get(imageUrl, options, (res) => {
      const statusCode = res.statusCode || 200;
      if (statusCode >= 300 && statusCode < 400 && res.headers.location) {
        const redirectUrl = new URL(res.headers.location, imageUrl).toString();
        resolve(fetchImageWithRedirects(redirectUrl, redirectCount + 1));
      } else if (statusCode >= 400) {
        reject(new Error(`Server returned status code ${statusCode}`));
      } else {
        resolve({ headers: res.headers, stream: res });
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}
