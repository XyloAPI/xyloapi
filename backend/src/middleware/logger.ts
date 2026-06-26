import { Request, Response, NextFunction } from 'express';
import { pool } from '../utils/db';

export let liveRequestsCount = 0;
export let liveSuccessRequestsCount = 0;
export let liveTotalLatencyMs = 0;

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  
  res.on('finish', async () => {
    const latency = Date.now() - startTime;
    
    if (req.path === '/api/status' || req.path === '/api/monitor') {
      return;
    }
    
    liveRequestsCount++;
    liveTotalLatencyMs += latency;
    if (res.statusCode < 400) {
      liveSuccessRequestsCount++;
    }
    
    if (pool) {
      try {
        await pool.query(
          "INSERT INTO request_logs (path, status_code, latency_ms) VALUES ($1, $2, $3)",
          [req.path, res.statusCode, latency]
        );
      } catch (dbErr) {
        // silent
      }
    }
  });
  
  next();
}
