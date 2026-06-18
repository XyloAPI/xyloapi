import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { File as MegaFile } from 'megajs';
import { exec, execSync } from 'child_process';
import { promisify } from 'util';
import { Pool } from 'pg';
import http from 'http';
import https from 'https';
import { URL } from 'url';

const execAsync = promisify(exec);

function killPortOwner(port: number) {
  if (process.platform === 'win32') {
    let output = '';
    try {
      output = execSync(`netstat -ano | findstr :${port}`, { stdio: ['pipe', 'pipe', 'pipe'] }).toString();
    } catch (e: any) {
      console.log(`[XyloAPI Server] No active process on port ${port} (netstat returned exit code 1 or failed: ${e.message})`);
      return;
    }

    const lines = output.trim().split('\n');
    const killedPids = new Set<string>();
    for (const line of lines) {
      if (!line.trim()) continue;
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 5) {
        const localAddr = parts[1];
        const pid = parts[4];
        if (localAddr.endsWith(':' + port) && pid && pid !== '0' && parseInt(pid) !== process.pid) {
          if (!killedPids.has(pid)) {
            console.log(`[XyloAPI Server] Port ${port} is occupied by process PID ${pid}. Terminating it...`);
            try {
              execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
              killedPids.add(pid);
              console.log(`[XyloAPI Server] Successfully killed PID ${pid}.`);
            } catch (err: any) {
              console.log(`[XyloAPI Server] Failed to kill PID ${pid}: ${err.message}`);
            }
            // Sleep 500ms
            const start = Date.now();
            while (Date.now() - start < 500) {}
          }
        }
      }
    }
  } else {
    let pid = '';
    try {
      pid = execSync(`lsof -t -i:${port}`, { stdio: ['pipe', 'pipe', 'pipe'] }).toString().trim();
    } catch (e: any) {
      return;
    }
    if (pid && parseInt(pid) !== process.pid) {
      console.log(`[XyloAPI Server] Port ${port} is occupied by process PID ${pid}. Terminating it...`);
      try {
        execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
        console.log(`[XyloAPI Server] Successfully killed PID ${pid}.`);
      } catch (err: any) {
        console.log(`[XyloAPI Server] Failed to kill PID ${pid}: ${err.message}`);
      }
      // Sleep 500ms
      const start = Date.now();
      while (Date.now() - start < 500) {}
    }
  }
}



dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'x-api-key']
}));

// Intercept preflight OPTIONS requests immediately to prevent them from hitting pipeline routes
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key, x-api-key');
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Prefix-recovery middleware to handle Vercel path stripping when using routePrefix: "/api"
app.use((req, res, next) => {
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  next();
});

// Initialize Neon PostgreSQL Connection Pool if DATABASE_URL is available
let pool: Pool | null = null;
if (process.env.DATABASE_URL) {
  console.log('[XyloAPI DB] Database URL detected. Initializing pool...');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Required for serverless postgres connections
    }
  });
} else {
  console.log('[XyloAPI DB] No DATABASE_URL found. Running in in-memory mode.');
}

// Database schema initialization
async function initDatabase() {
  if (!pool) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS request_logs (
        id SERIAL PRIMARY KEY,
        path VARCHAR(255) NOT NULL,
        status_code INTEGER NOT NULL,
        latency_ms INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('[XyloAPI DB] request_logs table check completed successfully.');
  } catch (err) {
    console.error('[XyloAPI DB] Failed to initialize database:', err);
  }
}
initDatabase();

// Dynamic statistics tracker variables
let liveRequestsCount = 0;
let liveSuccessRequestsCount = 0;
let liveTotalLatencyMs = 0;

const startTimestamp = Date.now();

// Middleware to calculate request latency and counts dynamically
app.use((req, res, next) => {
  // Exclude status route to avoid polling noise
  if (req.path === '/api/status') {
    return next();
  }

  liveRequestsCount++;
  const startTime = process.hrtime();

  res.on('finish', async () => {
    const elapsed = process.hrtime(startTime);
    const durationMs = Math.round((elapsed[0] * 1e9 + elapsed[1]) / 1e6);
    liveTotalLatencyMs += durationMs;

    if (res.statusCode < 400) {
      liveSuccessRequestsCount++;
    }

    // Save logs to Neon database if pool is active
    if (pool) {
      try {
        await pool.query(
          'INSERT INTO request_logs (path, status_code, latency_ms) VALUES ($1, $2, $3)',
          [req.path, res.statusCode, durationMs]
        );
      } catch (dbErr) {
        console.error('[XyloAPI DB] Failed to persist request log:', dbErr);
      }
    }
  });

  next();
});

// List of modular service packages
const apiModules = [
  {
    id: "uploaders",
    name: "Media Uploaders Pack",
    description: "Upload image assets and files directly to CDNs like Imgur, Catbox, and Top4Top.",
    status: "active",
    endpointsCount: 10,
  },
  {
    id: "downloaders",
    name: "Media Downloaders Pack",
    description: "Download video and audio streams directly from platforms like TikTok, Instagram, YouTube, Spotify, SoundCloud, Twitter/X, Threads, Facebook, Bilibili, SnackVideo, CapCut, CocoFun, Douyin, YouTube Community, GitHub, Google Drive, MediaFire, MEGA, NPM, Pinterest, RedNote (Xiaohongshu), Scribd, SFile.co, TeraBox, Dailymotion, Pornhub, PornHD, and XNXX.",
    status: "active",
    endpointsCount: 28,
  },
  {
    id: "news",
    name: "News Scrapers Pack",
    description: "Fetch latest news from 37 sources: ST, CNA, BBC, CNN, Mothership, Al Jazeera, ABC, WaPo, AP News, Fox News, Reuters, CBS, NYT, MS NOW, WSJ, The Guardian, TIME, Sky News, NPR, Bloomberg, The Times, DW, NHL, News24, Newsweek, Yahoo News, U.S. News, NBC News, NASA, Detroit Free Press, MassLive, WMTV 15 News, Forbes, Euronews, USA Today, The Independent, and The Punch.",
    status: "active",
    endpointsCount: 37,
  },
  {
    id: "local-news",
    name: "Local News Scrapers Pack",
    description: "Fetch latest local news from Indonesian sources: Detik News, Kompas News, CNN Indonesia, Liputan6 News, Sindonews, Antara News, BMKG News, Tempo, Bisnis.com, Okezone, CNBC Indonesia, TIMES Indonesia, Inilah.com, Bank Indonesia, Hukumonline, Media Indonesia, Berita Jakarta, Tangerang Kota, Kompas TV, VIVA News, iNews, Terkini News, CNA Indonesia, Merdeka News, and The Jakarta Post.",
    status: "active",
    endpointsCount: 25,
  },
  {
    id: "image-tools",
    name: "Image Tools Pack",
    description: "Process and edit images using tools like background removal, AI upscaling, vintage filters, color inversion, image flipping, retro pixelation, rounded corners, image splitting, adding noise, and image blurring.",
    status: "active",
    endpointsCount: 10,
  }
];

// 1. Status Route (Returns dynamic metrics)
app.get('/api/status', async (req, res) => {
  const uptime = Math.floor((Date.now() - startTimestamp) / 1000);
  
  // Calculate raw metrics based strictly on live request handling in-memory
  let requestsToday = liveRequestsCount;
  let avgLatency = liveRequestsCount > 0 
    ? Math.round(liveTotalLatencyMs / liveRequestsCount) 
    : 0;
  let successRate = liveRequestsCount > 0 
    ? parseFloat(((liveSuccessRequestsCount / liveRequestsCount) * 100).toFixed(2)) 
    : 100.00;

  // Retrieve actual live stats from Neon Postgres if connection is established
  if (pool) {
    try {
      // 1. Count logs recorded today (based on local timezone day start)
      const countRes = await pool.query(
        "SELECT COUNT(*)::integer as count FROM request_logs WHERE created_at >= CURRENT_DATE"
      );
      requestsToday = countRes.rows[0]?.count || 0;

      // 2. Calculate average latency
      const latencyRes = await pool.query(
        "SELECT AVG(latency_ms)::float as avg_lat FROM request_logs"
      );
      const dbAvgLat = latencyRes.rows[0]?.avg_lat;
      avgLatency = dbAvgLat !== null && dbAvgLat !== undefined ? Math.round(dbAvgLat) : 0;

      // 3. Calculate success rate percentage
      const successRes = await pool.query(
        "SELECT COUNT(*)::integer as total, SUM(CASE WHEN status_code < 400 THEN 1 ELSE 0 END)::integer as success FROM request_logs"
      );
      const total = successRes.rows[0]?.total || 0;
      const success = successRes.rows[0]?.success || 0;
      successRate = total > 0 ? parseFloat(((success / total) * 100).toFixed(2)) : 100.00;
    } catch (dbErr) {
      console.error('[XyloAPI DB] Error querying stats from database:', dbErr);
    }
  }

  res.json({
    status: "online",
    uptime,
    stats: {
      requestsToday,
      uptimeSeconds: uptime,
      averageLatencyMs: avgLatency,
      successRatePercent: successRate,
      activePipelinesCount: apiModules.length,
    },
    version: "1.0.0"
  });
});

// 1.5. Monitor Route (Live dashboard analytics)
app.get('/api/monitor', async (req, res) => {
  const uptime = Math.floor((Date.now() - startTimestamp) / 1000);
  
  let requestsToday = liveRequestsCount;
  let totalRequests = liveRequestsCount;
  const totalEndpoints = apiModules.reduce((acc, m) => acc + m.endpointsCount, 0);
  let avgLatency = liveRequestsCount > 0 ? Math.round(liveTotalLatencyMs / liveRequestsCount) : 0;
  let successRate = liveRequestsCount > 0 ? parseFloat(((liveSuccessRequestsCount / liveRequestsCount) * 100).toFixed(2)) : 100.00;
  let lastRequests: any[] = [];
  let topEndpoints: any[] = [];
  let hourlyChartData: any[] = [];

  if (pool) {
    try {
      // 1. Basic Stats
      const countRes = await pool.query(
        "SELECT COUNT(*)::integer as count FROM request_logs WHERE created_at >= CURRENT_DATE"
      );
      requestsToday = countRes.rows[0]?.count || 0;

      const totalCountRes = await pool.query(
        "SELECT COUNT(*)::integer as count FROM request_logs"
      );
      totalRequests = totalCountRes.rows[0]?.count || 0;

      const latencyRes = await pool.query(
        "SELECT AVG(latency_ms)::float as avg_lat FROM request_logs"
      );
      const dbAvgLat = latencyRes.rows[0]?.avg_lat;
      avgLatency = dbAvgLat !== null && dbAvgLat !== undefined ? Math.round(dbAvgLat) : 0;

      const successRes = await pool.query(
        "SELECT COUNT(*)::integer as total, SUM(CASE WHEN status_code < 400 THEN 1 ELSE 0 END)::integer as success FROM request_logs"
      );
      const total = successRes.rows[0]?.total || 0;
      const success = successRes.rows[0]?.success || 0;
      successRate = total > 0 ? parseFloat(((success / total) * 100).toFixed(2)) : 100.00;

      // 2. Last 10 Requests
      const lastReqRes = await pool.query(
        "SELECT id, path, status_code, latency_ms, created_at FROM request_logs ORDER BY created_at DESC LIMIT 10"
      );
      lastRequests = lastReqRes.rows;

      // 3. Top Endpoints
      const topEndRes = await pool.query(
        "SELECT path, COUNT(*)::integer as count, ROUND(AVG(latency_ms))::integer as avg_latency FROM request_logs GROUP BY path ORDER BY count DESC LIMIT 5"
      );
      topEndpoints = topEndRes.rows;

      // 4. Hourly Chart Data (Last 24 Hours)
      const hourlyRes = await pool.query(
        "SELECT DATE_TRUNC('hour', created_at) as hour, COUNT(*)::integer as count, ROUND(AVG(latency_ms))::integer as avg_latency FROM request_logs WHERE created_at >= NOW() - INTERVAL '24 hours' GROUP BY hour ORDER BY hour ASC"
      );
      hourlyChartData = hourlyRes.rows.map(row => ({
        time: row.hour,
        count: row.count,
        latency: row.avg_latency
      }));
    } catch (dbErr) {
      console.error('[XyloAPI DB] Error querying monitor stats:', dbErr);
    }
  }

  res.json({
    status: "online",
    uptime,
    stats: {
      requestsToday,
      totalRequests,
      totalEndpoints,
      averageLatencyMs: avgLatency,
      successRatePercent: successRate,
      errorRatePercent: parseFloat((100 - successRate).toFixed(2))
    },
    lastRequests,
    topEndpoints,
    hourlyChartData
  });
});

// Helper to execute Python scrapers via HTTP service first, falling back to local shell execution
async function executePipeline(slug: string, payload: any, reqHost: string, protocol: string): Promise<any> {
  // 1. Try Python Scraper Service over HTTP
  // 1. Try Python Scraper Service over HTTP (skip in local development to avoid 404 warnings)
  if (!reqHost.includes('localhost') && !reqHost.includes('127.0.0.1')) {
    try {
      const scrapersUrl = `${protocol}://${reqHost}/_/scrapers`;
      console.log(`[XyloAPI Node] Attempting HTTP pipeline call to: ${scrapersUrl} for slug: ${slug}`);
      
      const response = await (global as any).fetch(scrapersUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ slug, payload })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`[XyloAPI Node] HTTP pipeline call succeeded for slug: ${slug}`);
        return result;
      } else {
        console.warn(`[XyloAPI Node] HTTP pipeline call returned status ${response.status}. Falling back to local process execution.`);
      }
    } catch (httpError: any) {
      console.warn(`[XyloAPI Node] HTTP pipeline call failed: ${httpError.message}. Falling back to local process execution.`);
    }
  }

  // 2. Fallback to Local Python CLI Execution (for local developer environments)
  let pythonPath = process.env.PYTHON_PATH || 'python';
  
  const winVenvPath = path.join(__dirname, '..', 'scrapers', '.venv', 'Scripts', 'python.exe');
  const nixVenvPath = path.join(__dirname, '..', 'scrapers', '.venv', 'bin', 'python');
  if (fs.existsSync(winVenvPath)) {
    pythonPath = winVenvPath;
  } else if (fs.existsSync(nixVenvPath)) {
    pythonPath = nixVenvPath;
  }

  const scriptPath = path.join(__dirname, '..', 'scrapers', 'scraper_runner.py');
  
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
      { maxBuffer: 1024 * 1024 * 50, env: { ...process.env } },
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

// 2. Modules / Endpoints Route
app.get('/api/modules', (req, res) => {
  res.json({
    success: true,
    modules: apiModules
  });
});

// 3. Modular Uploader Route (e.g. /api/uploader/imgur)
app.all('/api/uploader/:slug', async (req, res) => {
  const { slug } = req.params;
  const payload = {
    ...req.query,
    ...req.body
  };

  try {
    const reqHost = req.headers.host || 'localhost:5000';
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const result = await executePipeline(slug, payload, reqHost, protocol);

    // If the scraper runner returned success: false, bubble it
    if (result && result.success === false) {
      return res.status(400).json({
        success: false,
        creator: "XyloAPI",
        ...result
      });
    }

    return res.json({
      success: true,
      creator: "XyloAPI",
      data: result.data || result
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Failed to execute uploader pipeline",
      details: error.message || String(error)
    });
  }
});

// 4. Modular Downloader Route (e.g. /api/downloader/tiktok)
app.all('/api/downloader/:slug', async (req, res) => {
  const { slug } = req.params;
  const payload = {
    ...req.query,
    ...req.body
  };

  try {
    const fs = require('fs');
    fs.appendFileSync(
      path.join(__dirname, '..', 'incoming_requests.log'),
      JSON.stringify({ timestamp: new Date().toISOString(), slug, payload }) + '\n',
      'utf-8'
    );
  } catch (logErr) {}

  try {
    const reqHost = req.headers.host || 'localhost:5000';
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';

    // Special interception for MEGA to stream on-the-fly and avoid slow disk downloads
    if (slug === 'mega') {
      const url = payload.url;
      if (!url) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Missing required parameter: 'url'"
        });
      }

      try {
        const file = MegaFile.fromURL(url);
        let filename = 'mega_download.bin';
        let size = 0;

        try {
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error("Timeout")), 2000);
            file.loadAttributes((err: any) => {
              clearTimeout(timeout);
              if (!err) {
                filename = file.name || 'mega_download.bin';
                size = file.size || 0;
              }
              resolve();
            });
          });
        } catch (e) {
          // Fallback filename extraction from URL paths
          try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            const lastPart = pathParts[pathParts.length - 1];
            if (lastPart && lastPart.includes('.')) {
              filename = lastPart;
            }
          } catch (urlErr) {}
        }

        const urlBase64 = Buffer.from(url).toString('base64url');
        const fileUrl = `${protocol}://${reqHost}/api/downloads/mega/${urlBase64}/${encodeURIComponent(filename)}`;

        return res.json({
          success: true,
          creator: "XyloAPI",
          data: {
            title: filename,
            creator: "MEGA",
            description: `Resolved MEGA file: ${filename} (${size ? (size / (1024 * 1024)).toFixed(2) + ' MB' : 'Size unknown'})`,
            cover: "https://mega.nz/favicon.ico",
            links: [
              {
                label: "DOWNLOAD FILE (Direct Stream)",
                url: fileUrl
              }
            ]
          }
        });
      } catch (err: any) {
        return res.status(500).json({
          success: false,
          creator: "XyloAPI",
          error: "Failed to resolve MEGA URL",
          details: err.message || String(err)
        });
      }
    }

    const result = await executePipeline(slug, payload, reqHost, protocol);

    // If the scraper runner returned success: false, bubble it
    if (result && result.success === false) {
      return res.status(400).json({
        success: false,
        creator: "XyloAPI",
        ...result
      });
    }

    return res.json({
      success: true,
      creator: "XyloAPI",
      data: result.data || result
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Failed to execute downloader pipeline",
      details: error.message || String(error)
    });
  }
});

// 4b. News Scrapers Route (e.g. /api/news/straitstimes)
app.all('/api/news/:slug', async (req, res) => {
  const { slug } = req.params;
  const payload = {
    ...req.query,
    ...req.body
  };

  try {
    const reqHost = req.headers.host || 'localhost:5000';
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';

    const result = await executePipeline(slug, payload, reqHost, protocol);

    if (result && result.success === false) {
      return res.status(400).json({
        success: false,
        creator: "XyloAPI",
        ...result
      });
    }

    return res.json({
      success: true,
      creator: "XyloAPI",
      data: result.data || result
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Failed to execute news pipeline",
      details: error.message || String(error)
    });
  }
});

// 4e. Image Tools Route (e.g. /api/image-tool/removebg)
app.all('/api/image-tool/:slug', async (req, res) => {
  const { slug } = req.params;
  const payload = {
    ...req.query,
    ...req.body
  };

  try {
    const reqHost = req.headers.host || 'localhost:5000';
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';

    const result = await executePipeline(slug, payload, reqHost, protocol);

    if (result && result.success === false) {
      return res.status(400).json({
        success: false,
        creator: "XyloAPI",
        ...result
      });
    }

    return res.json({
      success: true,
      creator: "XyloAPI",
      data: result.data || result
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Failed to execute image tool pipeline",
      details: error.message || String(error)
    });
  }
});

// Helper to fetch image with redirect following and custom User-Agent
async function fetchImageWithRedirects(imageUrl: string, redirectCount = 0): Promise<{ headers: any; stream: any }> {
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

// 4c. Image Proxy Route to bypass CORP and certificate issues
app.get('/api/image-proxy', async (req, res) => {
  const imageUrl = req.query.url as string;
  if (!imageUrl) {
    return res.status(400).send('Missing url parameter');
  }

  try {
    const { headers, stream } = await fetchImageWithRedirects(imageUrl);
    const contentType = headers['content-type'];
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    stream.pipe(res);
  } catch (error: any) {
    res.status(500).send('Proxy error: ' + error.message);
  }
});

// 5. Temporary File Streaming & Clean-up Route (for MEGA, etc.)
app.get('/api/downloads/:fileId/:filename', async (req, res) => {
  const { fileId, filename } = req.params;
  const filePath = path.join(__dirname, '..', 'downloads', fileId, filename);
  const dirPath = path.join(__dirname, '..', 'downloads', fileId);

  if (fs.existsSync(filePath)) {
    res.download(filePath, filename, (err) => {
      // Clean up the folder after download completes or fails
      try {
        if (fs.existsSync(dirPath)) {
          fs.rmSync(dirPath, { recursive: true, force: true });
        }
      } catch (rmErr) {
        console.error(`[XyloAPI Node] Failed to clean up download dir ${dirPath}:`, rmErr);
      }
    });
  } else {
    res.status(404).json({
      success: false,
      error: "File not found or has already been downloaded."
    });
  }
});

// 6. Direct On-The-Fly Decryption Streaming for MEGA files
app.get('/api/downloads/mega/:urlBase64/:filename', async (req, res) => {
  const { urlBase64, filename } = req.params;
  try {
    const url = Buffer.from(urlBase64, 'base64url').toString('utf8');
    const file = MegaFile.fromURL(url);

    // Try to load attributes to set Content-Length if possible
    let size = 0;
    try {
      await new Promise<void>((resolve) => {
        file.loadAttributes((err: any) => {
          if (!err && file.size) {
            size = file.size;
          }
          resolve();
        });
      });
    } catch (e) {}

    // Set streaming headers
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    if (size > 0) {
      res.setHeader('Content-Length', size.toString());
    }

    const stream = file.download({});
    stream.on('error', (err: any) => {
      console.error('[XyloAPI Node] MEGA Stream Error:', err);
      if (!res.headersSent) {
        res.status(500).send("Error streaming MEGA file");
      }
    });

    stream.pipe(res);
  } catch (error: any) {
    console.error('[XyloAPI Node] MEGA Downloader Error:', error);
    if (!res.headersSent) {
      res.status(500).send("Failed to start MEGA stream");
    }
  }
});

// Start Server - watch test restart 2
killPortOwner(Number(PORT));
app.listen(PORT, () => {
  console.log(`[XyloAPI Server] Running at http://localhost:${PORT}`);
});
