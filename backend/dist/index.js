"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const pg_1 = require("pg");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Enable CORS for frontend
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'x-api-key']
}));
app.use(express_1.default.json());
// Initialize Neon PostgreSQL Connection Pool if DATABASE_URL is available
let pool = null;
if (process.env.DATABASE_URL) {
    console.log('[XyloAPI DB] Database URL detected. Initializing pool...');
    pool = new pg_1.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // Required for serverless postgres connections
        }
    });
}
else {
    console.log('[XyloAPI DB] No DATABASE_URL found. Running in in-memory mode.');
}
// Database schema initialization
async function initDatabase() {
    if (!pool)
        return;
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
    }
    catch (err) {
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
                await pool.query('INSERT INTO request_logs (path, status_code, latency_ms) VALUES ($1, $2, $3)', [req.path, res.statusCode, durationMs]);
            }
            catch (dbErr) {
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
        description: "Download video and audio streams directly from platforms like TikTok, Instagram, YouTube, Spotify, SoundCloud, Twitter/X, Threads, and Facebook.",
        status: "active",
        endpointsCount: 8,
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
            const countRes = await pool.query("SELECT COUNT(*)::integer as count FROM request_logs WHERE created_at >= CURRENT_DATE");
            requestsToday = countRes.rows[0]?.count || 0;
            // 2. Calculate average latency
            const latencyRes = await pool.query("SELECT AVG(latency_ms)::float as avg_lat FROM request_logs");
            const dbAvgLat = latencyRes.rows[0]?.avg_lat;
            avgLatency = dbAvgLat !== null && dbAvgLat !== undefined ? Math.round(dbAvgLat) : 0;
            // 3. Calculate success rate percentage
            const successRes = await pool.query("SELECT COUNT(*)::integer as total, SUM(CASE WHEN status_code < 400 THEN 1 ELSE 0 END)::integer as success FROM request_logs");
            const total = successRes.rows[0]?.total || 0;
            const success = successRes.rows[0]?.success || 0;
            successRate = total > 0 ? parseFloat(((success / total) * 100).toFixed(2)) : 100.00;
        }
        catch (dbErr) {
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
    let avgLatency = liveRequestsCount > 0 ? Math.round(liveTotalLatencyMs / liveRequestsCount) : 0;
    let successRate = liveRequestsCount > 0 ? parseFloat(((liveSuccessRequestsCount / liveRequestsCount) * 100).toFixed(2)) : 100.00;
    let lastRequests = [];
    let topEndpoints = [];
    let hourlyChartData = [];
    if (pool) {
        try {
            // 1. Basic Stats
            const countRes = await pool.query("SELECT COUNT(*)::integer as count FROM request_logs WHERE created_at >= CURRENT_DATE");
            requestsToday = countRes.rows[0]?.count || 0;
            const latencyRes = await pool.query("SELECT AVG(latency_ms)::float as avg_lat FROM request_logs");
            const dbAvgLat = latencyRes.rows[0]?.avg_lat;
            avgLatency = dbAvgLat !== null && dbAvgLat !== undefined ? Math.round(dbAvgLat) : 0;
            const successRes = await pool.query("SELECT COUNT(*)::integer as total, SUM(CASE WHEN status_code < 400 THEN 1 ELSE 0 END)::integer as success FROM request_logs");
            const total = successRes.rows[0]?.total || 0;
            const success = successRes.rows[0]?.success || 0;
            successRate = total > 0 ? parseFloat(((success / total) * 100).toFixed(2)) : 100.00;
            // 2. Last 10 Requests
            const lastReqRes = await pool.query("SELECT id, path, status_code, latency_ms, created_at FROM request_logs ORDER BY created_at DESC LIMIT 10");
            lastRequests = lastReqRes.rows;
            // 3. Top Endpoints
            const topEndRes = await pool.query("SELECT path, COUNT(*)::integer as count, ROUND(AVG(latency_ms))::integer as avg_latency FROM request_logs GROUP BY path ORDER BY count DESC LIMIT 5");
            topEndpoints = topEndRes.rows;
            // 4. Hourly Chart Data (Last 24 Hours)
            const hourlyRes = await pool.query("SELECT DATE_TRUNC('hour', created_at) as hour, COUNT(*)::integer as count, ROUND(AVG(latency_ms))::integer as avg_latency FROM request_logs WHERE created_at >= NOW() - INTERVAL '24 hours' GROUP BY hour ORDER BY hour ASC");
            hourlyChartData = hourlyRes.rows.map(row => ({
                time: row.hour,
                count: row.count,
                latency: row.avg_latency
            }));
        }
        catch (dbErr) {
            console.error('[XyloAPI DB] Error querying monitor stats:', dbErr);
        }
    }
    res.json({
        status: "online",
        uptime,
        stats: {
            requestsToday,
            averageLatencyMs: avgLatency,
            successRatePercent: successRate,
            errorRatePercent: parseFloat((100 - successRate).toFixed(2))
        },
        lastRequests,
        topEndpoints,
        hourlyChartData
    });
});
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
        const pythonPath = process.env.PYTHON_PATH || 'python';
        const scriptPath = path_1.default.join(__dirname, '..', 'scrapers', 'scraper_runner.py');
        const payloadStr = JSON.stringify(payload || {});
        const payloadBase64 = Buffer.from(payloadStr).toString('base64');
        // Run python process writing base64 payload to its standard input
        const { stdout, stderr } = await new Promise((resolve, reject) => {
            const child = (0, child_process_1.exec)(`"${pythonPath}" "${scriptPath}" "${slug}"`, { maxBuffer: 1024 * 1024 * 50, env: { ...process.env } }, // 50MB output buffer & inherit env
            (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve({ stdout, stderr });
                }
            });
            if (child.stdin) {
                child.stdin.write(payloadBase64);
                child.stdin.end();
            }
        });
        if (stderr && !stdout) {
            return res.status(500).json({
                success: false,
                error: "Execution pipeline error",
                details: stderr
            });
        }
        try {
            const result = JSON.parse(stdout.trim());
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
        }
        catch (parseError) {
            return res.json({
                success: true,
                creator: "XyloAPI",
                rawOutput: stdout,
                warning: "Output was not valid JSON",
                error: parseError instanceof Error ? parseError.message : String(parseError)
            });
        }
    }
    catch (error) {
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
        fs.appendFileSync(path_1.default.join(__dirname, '..', 'incoming_requests.log'), JSON.stringify({ timestamp: new Date().toISOString(), slug, payload }) + '\n', 'utf-8');
    }
    catch (logErr) { }
    try {
        const pythonPath = process.env.PYTHON_PATH || 'python';
        const scriptPath = path_1.default.join(__dirname, '..', 'scrapers', 'scraper_runner.py');
        const payloadStr = JSON.stringify(payload || {});
        const payloadBase64 = Buffer.from(payloadStr).toString('base64');
        // Run python process writing base64 payload to its standard input
        const { stdout, stderr } = await new Promise((resolve, reject) => {
            const child = (0, child_process_1.exec)(`"${pythonPath}" "${scriptPath}" "${slug}"`, { maxBuffer: 1024 * 1024 * 50, env: { ...process.env } }, // 50MB output buffer & inherit env
            (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve({ stdout, stderr });
                }
            });
            if (child.stdin) {
                child.stdin.write(payloadBase64);
                child.stdin.end();
            }
        });
        if (stderr && !stdout) {
            return res.status(500).json({
                success: false,
                error: "Execution pipeline error",
                details: stderr
            });
        }
        try {
            const result = JSON.parse(stdout.trim());
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
        }
        catch (parseError) {
            return res.json({
                success: true,
                creator: "XyloAPI",
                rawOutput: stdout,
                warning: "Output was not valid JSON",
                error: parseError instanceof Error ? parseError.message : String(parseError)
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to execute downloader pipeline",
            details: error.message || String(error)
        });
    }
});
// Start Server
app.listen(PORT, () => {
    console.log(`[XyloAPI Server] Running at http://localhost:${PORT}`);
});
