import { Router } from 'express';
import { pool } from '../utils/db';
import { liveRequestsCount, liveSuccessRequestsCount, liveTotalLatencyMs } from '../middleware/logger';
import { fetchImageWithRedirects } from '../utils/pipeline';
import { apiModules } from '../utils/modules';

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
      activePipelinesCount: apiModules.length,
    },
    version: "1.0.0"
  });
});

router.get('/monitor', async (req, res) => {
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
    modules: apiModules
  });
});

router.get('/image-proxy', async (req, res) => {
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

export default router;
