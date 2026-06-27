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
  try {
    const startPing = Date.now();
    try {
      const pingRes = await fetch('https://speed.cloudflare.com/__down?bytes=0', { method: 'GET' });
      await pingRes.text();
    } catch (e) {}
    const ping = Date.now() - startPing;

    // 1. Download Test (Max 10 seconds total to prevent socket exhaustion)
    const downloadTimeout = 10000;
    const startDownload = Date.now();
    let downloadedBytes = 0;
    
    // Concurrent workers downloading 10MB chunks
    const downloadConcurrency = 3;
    const downloadWorkers = Array.from({ length: downloadConcurrency }, async () => {
      while (Date.now() - startDownload < downloadTimeout) {
        try {
          const downRes = await fetch('https://speed.cloudflare.com/__down?bytes=10000000');
          if (!downRes.ok) {
            // Wait a bit if server is rate-limiting or errors out
            await new Promise(resolve => setTimeout(resolve, 500));
            continue;
          }
          if (downRes.body) {
            const reader = downRes.body.getReader();
            while (Date.now() - startDownload < downloadTimeout) {
              const { done, value } = await reader.read();
              if (done) break;
              if (value) {
                downloadedBytes += value.length || value.byteLength || 0;
              }
            }
            try { await reader.cancel(); } catch (_) {}
          }
        } catch (e) {
          // Prevent tight hot loop on network failures
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    });

    await Promise.all(downloadWorkers);
    const durationDownloadSec = (Date.now() - startDownload) / 1000;
    const downloadSpeedMbps = durationDownloadSec > 0 
      ? parseFloat(((downloadedBytes * 8) / (durationDownloadSec * 1000000)).toFixed(2)) 
      : 0;

    // 2. Upload Test (Max 10 seconds total)
    const uploadTimeout = 10000;
    const startUpload = Date.now();
    let uploadedBytes = 0;
    
    // Use a pre-allocated static buffer of 2MB to upload cleanly without unstable custom ReadableStreams
    const uploadChunkSize = 2 * 1024 * 1024;
    const uploadPayload = new Uint8Array(uploadChunkSize);

    const uploadConcurrency = 3;
    const uploadWorkers = Array.from({ length: uploadConcurrency }, async () => {
      while (Date.now() - startUpload < uploadTimeout) {
        try {
          const upRes = await fetch('https://speed.cloudflare.com/__up', {
            method: 'POST',
            body: uploadPayload,
            headers: {
              'Content-Type': 'application/octet-stream'
            }
          });
          if (upRes.ok) {
            uploadedBytes += uploadChunkSize;
          } else {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          await upRes.text(); // Consume stream
        } catch (e) {
          // Prevent tight hot loop on network failures
          await new Promise(resolve => setTimeout(resolve, 500));
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

export default router;
