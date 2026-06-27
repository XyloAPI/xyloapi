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

    // 1. Download Test (15.0 seconds concurrent pool to saturate up to multi-Gbps lines)
    const downloadController = new AbortController();
    const downloadTimeout = setTimeout(() => downloadController.abort(), 15000);
    const startDownload = Date.now();
    let downloadedBytes = 0;
    
    // 4 concurrent download connections of 25MB each, repeated until timeout
    const downloadConcurrency = 4;
    const downloadWorkers = Array.from({ length: downloadConcurrency }, async () => {
      while (!downloadController.signal.aborted) {
        try {
          const downRes = await fetch('https://speed.cloudflare.com/__down?bytes=25000000', {
            signal: downloadController.signal
          });
          if (!downRes.ok) continue;
          if (downRes.body) {
            for await (const chunk of downRes.body as any) {
              downloadedBytes += chunk.length || chunk.byteLength || 0;
            }
          }
        } catch (e: any) {
          if (e.name !== 'AbortError') {
            // Keep going unless it's a real failure
          }
        }
      }
    });

    await Promise.all(downloadWorkers);
    clearTimeout(downloadTimeout);
    const durationDownloadSec = (Date.now() - startDownload) / 1000;
    const downloadSpeedMbps = parseFloat(((downloadedBytes * 8) / (durationDownloadSec * 1000000)).toFixed(2));

    // 2. Upload Test (15.0 seconds concurrent pool to saturate up to multi-Gbps lines)
    const uploadController = new AbortController();
    const uploadTimeout = setTimeout(() => uploadController.abort(), 15000);
    const startUpload = Date.now();
    let uploadedBytes = 0;

    // 4 concurrent upload connections generator, repeated until timeout
    const uploadConcurrency = 4;
    const uploadWorkers = Array.from({ length: uploadConcurrency }, async () => {
      while (!uploadController.signal.aborted) {
        try {
          const uploadStream = new ReadableStream({
            pull(ctrl) {
              const chunk = new Uint8Array(131072); // 128KB chunks
              ctrl.enqueue(chunk);
              uploadedBytes += chunk.length;
            }
          });
          const upRes = await fetch('https://speed.cloudflare.com/__up', {
            method: 'POST',
            body: uploadStream,
            duplex: 'half',
            signal: uploadController.signal
          } as any);
          await upRes.text();
        } catch (e: any) {
          if (e.name !== 'AbortError') {
            // Keep going unless it's a real failure
          }
        }
      }
    });

    await Promise.all(uploadWorkers);
    clearTimeout(uploadTimeout);
    const durationUploadSec = (Date.now() - startUpload) / 1000;
    const uploadSpeedMbps = parseFloat(((uploadedBytes * 8) / (durationUploadSec * 1000000)).toFixed(2));

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
