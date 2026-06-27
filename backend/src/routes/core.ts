import { Router } from 'express';
import { pool } from '../utils/db';
import { liveRequestsCount, liveSuccessRequestsCount, liveTotalLatencyMs } from '../middleware/logger';
import { fetchImageWithRedirects } from '../utils/pipeline';
import { getApiModules } from '../utils/modules';

const router = Router();
const startTimestamp = Date.now();

router.get('/status', async (req, res) => {
  const uptime = Math.floor((Date.now() - startTimestamp) / 1000);
  
  let requestsToday = liveRequestsCount;
  let avgLatency = liveRequestsCount > 0 
    ? Math.round(liveTotalLatencyMs / liveRequestsCount) 
    : 0;
  let successRate = liveRequestsCount > 0 
    ? parseFloat(((liveSuccessRequestsCount / liveRequestsCount) * 100).toFixed(2)) 
    : 100.00;

  if (pool) {
    try {
      const countRes = await pool.query(
        "SELECT COUNT(*)::integer as count FROM request_logs WHERE created_at >= CURRENT_DATE"
      );
      requestsToday = countRes.rows[0]?.count || 0;

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
    } catch (dbErr) {
      // silent
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
      activePipelinesCount: getApiModules().length,
    },
    version: "1.0.0"
  });
});

router.get('/monitor', async (req, res) => {
  const uptime = Math.floor((Date.now() - startTimestamp) / 1000);
  
  let requestsToday = liveRequestsCount;
  let totalRequests = liveRequestsCount;
  const totalEndpoints = getApiModules().reduce((acc, m) => acc + m.endpointsCount, 0);
  let avgLatency = liveRequestsCount > 0 ? Math.round(liveTotalLatencyMs / liveRequestsCount) : 0;
  let successRate = liveRequestsCount > 0 ? parseFloat(((liveSuccessRequestsCount / liveRequestsCount) * 100).toFixed(2)) : 100.00;
  let lastRequests: any[] = [];
  let topEndpoints: any[] = [];
  let hourlyChartData: any[] = [];

  if (pool) {
    try {
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

      const lastReqRes = await pool.query(
        "SELECT id, path, status_code, latency_ms, created_at FROM request_logs ORDER BY created_at DESC LIMIT 10"
      );
      lastRequests = lastReqRes.rows;

      const topEndRes = await pool.query(
        "SELECT path, COUNT(*)::integer as count, ROUND(AVG(latency_ms))::integer as avg_latency FROM request_logs GROUP BY path ORDER BY count DESC LIMIT 5"
      );
      topEndpoints = topEndRes.rows;

      const hourlyRes = await pool.query(
        "SELECT DATE_TRUNC('hour', created_at) as hour, COUNT(*)::integer as count, ROUND(AVG(latency_ms))::integer as avg_latency FROM request_logs WHERE created_at >= NOW() - INTERVAL '24 hours' GROUP BY hour ORDER BY hour ASC"
      );
      hourlyChartData = hourlyRes.rows.map(row => ({
        time: row.hour,
        count: row.count,
        latency: row.avg_latency
      }));
    } catch (dbErr) {
      // silent
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

router.get('/modules', (req, res) => {
  res.json({
    success: true,
    modules: getApiModules()
  });
});

router.get('/image-proxy', async (req, res) => {
  const imageUrl = req.query.url as string;
  if (!imageUrl) {
    return res.status(400).json({
      success: false,
      creator: "XyloAPI",
      error: "Failed to process request"
    });
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
    return res.status(500).json({
      success: false,
      creator: "XyloAPI",
      error: "Failed to process request"
    });
  }
});

router.post('/monitor/speedtest', async (req, res) => {
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  try {
    const startPing = Date.now();
    try {
      const pingRes = await fetch('https://speed.cloudflare.com/__down?bytes=0', { 
        method: 'GET',
        headers: { 'User-Agent': userAgent }
      });
      await pingRes.text();
    } catch (e) {}
    const ping = Date.now() - startPing;

    // Download Test (Parallel workers, avoids sequential latency bottleneck)
    const downloadTimeout = 6000;
    const startDownload = Date.now();
    let downloadedBytes = 0;
    const downloadConcurrency = 3;
    const downloadWorkers = Array.from({ length: downloadConcurrency }, async () => {
      while (Date.now() - startDownload < downloadTimeout) {
        try {
          const downRes = await fetch('https://speed.cloudflare.com/__down?bytes=3000000', {
            headers: { 'User-Agent': userAgent }
          });
          if (!downRes.ok) {
            await new Promise(resolve => setTimeout(resolve, 200));
            continue;
          }
          const buf = await downRes.arrayBuffer();
          downloadedBytes += buf.byteLength;
        } catch (e) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
    });
    await Promise.all(downloadWorkers);
    const durationDownloadSec = (Date.now() - startDownload) / 1000;
    const downloadSpeedMbps = durationDownloadSec > 0 
      ? parseFloat(((downloadedBytes * 8) / (durationDownloadSec * 1000000)).toFixed(2)) 
      : 0;

    // Upload Test (Parallel workers, avoids sequential latency bottleneck)
    const uploadTimeout = 6000;
    const startUpload = Date.now();
    let uploadedBytes = 0;
    const uploadPayload = new Uint8Array(2 * 1024 * 1024); // 2MB chunk
    const uploadConcurrency = 3;
    const uploadWorkers = Array.from({ length: uploadConcurrency }, async () => {
      while (Date.now() - startUpload < uploadTimeout) {
        try {
          const upRes = await fetch('https://speed.cloudflare.com/__up', {
            method: 'POST',
            body: uploadPayload,
            headers: { 
              'Content-Type': 'application/octet-stream',
              'User-Agent': userAgent
            }
          });
          if (upRes.ok) {
            uploadedBytes += uploadPayload.length;
          } else {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
          await upRes.text();
        } catch (e) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
    });
    await Promise.all(uploadWorkers);
    const durationUploadSec = (Date.now() - startUpload) / 1000;
    const uploadSpeedMbps = durationUploadSec > 0 
      ? parseFloat(((uploadedBytes * 8) / (durationUploadSec * 1000000)).toFixed(2)) 
      : 0;

    res.json({
      success: true,
      pingMs: ping,
      downloadSpeedMbps,
      uploadSpeedMbps,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Speed test failed'
    });
  }
});

router.get('/monitor/speedtest', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  if (typeof (res as any).flushHeaders === 'function') {
    (res as any).flushHeaders();
  }

  // Send initial 2KB of space padding to bypass proxy buffering
  res.write(`:${' '.repeat(2048)}\n\n`);

  let isClientConnected = true;
  req.on('close', () => {
    isClientConnected = false;
  });

  const sendSSE = (data: any) => {
    if (isClientConnected) {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  };

  try {
    // 0. Ping Phase
    const startPing = Date.now();
    try {
      const pingRes = await fetch('https://speed.cloudflare.com/__down?bytes=0', { method: 'GET' });
      await pingRes.text();
    } catch (e) {}
    const ping = Date.now() - startPing;
    
    sendSSE({ phase: 'ping', pingMs: ping });
    if (!isClientConnected) return res.end();

    // 1. Download Test (Sequential, CPU friendly)
    const downloadTimeout = 6000;
    const startDownload = Date.now();
    let downloadedBytes = 0;
    while (isClientConnected && (Date.now() - startDownload < downloadTimeout)) {
      try {
        const startChunk = Date.now();
        const downRes = await fetch('https://speed.cloudflare.com/__down?bytes=3000000'); // 3MB chunks
        if (!downRes.ok) {
          await new Promise(resolve => setTimeout(resolve, 200));
          continue;
        }
        const buf = await downRes.arrayBuffer();
        const chunkDuration = (Date.now() - startChunk) / 1000;
        downloadedBytes += buf.byteLength;
        
        if (chunkDuration > 0) {
          const currentSpeedMbps = parseFloat(((buf.byteLength * 8) / (chunkDuration * 1000000)).toFixed(2));
          sendSSE({ phase: 'download', speedMbps: currentSpeedMbps });
        }
      } catch (e) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    const durationDownloadSec = (Date.now() - startDownload) / 1000;
    const downloadSpeedMbps = durationDownloadSec > 0 
      ? parseFloat(((downloadedBytes * 8) / (durationDownloadSec * 1000000)).toFixed(2)) 
      : 0;

    sendSSE({ phase: 'download_complete', downloadSpeedMbps });
    if (!isClientConnected) return res.end();

    // 2. Upload Test (Sequential, CPU friendly)
    const uploadTimeout = 6000;
    const startUpload = Date.now();
    let uploadedBytes = 0;
    const uploadPayload = new Uint8Array(1024 * 1024); // 1MB chunk

    sendSSE({ phase: 'upload_start' });

    while (isClientConnected && (Date.now() - startUpload < uploadTimeout)) {
      try {
        const startChunk = Date.now();
        const upRes = await fetch('https://speed.cloudflare.com/__up', {
          method: 'POST',
          body: uploadPayload,
          headers: { 'Content-Type': 'application/octet-stream' }
        });
        await upRes.text();
        const chunkDuration = (Date.now() - startChunk) / 1000;
        uploadedBytes += uploadPayload.length;

        if (chunkDuration > 0) {
          const currentSpeedMbps = parseFloat(((uploadPayload.length * 8) / (chunkDuration * 1000000)).toFixed(2));
          sendSSE({ phase: 'upload', speedMbps: currentSpeedMbps });
        }
      } catch (e) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    const durationUploadSec = (Date.now() - startUpload) / 1000;
    const uploadSpeedMbps = durationUploadSec > 0 
      ? parseFloat(((uploadedBytes * 8) / (durationUploadSec * 1000000)).toFixed(2)) 
      : 0;

    sendSSE({
      phase: 'complete',
      pingMs: ping,
      downloadSpeedMbps,
      uploadSpeedMbps,
      timestamp: new Date().toISOString()
    });
    res.end();
  } catch (error: any) {
    sendSSE({ error: error.message || 'Failed to complete speed test' });
    res.end();
  }
});

export default router;
