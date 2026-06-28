import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { docTopics } from './Docs/topicsData';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from './ui/table';
import { ResponsiveContainer, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import TadpoleIcon from '@iconify-react/svg-spinners/tadpole';
import { Icon } from '@iconify/react';

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
  const host = (window.location.hostname === 'localhost' && window.location.port !== '3000')
    ? 'http://localhost:5000'
    : window.location.origin;

  const { data, isLoading: loading, isRefetching: refreshing, refetch: fetchMonitorData } = useQuery({
    queryKey: ['monitorData'],
    queryFn: async () => {
      const res = await fetch(`${host}/api/monitor`);
      if (!res.ok) throw new Error('Failed to fetch monitor data');
      return res.json() as Promise<MonitorData>;
    },
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  const [testPhase, setTestPhase] = useState<'idle' | 'ping' | 'download' | 'upload' | 'complete'>('idle');
  const [progressPing, setProgressPing] = useState<number | null>(null);
  const [progressDownload, setProgressDownload] = useState<number | null>(null);
  const [progressUpload, setProgressUpload] = useState<number | null>(null);
  const [speedTestError, setSpeedTestError] = useState<string | null>(null);

  const handleRunSpeedTest = () => {
    if (testPhase !== 'idle' && testPhase !== 'complete') return;

    setTestPhase('download'); // Go straight to test phase
    setProgressPing(null);
    setProgressDownload(null);
    setProgressUpload(null);
    setSpeedTestError(null);

    fetch(`${host}/api/monitor/speedtest`, { method: 'POST' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(result => {
        setProgressPing(result.pingMs);
        setProgressDownload(result.downloadSpeedMbps);
        setProgressUpload(result.uploadSpeedMbps);
        setTestPhase('complete');
      })
      .catch(err => {
        setSpeedTestError(err.message || 'Speed test failed.');
        setTestPhase('idle');
      });
  };

  const handleManualRefresh = () => {
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
      <div className="pt-[90px] pb-10 md:pt-[140px] md:pb-[120px] min-h-[calc(100vh-200px)] max-w-[1200px] mx-auto px-4 md:px-8 flex justify-center items-center" style={{ minHeight: '60vh' }}>
        <div className="font-mono text-gold flex items-center gap-3">
          <TadpoleIcon width="18" height="18" />
          <span>Memuat Sistem...</span>
        </div>
      </div>
    );
  }

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

  return (
    <div className="pt-[90px] pb-10 md:pt-[140px] md:pb-[120px] min-h-[calc(100vh-200px)] max-w-[1200px] mx-auto px-4 md:px-8">
      {/* Top Banner Row */}
      <div className="flex justify-between items-end border-b border-[#1f1f1f] pb-8 mb-12 flex-wrap gap-6">
        <div>
          <span className="font-mono text-[11px] text-gold tracking-[0.15em] uppercase block mb-2">SYSTEM TELEMETRY</span>
          <h1 className="font-display text-[clamp(24px,4vw,40px)] font-black text-white leading-[1.1] tracking-[0.01em] uppercase">LIVE API MONITOR</h1>
        </div>
        <div className="flex items-center gap-5">
          <Button
            onClick={handleManualRefresh}
            variant="outline"
            size="sm"
            disabled={refreshing}
            className="flex items-center gap-2 h-9"
          >
            {refreshing ? <TadpoleIcon width="12" height="12" /> : <Icon icon="lucide:refresh-cw" width="12" height="12" />}
            {refreshing ? 'REFRESHING...' : 'REFRESH'}
          </Button>
          <Badge variant={isOnline ? "success" : "secondary"} className="h-9 flex items-center gap-1.5 px-3">
            <span className={`w-1.5 h-1.5 rounded-none inline-block ${isOnline ? 'bg-[#27C93F] shadow-[0_0_6px_#27C93F]' : 'bg-steel'}`}></span>
            <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </Badge>
        </div>
      </div>

      {/* Grid: Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 mb-12">
        <Card className="p-[12px] md:p-6 flex flex-col justify-between min-h-[95px] md:min-h-[140px] hover:border-gold/30 hover:shadow-[0_0_15px_rgba(212,175,55,0.05)] transition-all duration-300">
          <div className="flex justify-between items-center font-mono text-[9px] md:text-[11px] text-ash tracking-[0.05em]">
            <span>SYSTEM UPTIME</span>
            <Icon icon="lucide:clock" width="16" height="16" className="text-gold" />
          </div>
          <span className="font-display text-base md:text-2xl lg:text-3xl font-black text-white mt-[6px] md:mt-3 mb-[2px] md:mb-[6px] leading-none">{formatUptime(uptimeVal)}</span>
          <span className="text-[9px] md:text-[11px] text-steel">Duration since server boot</span>
        </Card>
        <Card className="p-[12px] md:p-6 flex flex-col justify-between min-h-[95px] md:min-h-[140px] hover:border-gold/30 hover:shadow-[0_0_15px_rgba(212,175,55,0.05)] transition-all duration-300">
          <div className="flex justify-between items-center font-mono text-[9px] md:text-[11px] text-ash tracking-[0.05em]">
            <span>REQUESTS HARI INI</span>
            <Icon icon="lucide:activity" width="16" height="16" className="text-gold" />
          </div>
          <span className="font-display text-base md:text-2xl lg:text-3xl font-black text-white mt-[6px] md:mt-3 mb-[2px] md:mb-[6px] leading-none">{stats.requestsToday.toLocaleString()}</span>
          <span className="text-[9px] md:text-[11px] text-steel">Total logs recorded since midnight</span>
        </Card>
        <Card className="p-[12px] md:p-6 flex flex-col justify-between min-h-[95px] md:min-h-[140px] hover:border-gold/30 hover:shadow-[0_0_15px_rgba(212,175,55,0.05)] transition-all duration-300">
          <div className="flex justify-between items-center font-mono text-[9px] md:text-[11px] text-ash tracking-[0.05em]">
            <span>JUMLAH REQUESTS</span>
            <Icon icon="lucide:database" width="16" height="16" className="text-gold" />
          </div>
          <span className="font-display text-base md:text-2xl lg:text-3xl font-black text-white mt-[6px] md:mt-3 mb-[2px] md:mb-[6px] leading-none">{(stats.totalRequests || 0).toLocaleString()}</span>
          <span className="text-[9px] md:text-[11px] text-steel">All-time request logs recorded</span>
        </Card>
        <Card className="p-[12px] md:p-6 flex flex-col justify-between min-h-[95px] md:min-h-[140px] hover:border-gold/30 hover:shadow-[0_0_15px_rgba(212,175,55,0.05)] transition-all duration-300">
          <div className="flex justify-between items-center font-mono text-[9px] md:text-[11px] text-ash tracking-[0.05em]">
            <span>TOTAL ENDPOINTS</span>
            <Icon icon="lucide:layers" width="16" height="16" className="text-gold" />
          </div>
          <span className="font-display text-base md:text-2xl lg:text-3xl font-black text-white mt-[6px] md:mt-3 mb-[2px] md:mb-[6px] leading-none">{docTopics.length.toLocaleString()}</span>
          <span className="text-[9px] md:text-[11px] text-steel">Total active playground endpoints</span>
        </Card>
        <Card className="p-[12px] md:p-6 flex flex-col justify-between min-h-[95px] md:min-h-[140px] hover:border-gold/30 hover:shadow-[0_0_15px_rgba(212,175,55,0.05)] transition-all duration-300 col-span-1">
          <div className="flex justify-between items-center font-mono text-[9px] md:text-[11px] text-ash tracking-[0.05em]">
            <span>SUKSES</span>
            <Icon icon="lucide:check-circle" width="16" height="16" className="text-[#27C93F]" />
          </div>
          <span className={`font-display text-base md:text-2xl lg:text-3xl font-black mt-[6px] md:mt-3 mb-[2px] md:mb-[6px] leading-none ${stats.successRatePercent < 90 ? 'text-gold' : 'text-[#27C93F]'}`}>
            {stats.successRatePercent.toFixed(2)}%
          </span>
          <span className="text-[9px] md:text-[11px] text-steel">Persentase berhasil</span>
        </Card>
        <Card className="p-[12px] md:p-6 flex flex-col justify-between min-h-[95px] md:min-h-[140px] hover:border-gold/30 hover:shadow-[0_0_15px_rgba(212,175,55,0.05)] transition-all duration-300 col-span-1">
          <div className="flex justify-between items-center font-mono text-[9px] md:text-[11px] text-ash tracking-[0.05em]">
            <span>GAGAL</span>
            <Icon icon="lucide:x-circle" width="16" height="16" className={stats.errorRatePercent > 0 ? 'text-[#FF3B30]' : 'text-steel'} />
          </div>
          <span className={`font-display text-base md:text-2xl lg:text-3xl font-black mt-[6px] md:mt-3 mb-[2px] md:mb-[6px] leading-none ${stats.errorRatePercent > 0 ? 'text-[#FF3B30]' : 'text-white'}`}>
            {stats.errorRatePercent.toFixed(2)}%
          </span>
          <span className="text-[9px] md:text-[11px] text-steel">Persentase gagal</span>
        </Card>
      </div>

      {/* Grid Layout splits: Live Traffic & Top Endpoints */}
      <div className="grid grid-cols-1 lg:grid-cols-[2.2fr_1fr] gap-8 mb-12">
        {/* Live Traffic Feed */}
        <Card className="p-0 overflow-hidden">
          <CardHeader className="p-6 md:p-8">
            <CardTitle>Riwayat Request</CardTitle>
            <CardDescription>Log request API secara real-time</CardDescription>
          </CardHeader>
          <CardContent className="p-0 md:p-6 md:pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">Waktu</TableHead>
                  <TableHead>Metode</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>Kode</TableHead>
                  <TableHead>Latency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lastRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-steel py-12">
                      TIDAK ADA LALU LINTAS API
                    </TableCell>
                  </TableRow>
                ) : (
                  lastRequests.map((req: any) => (
                    <TableRow key={req.id}>
                      <TableCell className="hidden sm:table-cell font-mono text-[11px] text-ash">
                        {formatTime(req.created_at)}
                      </TableCell>
                      <TableCell className="py-2.5">
                        <Badge variant={req.path.includes('/trigger') ? "default" : "info"}>
                          {req.path.includes('/trigger') ? 'POST' : 'GET'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-white max-w-[120px] overflow-hidden text-ellipsis whitespace-normal sm:whitespace-nowrap break-all sm:break-normal" title={req.path}>
                        {req.path}
                      </TableCell>
                      <TableCell>
                        <Badge variant={req.status_code < 400 ? "success" : req.status_code < 500 ? "warning" : "destructive"}>
                          {req.status_code}
                        </Badge>
                      </TableCell>
                      <TableCell className={req.latency_ms > 500 ? 'text-gold' : 'text-white'}>
                        {req.latency_ms}ms
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Endpoints */}
        <Card className="p-0 overflow-hidden">
          <CardHeader className="p-6 md:p-8">
            <CardTitle>Top Endpoints</CardTitle>
            <CardDescription>5 endpoints terpopuler saat ini</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 flex flex-col gap-4">
            {topEndpoints.length === 0 ? (
              <div className="text-steel py-12 text-center font-mono">
                TIDAK ADA DATA
              </div>
            ) : (
              topEndpoints.map((ep: any, idx: number) => (
                <div key={ep.path} className="flex items-center p-4 border border-[#1f1f1f] bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-200">
                  <div className="w-7 h-7 border border-[#2B2B2B] bg-black flex items-center justify-center font-mono text-xs font-bold text-gold mr-4">
                    <span>{idx + 1}</span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-mono text-xs sm:text-sm font-semibold text-white mb-0.5 break-all sm:break-normal whitespace-normal sm:whitespace-nowrap">{ep.path}</span>
                    <span className="text-[11px] text-steel">Latency: {ep.avg_latency}ms</span>
                  </div>
                  <div className="flex items-center font-mono text-xs font-bold text-gold">
                    <span>{ep.count}x</span>
                    <Icon icon="lucide:arrow-up-right" width="12" height="12" className="text-gold ml-1" />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Section: Server Speed Test */}
      <Card className="p-0 overflow-hidden mb-12">
        <CardHeader className="p-6 md:p-8">
          <CardTitle className="flex items-center gap-2">
            <Icon icon="lucide:wifi" width="18" height="18" className="text-cyan-pulse" />
            Tes kecepatan server
          </CardTitle>
          <CardDescription>Ukur kecepatan koneksi internet server ini secara real-time.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 flex flex-col gap-5">
          {speedTestError && (
            <div className="p-4 border border-[#FF3B30] bg-[#FF3B30]/5 text-[#FF3B30] font-mono text-[11px] mb-2">
              ERROR: {speedTestError}
            </div>
          )}

          {/* Action Trigger Button */}
          <Button
            onClick={handleRunSpeedTest}
            disabled={testPhase !== 'idle' && testPhase !== 'complete'}
            variant={(testPhase !== 'idle' && testPhase !== 'complete') ? "outline" : "gold"}
            className="w-full h-12"
          >
            {(testPhase !== 'idle' && testPhase !== 'complete') ? (
              <>
                <TadpoleIcon className="text-gold mr-2 text-black" width="16" height="16" />
                Testing...
              </>
            ) : (
              <>
                <Icon icon="lucide:wifi" className="mr-2 text-cyan-pulse animate-pulse" width="16" height="16" />
                Mulai Tes Kecepatan
              </>
            )}
          </Button>

          {/* Details & Progress Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Ping */}
            <div className="border border-[#1f1f1f] bg-black/40 p-5 flex justify-between items-center transition-all hover:border-gold/25">
              <div>
                <span className="text-[9px] text-ash font-mono tracking-[1px] block uppercase">Ping Latency</span>
                <span className="text-2xl font-black font-mono text-white">
                  {progressPing !== null ? `${progressPing} ms` : '—'}
                </span>
              </div>
              {(testPhase !== 'idle' && testPhase !== 'complete' && progressPing === null) && <TadpoleIcon className="text-cyan-pulse" width="14" height="14" />}
              {progressPing !== null && <Icon icon="lucide:check-circle" width="16" height="16" className="text-[#27C93F]" />}
            </div>

            {/* Download */}
            <div className="border border-[#1f1f1f] bg-black/40 p-5 flex justify-between items-center transition-all hover:border-gold/25">
              <div>
                <span className="text-[9px] text-ash font-mono tracking-[1px] block uppercase">Download Speed</span>
                <span className="text-2xl font-black font-mono text-cyan-pulse">
                  {progressDownload !== null ? `${progressDownload} Mbps` : '—'}
                </span>
              </div>
              {(testPhase !== 'idle' && testPhase !== 'complete' && progressDownload === null) && <TadpoleIcon className="text-cyan-pulse" width="14" height="14" />}
              {progressDownload !== null && <Icon icon="lucide:check-circle" width="16" height="16" className="text-[#27C93F]" />}
            </div>

            {/* Upload */}
            <div className="border border-[#1f1f1f] bg-black/40 p-5 flex justify-between items-center transition-all hover:border-gold/25">
              <div>
                <span className="text-[9px] text-ash font-mono tracking-[1px] block uppercase">Upload Speed</span>
                <span className="text-2xl font-black font-mono text-gold-text">
                  {progressUpload !== null ? `${progressUpload} Mbps` : '—'}
                </span>
              </div>
              {(testPhase !== 'idle' && testPhase !== 'complete' && progressUpload === null) && <TadpoleIcon className="text-gold" width="14" height="14" />}
              {progressUpload !== null && <Icon icon="lucide:check-circle" width="16" height="16" className="text-[#27C93F]" />}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section: Dynamic Supporting Charts */}
      <Card className="p-0 overflow-hidden">
        <CardHeader className="p-6 md:p-10">
          <CardTitle className="flex items-center gap-2">
            <Icon icon="lucide:bar-chart-3" width="18" height="18" className="text-gold" />
            Grafik aktivitas
          </CardTitle>
          <CardDescription>Data dihitung berdasarkan jumlah request dan latency</CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-10 pt-0 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Chart 1: Traffic Volume */}
          <div className="border border-[#1f1f1f] bg-black/40 p-6">
            <h4 className="font-mono text-[11px] text-ash tracking-[0.1em] mb-6 uppercase">JUMLAH REQUEST PER JAM</h4>
            {hourlyData.length === 0 ? (
              <div className="h-48 flex flex-col justify-center items-center font-mono">
                <span className="text-steel text-xs font-bold mb-1">Belum ada data</span>
                <p className="text-steel text-[10px] m-0">Menunggu log database...</p>
              </div>
            ) : (
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="var(--gold)" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#161616" strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="time" 
                      tickFormatter={formatHourLabel} 
                      stroke="#444" 
                      tick={{ fill: 'var(--steel)', fontSize: 9, fontFamily: 'monospace' }}
                      axisLine={{ stroke: '#222' }}
                    />
                    <YAxis 
                      stroke="#444" 
                      tick={{ fill: 'var(--steel)', fontSize: 9, fontFamily: 'monospace' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.03)' }} 
                      content={({ active, payload, label }: any) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-black/90 border border-[#1f1f1f] p-3 font-mono text-[11px] shadow-lg">
                              <p className="text-ash mb-1">{formatHourLabel(label)}</p>
                              <p className="text-gold font-bold">
                                Requests: {payload[0].value} req
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="count" name="Requests" fill="url(#barGrad)" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Chart 2: Latency Time */}
          <div className="border border-[#1f1f1f] bg-black/40 p-6">
            <h4 className="font-mono text-[11px] text-ash tracking-[0.1em] mb-6 uppercase">LATENCY PER JAM</h4>
            {hourlyData.length === 0 ? (
              <div className="h-48 flex flex-col justify-center items-center font-mono">
                <span className="text-steel text-xs font-bold mb-1">Belum ada data</span>
                <p className="text-steel text-[10px] m-0">Menunggu log database...</p>
              </div>
            ) : (
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--cyan-pulse)" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="var(--cyan-pulse)" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#161616" strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="time" 
                      tickFormatter={formatHourLabel} 
                      stroke="#444" 
                      tick={{ fill: 'var(--steel)', fontSize: 9, fontFamily: 'monospace' }}
                      axisLine={{ stroke: '#222' }}
                    />
                    <YAxis 
                      stroke="#444" 
                      tickFormatter={formatLatencyLabel}
                      tick={{ fill: 'var(--steel)', fontSize: 9, fontFamily: 'monospace' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      content={({ active, payload, label }: any) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-black/90 border border-[#1f1f1f] p-3 font-mono text-[11px] shadow-lg">
                              <p className="text-ash mb-1">{formatHourLabel(label)}</p>
                              <p className="text-gold font-bold">
                                Latency: {payload[0].value}ms
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area type="monotone" dataKey="latency" name="Latency" stroke="var(--cyan-pulse)" strokeWidth={1.5} fill="url(#latencyGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
