import { useState, useEffect } from 'react';
import { Activity, Clock, CheckCircle2, XCircle, ArrowUpRight, BarChart3, RefreshCw, Database, Layers, Wifi } from 'lucide-react';
import './Monitor.css';

interface RequestLog {
  id: number;
  path: string;
  status_code: number;
  latency_ms: number;
  created_at: string;
}

interface TopEndpoint {
  path: string;
  count: number;
  avg_latency: number;
}

interface ChartPoint {
  time: string;
  count: number;
  latency: number;
}

interface MonitorData {
  status: string;
  uptime: number;
  stats: {
    requestsToday: number;
    totalRequests?: number;
    totalEndpoints?: number;
    averageLatencyMs: number;
    successRatePercent: number;
    errorRatePercent: number;
  };
  lastRequests: RequestLog[];
  topEndpoints: TopEndpoint[];
  hourlyChartData: ChartPoint[];
}

export default function Monitor() {
  const [data, setData] = useState<MonitorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [testPhase, setTestPhase] = useState<'idle' | 'ping' | 'download' | 'upload' | 'complete'>('idle');
  const [displaySpeed, setDisplaySpeed] = useState(0);
  const [progressPing, setProgressPing] = useState<number | null>(null);
  const [progressDownload, setProgressDownload] = useState<number | null>(null);
  const [progressUpload, setProgressUpload] = useState<number | null>(null);
  const [speedTestError, setSpeedTestError] = useState<string | null>(null);

  const handleRunSpeedTest = () => {
    if (testPhase !== 'idle' && testPhase !== 'complete') return;

    setTestPhase('download'); // Go straight to test phase
    setDisplaySpeed(0);
    setProgressPing(null);
    setProgressDownload(null);
    setProgressUpload(null);
    setSpeedTestError(null);

    const host = (window.location.hostname === 'localhost' && window.location.port !== '3000') 
      ? 'http://localhost:5000' 
      : window.location.origin;

    // Fire POST request — returns instantly as soon as backend is done measuring
    fetch(`${host}/api/monitor/speedtest`, { method: 'POST' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(result => {
        setProgressPing(result.pingMs);
        setProgressDownload(result.downloadSpeedMbps);
        setProgressUpload(result.uploadSpeedMbps);
        setDisplaySpeed(result.downloadSpeedMbps); // Point needle to final download speed
        setTestPhase('complete');
      })
      .catch(err => {
        setSpeedTestError(err.message || 'Speed test failed.');
        setTestPhase('idle');
        setDisplaySpeed(0);
      });
  };

  const fetchMonitorData = async () => {
    try {
      const host = (window.location.hostname === 'localhost' && window.location.port !== '3000') ? 'http://localhost:5000' : window.location.origin;
      const res = await fetch(`${host}/api/monitor`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      // Safe fallback state on error
      setData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMonitorData();
    const interval = setInterval(fetchMonitorData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchMonitorData();
  };

  const formatUptime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  const formatHourLabel = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      const hours = String(date.getHours()).padStart(2, '0');
      return `${hours}:00`;
    } catch {
      return timeStr;
    }
  };

  const formatLatencyLabel = (ms: number) => {
    if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
    return `${ms}ms`;
  };

  if (loading) {
    return (
      <div className="monitor-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <RefreshCw className="animate-spin" size={18} />
          <span>INITIALIZING GATEWAY FEED...</span>
        </div>
      </div>
    );
  }

  // Active metrics or fallback parameters
  const stats = data?.stats || {
    requestsToday: 0,
    totalRequests: 0,
    totalEndpoints: 0,
    averageLatencyMs: 0,
    successRatePercent: 100.00,
    errorRatePercent: 0.00,
  };
  const isOnline = data?.status === 'online';
  const uptimeVal = data?.uptime || 0;
  const lastRequests = data?.lastRequests || [];
  const topEndpoints = data?.topEndpoints || [];
  const hourlyData = data?.hourlyChartData || [];

  // SVG Chart Dimensions & Computations
  const chartWidth = 500;
  const chartHeight = 160;
  const paddingX = 40;
  const paddingY = 20;

  // Calculate maximums for chart scales
  const maxCount = hourlyData.length > 0 ? Math.max(...hourlyData.map(d => d.count), 5) : 5;
  const maxLatency = hourlyData.length > 0 ? Math.max(...hourlyData.map(d => d.latency), 100) : 100;

  const currentDisplayVal = (testPhase === 'idle' || testPhase === 'complete')
    ? 0
    : displaySpeed;

  const needleAngle = (testPhase === 'idle' || testPhase === 'complete')
    ? -135
    : -135 + (Math.min(currentDisplayVal, 1000) / 1000) * 270;

  const transitionDuration = (testPhase === 'idle' || testPhase === 'complete') ? '0.6s' : '0.1s';

  return (
    <div className="monitor-container container">
      {/* Top Banner Row */}
      <div className="monitor-header">
        <div>
          <span className="monitor-pretitle">SYSTEM TELEMETRY</span>
          <h1 className="monitor-title">LIVE API GATEWAY MONITOR</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={handleManualRefresh}
            className="btn btn-ghost"
            style={{ padding: '8px 16px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-color)' }}
            disabled={refreshing}
          >
            <RefreshCw className={refreshing ? 'animate-spin' : ''} size={12} />
            {refreshing ? 'REFRESHING...' : 'REFRESH'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}></span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: isOnline ? 'var(--white)' : 'var(--ash)' }}>
              {isOnline ? 'SYSTEM ACTIVE' : 'SYSTEM OFFLINE'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Metric Cards */}
      <div className="monitor-stats-grid">
        <div className="monitor-stat-card">
          <div className="stat-card-header">
            <span>GATEWAY UPTIME</span>
            <Clock size={16} style={{ color: 'var(--gold)' }} />
          </div>
          <span className="stat-card-value">{formatUptime(uptimeVal)}</span>
          <span className="stat-card-label">Duration since server boot</span>
        </div>
        <div className="monitor-stat-card">
          <div className="stat-card-header">
            <span>REQUESTS TODAY</span>
            <Activity size={16} style={{ color: 'var(--gold)' }} />
          </div>
          <span className="stat-card-value">{stats.requestsToday.toLocaleString()}</span>
          <span className="stat-card-label">Total logs recorded since midnight</span>
        </div>
        <div className="monitor-stat-card">
          <div className="stat-card-header">
            <span>TOTAL REQUESTS</span>
            <Database size={16} style={{ color: 'var(--gold)' }} />
          </div>
          <span className="stat-card-value">{(stats.totalRequests || 0).toLocaleString()}</span>
          <span className="stat-card-label">All-time request logs recorded</span>
        </div>
        <div className="monitor-stat-card">
          <div className="stat-card-header">
            <span>TOTAL ENDPOINTS</span>
            <Layers size={16} style={{ color: 'var(--gold)' }} />
          </div>
          <span className="stat-card-value">{(stats.totalEndpoints || 72).toLocaleString()}</span>
          <span className="stat-card-label">Total active route groupings</span>
        </div>
        <div className="monitor-stat-card">
          <div className="stat-card-header">
            <span>SUCCESS RATE</span>
            <CheckCircle2 size={16} style={{ color: '#27C93F' }} />
          </div>
          <span className="stat-card-value" style={{ color: stats.successRatePercent < 90 ? 'var(--gold)' : '#27C93F' }}>
            {stats.successRatePercent.toFixed(2)}%
          </span>
          <span className="stat-card-label">HTTP responses &lt; 400</span>
        </div>
        <div className="monitor-stat-card">
          <div className="stat-card-header">
            <span>ERROR RATE</span>
            <XCircle size={16} style={{ color: stats.errorRatePercent > 0 ? '#FF3B30' : 'var(--steel)' }} />
          </div>
          <span className="stat-card-value" style={{ color: stats.errorRatePercent > 0 ? '#FF3B30' : 'var(--white)' }}>
            {stats.errorRatePercent.toFixed(2)}%
          </span>
          <span className="stat-card-label">HTTP responses &gt;= 400</span>
        </div>
      </div>

      {/* Grid Layout splits: Live Traffic & Top Endpoints */}
      <div className="monitor-splits-grid">
        {/* Live Traffic Feed */}
        <div className="monitor-card wide-card">
          <div className="monitor-card-header">
            <h3 className="card-title">Live Traffic Feed</h3>
            <span className="card-subtitle">Real-time database records</span>
          </div>
          <div className="table-responsive">
            <table className="monitor-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Method</th>
                  <th>Pathway</th>
                  <th>HTTP Code</th>
                  <th>Latency</th>
                </tr>
              </thead>
              <tbody>
                {lastRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--steel)', padding: '48px 0', fontFamily: 'var(--font-mono)' }}>
                      NO INBOUND TRAFFIC REGISTERED IN DATABASE
                    </td>
                  </tr>
                ) : (
                  lastRequests.map((req) => (
                    <tr key={req.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ash)' }}>
                        {formatTime(req.created_at)}
                      </td>
                      <td style={{ fontWeight: 700, fontSize: '11px', color: req.path.startsWith('/api/data') ? 'var(--gold)' : 'var(--white)' }}>
                        {req.path.includes('/trigger') ? 'POST' : 'GET'}
                      </td>
                      <td style={{ 
                        fontFamily: 'var(--font-mono)', 
                        fontSize: '12px', 
                        color: 'var(--white)',
                        maxWidth: '120px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }} title={req.path}>
                        {req.path}
                      </td>
                      <td>
                        <span className={`status-badge ${req.status_code < 400 ? 'success' : req.status_code < 500 ? 'warning' : 'danger'}`}>
                          {req.status_code}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: req.latency_ms > 500 ? 'var(--gold)' : 'var(--white)' }}>
                        {req.latency_ms}ms
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Endpoints */}
        <div className="monitor-card narrow-card">
          <div className="monitor-card-header">
            <h3 className="card-title">Top Endpoints</h3>
            <span className="card-subtitle">Most active route groupings</span>
          </div>
          <div className="top-endpoints-list">
            {topEndpoints.length === 0 ? (
              <div style={{ color: 'var(--steel)', padding: '48px 0', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                NO DATA LOGGED
              </div>
            ) : (
              topEndpoints.map((ep, idx) => (
                <div key={ep.path} className="top-endpoint-item">
                  <div className="ep-rank">
                    <span>{idx + 1}</span>
                  </div>
                  <div className="ep-details">
                    <span className="ep-path">{ep.path}</span>
                    <span className="ep-stats">Avg Latency: {ep.avg_latency}ms</span>
                  </div>
                  <div className="ep-count">
                    <span>{ep.count} hits</span>
                    <ArrowUpRight size={12} style={{ color: 'var(--gold)', marginLeft: '4px' }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Section: Server Speed Test */}
      <div className="monitor-card" style={{ marginBottom: '48px' }}>
        <div className="monitor-card-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '24px' }}>
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wifi size={18} style={{ color: 'var(--cyan-pulse)' }} />
            Server Speed Test
          </h3>
          <span className="card-subtitle">Measure bandwidth capacity and ping latency to this server.</span>
        </div>

        {speedTestError && (
          <div style={{ padding: '16px', border: '1px solid #FF3B30', background: 'rgba(255, 59, 48, 0.05)', color: '#FF3B30', fontFamily: 'var(--font-mono)', fontSize: '11px', marginBottom: '24px' }}>
            ERROR: {speedTestError}
          </div>
        )}

        <div className="monitor-speedtest-grid">
          {/* Gauge Column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative', width: '220px', height: '220px' }}>
              <svg width="220" height="220" viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
                {/* Track Circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="var(--border-color)"
                  strokeWidth="10"
                  strokeDasharray="376.99 1000"
                  strokeLinecap="round"
                  transform="rotate(135 100 100)"
                />
                {/* Active Glow Circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke={currentDisplayVal > 0 ? (testPhase === 'upload' ? 'var(--gold)' : 'var(--cyan-pulse)') : 'transparent'}
                  strokeWidth="10"
                  strokeDasharray={`${(Math.min(currentDisplayVal, 1000) / 1000) * 376.99} 1000`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  transform="rotate(135 100 100)"
                  style={{ transition: `stroke-dasharray ${transitionDuration} cubic-bezier(0.25, 0.8, 0.25, 1), stroke 0.3s` }}
                />

                {/* Tickmarks */}
                {[0, 200, 400, 600, 800, 1000].map((val) => {
                  const angle = 135 + (val / 1000) * 270;
                  const rad = (angle * Math.PI) / 180;
                  const x1 = 100 + 70 * Math.cos(rad);
                  const y1 = 100 + 70 * Math.sin(rad);
                  const x2 = 100 + 80 * Math.cos(rad);
                  const y2 = 100 + 80 * Math.sin(rad);
                  const tx = 100 + 60 * Math.cos(rad);
                  const ty = 100 + 60 * Math.sin(rad) + 3;
                  return (
                    <g key={val}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--iron)" strokeWidth="2" />
                      <text x={tx} y={ty} fill="var(--ash)" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">{val}</text>
                    </g>
                  );
                })}

                {/* Needle */}
                <line
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="30"
                  stroke="#FF3B30"
                  strokeWidth="3"
                  strokeLinecap="round"
                  style={{
                    transform: `rotate(${needleAngle}deg)`,
                    transformOrigin: '100px 100px',
                    transition: `transform ${transitionDuration} cubic-bezier(0.25, 0.8, 0.25, 1)`
                  }}
                />
                <circle cx="100" cy="100" r="8" fill="#FF3B30" />
                <circle cx="100" cy="100" r="3" fill="#FFF" />
              </svg>

              {/* Center GO Button */}
              {(testPhase === 'idle' || testPhase === 'complete') && (
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <button
                    onClick={handleRunSpeedTest}
                    style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--black)',
                      border: '2px solid var(--border-color)',
                      color: 'var(--ash)',
                      fontFamily: 'var(--font-display)',
                      fontSize: '16px',
                      fontWeight: 900,
                      letterSpacing: '1.5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'none',
                      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--cyan-pulse)';
                      e.currentTarget.style.color = 'var(--cyan-pulse)';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.15)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.color = 'var(--ash)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {testPhase === 'complete' ? 'RUN' : 'GO'}
                  </button>
                </div>
              )}
            </div>

            {/* Readout completely below the dial SVG (No Overlaps!) */}
            {testPhase !== 'idle' && (
              <div style={{ textAlign: 'center', marginTop: '-15px', minHeight: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: testPhase === 'complete' ? '#27C93F' : 'var(--gold)',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  display: 'block',
                  fontWeight: 'bold'
                }}>
                  {testPhase === 'complete' ? 'COMPLETE' : 'TESTING'}
                </span>
                <span style={{
                  fontSize: '48px',
                  fontWeight: 900,
                  color: testPhase === 'complete' ? '#27C93F' : 'var(--white)',
                  fontFamily: 'var(--font-mono)',
                  lineHeight: '1',
                  display: 'block',
                  margin: '6px 0'
                }}>
                  {testPhase === 'complete' ? Math.round(progressDownload || 0) : Math.round(currentDisplayVal)}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--steel)',
                  letterSpacing: '1.5px',
                  display: 'block'
                }}>
                  Mbps
                </span>
              </div>
            )}
          </div>

          {/* Details & Progress Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Ping */}
            <div style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--black)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '9px', color: 'var(--ash)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', display: 'block', textTransform: 'uppercase' }}>Ping Latency</span>
                <span style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--white)' }}>
                  {progressPing !== null ? `${progressPing} ms` : (testPhase !== 'idle' && testPhase !== 'complete') ? 'Measuring...' : '—'}
                </span>
              </div>
              {(testPhase !== 'idle' && testPhase !== 'complete' && progressPing === null) && <RefreshCw className="animate-spin" size={14} style={{ color: 'var(--cyan-pulse)' }} />}
              {progressPing !== null && <CheckCircle2 size={16} style={{ color: '#27C93F' }} />}
            </div>

            {/* Download */}
            <div style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--black)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '9px', color: 'var(--ash)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', display: 'block', textTransform: 'uppercase' }}>Download Speed</span>
                <span style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--cyan-pulse)' }}>
                  {progressDownload !== null ? `${progressDownload} Mbps` : (testPhase !== 'idle' && testPhase !== 'complete') ? 'Measuring...' : '—'}
                </span>
              </div>
              {(testPhase !== 'idle' && testPhase !== 'complete' && progressDownload === null) && <RefreshCw className="animate-spin" size={14} style={{ color: 'var(--cyan-pulse)' }} />}
              {progressDownload !== null && <CheckCircle2 size={16} style={{ color: '#27C93F' }} />}
            </div>

            {/* Upload */}
            <div style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--black)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '9px', color: 'var(--ash)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', display: 'block', textTransform: 'uppercase' }}>Upload Speed</span>
                <span style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--gold-text)' }}>
                  {progressUpload !== null ? `${progressUpload} Mbps` : (testPhase !== 'idle' && testPhase !== 'complete') ? 'Measuring...' : '—'}
                </span>
              </div>
              {(testPhase !== 'idle' && testPhase !== 'complete' && progressUpload === null) && <RefreshCw className="animate-spin" size={14} style={{ color: 'var(--gold)' }} />}
              {progressUpload !== null && <CheckCircle2 size={16} style={{ color: '#27C93F' }} />}
            </div>
          </div>
        </div>
      </div>

      {/* Section: Dynamic Supporting Charts */}
      <div className="monitor-charts-section">
        <div className="monitor-card-header" style={{ marginBottom: '32px' }}>
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} style={{ color: 'var(--gold)' }} />
            Traffic & Latency Timelines
          </h3>
          <span className="card-subtitle">Calculated dynamically using timestamp aggregation buckets</span>
        </div>

        <div className="monitor-charts-grid">
          {/* Chart 1: Traffic Volume */}
          <div className="monitor-chart-card">
            <h4 className="chart-card-title">HOURLY REQUESTS VOLUME</h4>
            {hourlyData.length === 0 ? (
              <div className="chart-fallback">
                <span>NO GRAPH DATA AVAILABLE</span>
                <p>Waiting for database log entries...</p>
              </div>
            ) : (
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="svg-chart">
                {/* Grid Lines */}
                <line x1={paddingX} y1={paddingY} x2={chartWidth - 20} y2={paddingY} stroke="#1A1A1A" strokeDasharray="3,3" />
                <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - 20} y2={chartHeight / 2} stroke="#1A1A1A" strokeDasharray="3,3" />
                <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - 20} y2={chartHeight - paddingY} stroke="#222" />

                {/* Labels Y */}
                <text x={paddingX - 10} y={paddingY + 4} textAnchor="end" className="chart-label">{maxCount}</text>
                <text x={paddingX - 10} y={chartHeight / 2 + 4} textAnchor="end" className="chart-label">{Math.round(maxCount / 2)}</text>
                <text x={paddingX - 10} y={chartHeight - paddingY + 4} textAnchor="end" className="chart-label">0</text>

                {/* Bars */}
                {hourlyData.map((d, i) => {
                  const step = (chartWidth - paddingX - 20) / hourlyData.length;
                  const x = paddingX + i * step + step * 0.15;
                  const barWidth = Math.max(step * 0.7 - 2, 2);
                  const barHeight = ((d.count / maxCount) * (chartHeight - paddingY * 2));
                  const y = chartHeight - paddingY - barHeight;

                  return (
                    <g key={i}>
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        fill="var(--gold)"
                        opacity={0.8}
                      />
                      {/* X Label for every 4th element */}
                      {i % 4 === 0 && (
                        <text x={x + barWidth / 2} y={chartHeight - 4} textAnchor="middle" className="chart-label-x">
                          {formatHourLabel(d.time)}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          {/* Chart 2: Latency Trend */}
          <div className="monitor-chart-card">
            <h4 className="chart-card-title">HOURLY AVERAGE LATENCY</h4>
            {hourlyData.length === 0 ? (
              <div className="chart-fallback">
                <span>NO GRAPH DATA AVAILABLE</span>
                <p>Waiting for database log entries...</p>
              </div>
            ) : (
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="svg-chart">
                <defs>
                  <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--cyan-pulse)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="var(--cyan-pulse)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <line x1={paddingX} y1={paddingY} x2={chartWidth - 20} y2={paddingY} stroke="#1A1A1A" strokeDasharray="3,3" />
                <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - 20} y2={chartHeight / 2} stroke="#1A1A1A" strokeDasharray="3,3" />
                <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - 20} y2={chartHeight - paddingY} stroke="#222" />

                {/* Labels Y */}
                <text x={paddingX - 10} y={paddingY + 4} textAnchor="end" className="chart-label">{formatLatencyLabel(maxLatency)}</text>
                <text x={paddingX - 10} y={chartHeight / 2 + 4} textAnchor="end" className="chart-label">{formatLatencyLabel(Math.round(maxLatency / 2))}</text>
                <text x={paddingX - 10} y={chartHeight - paddingY + 4} textAnchor="end" className="chart-label">0ms</text>

                {/* Path & Fill */}
                {(() => {
                  const step = (chartWidth - paddingX - 20) / (hourlyData.length > 1 ? hourlyData.length - 1 : 1);
                  const points = hourlyData.map((d, i) => {
                    const x = paddingX + i * step;
                    const valHeight = ((d.latency / maxLatency) * (chartHeight - paddingY * 2));
                    const y = chartHeight - paddingY - valHeight;
                    return `${x},${y}`;
                  }).join(' ');

                  const areaPoints = `${paddingX},${chartHeight - paddingY} ${points} ${paddingX + (hourlyData.length - 1) * step},${chartHeight - paddingY}`;

                  return (
                    <>
                      <polygon
                        points={areaPoints}
                        fill="url(#latencyGrad)"
                      />
                      <polyline
                        fill="none"
                        stroke="var(--cyan-pulse)"
                        strokeWidth="1.5"
                        points={points}
                      />
                    </>
                  );
                })()}

                {/* Dots (Brutalist Tiny Squares) & Labels X */}
                {hourlyData.map((d, i) => {
                  const step = (chartWidth - paddingX - 20) / (hourlyData.length > 1 ? hourlyData.length - 1 : 1);
                  const x = paddingX + i * step;
                  const valHeight = ((d.latency / maxLatency) * (chartHeight - paddingY * 2));
                  const y = chartHeight - paddingY - valHeight;

                  return (
                    <g key={i}>
                      <rect x={x - 2} y={y - 2} width="4" height="4" fill="var(--cyan-pulse)" />
                      {/* X Label for every 4th element */}
                      {i % 4 === 0 && (
                        <text x={x} y={chartHeight - 4} textAnchor="middle" className="chart-label-x">
                          {formatHourLabel(d.time)}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
