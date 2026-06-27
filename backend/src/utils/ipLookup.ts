let cachedToken: string | null = null;
let cachedTokenExpiry = 0;

async function getAuthToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  // Cache token for 150 seconds (since TTL is 180 seconds)
  if (cachedToken && now < cachedTokenExpiry) {
    return cachedToken;
  }

  const response = await fetch(
    'https://api.iplocation.io/api/v1/gen-ref-jwt',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://iplocation.io/',
        'Origin': 'https://iplocation.io',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({ method: 'V1' }),
      signal: AbortSignal.timeout(10000),
    }
  );

  if (!response.ok) {
    throw new Error(`Token request failed with status ${response.status}`);
  }

  const data = (await response.json()) as any;
  if (data && data.token) {
    cachedToken = data.token;
    cachedTokenExpiry = now + 150; // Set expiry to 150 seconds from now
    return cachedToken!;
  }

  throw new Error('Failed to retrieve authentication token from iplocation.io');
}

export interface IPGeolocInfo {
  ip: string;
  country: string;
  country_code: string;
  region: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  isp: string;
  org: string;
  asn: string;
  services: {
    ip2location?: any;
    ipinfo?: any;
    dbip?: any;
    criminalip?: any;
  };
}

export async function lookupIP(ipOrDomain: string): Promise<IPGeolocInfo> {
  const token = await getAuthToken();

  const services = ['ip2location', 'ipinfo', 'dbip', 'criminalip'];
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Referer': 'https://iplocation.io/',
    'Origin': 'https://iplocation.io',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  };

  const results: Record<string, any> = {};

  await Promise.all(
    services.map(async (service) => {
      try {
        const response = await fetch(
          'https://api.iplocation.io/api/v1/ip-location',
          {
            method: 'POST',
            headers,
            body: JSON.stringify({
              method: 'V1',
              ip: ipOrDomain,
              service,
            }),
            signal: AbortSignal.timeout(10000),
          }
        );

        if (response.ok) {
          const data = (await response.json()) as any;
          if (data && data.result) {
            const resObj = data.result;
            const svcData = resObj[service];
            // Only store if it's a real object (not null, not an empty/non-empty array)
            if (svcData && typeof svcData === 'object' && !Array.isArray(svcData)) {
              results[service] = svcData;
            }
          }
        }
      } catch (err) {
        // Silently catch service failure so other services can still complete
      }
    })
  );

  // Fallback / extraction of primary geolocation fields
  // Try to find the best available values from the services
  const resolvedIp = results.ip2location?.ip || results.ipinfo?.ip || results.dbip?.ip || ipOrDomain;
  const country = results.ipinfo?.country_name || results.dbip?.country_name || results.ip2location?.country_name || 'N/A';
  const countryCode = results.ipinfo?.country_code || results.dbip?.country_code || results.ip2location?.country_code || 'N/A';
  const region = results.ipinfo?.state_name || results.dbip?.state_name || results.ip2location?.state_name || 'N/A';
  const city = results.ipinfo?.city_name || results.dbip?.city_name || results.ip2location?.city_name || 'N/A';
  
  const latStr = results.ipinfo?.latitude || results.dbip?.latitude || results.ip2location?.latitude || null;
  const lonStr = results.ipinfo?.longitude || results.dbip?.longitude || results.ip2location?.longitude || null;

  const latitude = latStr ? parseFloat(latStr) : null;
  const longitude = lonStr ? parseFloat(lonStr) : null;

  const isp = results.dbip?.isp || results.ip2location?.isp || results.ipinfo?.organization || 'N/A';
  const org = results.ipinfo?.organization || results.dbip?.organization || results.ip2location?.organization || 'N/A';
  const asn = results.ipinfo?.asn || results.dbip?.asn || results.criminalip?.asn || 'N/A';

  return {
    ip: resolvedIp,
    country,
    country_code: countryCode,
    region,
    city,
    latitude,
    longitude,
    isp,
    org,
    asn,
    services: results,
  };
}

export interface WebServerInfo {
  host: string;
  server: string;
}

export async function checkWebServer(host: string): Promise<WebServerInfo> {
  const token = await getAuthToken();

  // Normalize host — strip protocol, ensure trailing slash
  let cleanHost = host.replace(/^https?:\/\//i, '');
  if (!cleanHost.endsWith('/')) cleanHost += '/';

  const response = await fetch(
    'https://api.iplocation.io/api/v1/check-website-server',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Referer': 'https://iplocation.io/',
        'Origin': 'https://iplocation.io',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({ host: cleanHost, method: 'JwtV2' }),
      signal: AbortSignal.timeout(10000),
    }
  );

  if (!response.ok) {
    throw new Error(`Web server check failed with status ${response.status}`);
  }

  const data = (await response.json()) as any;

  if (data?.errors?.length) {
    throw new Error(data.errors[0] || 'Unknown error from web server check');
  }

  const result = data?.result;
  if (!result) throw new Error('Empty response from web server check');

  return {
    host: result.host || cleanHost,
    server: result.server || 'unknown',
  };
}

export interface PingResult {
  domain: string;
  ip: string;
  rtt_ms: number | null;
  packet_loss: string;
  rtt_min: string;
  rtt_avg: string;
  rtt_max: string;
  rtt_mdev: string;
}

export async function pingDomain(domain: string): Promise<PingResult> {
  const token = await getAuthToken();

  // Strip protocol prefix
  const cleanDomain = domain.replace(/^https?:\/\//i, '').replace(/\/$/, '');

  const response = await fetch(
    'https://iplocation.io/ajax/ping',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Referer': `https://iplocation.io/ping/https://${cleanDomain}`,
        'Origin': 'https://iplocation.io',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({ domain: cleanDomain, method: 'JwtV2' }),
      signal: AbortSignal.timeout(15000),
    }
  );

  if (!response.ok) {
    throw new Error(`Ping request failed with status ${response.status}`);
  }

  const data = (await response.json()) as any;

  if (data?.errors?.length) {
    throw new Error(data.errors[0] || 'Unknown ping error');
  }

  const raw: string = data?.result?.data || '';
  if (!raw) throw new Error('Empty ping response');

  // Parse resolved IP from: "PING 172.67.217.82 (172.67.217.82) ..."
  const ipMatch = raw.match(/^PING\s+[\w.\-]+\s+\(([\d.]+)\)/m);
  const ip = ipMatch?.[1] || 'N/A';

  // Parse RTT from: "time=4.68 ms"
  const rttMatch = raw.match(/time=([\d.]+)\s*ms/);
  const rtt_ms = rttMatch ? parseFloat(rttMatch[1]) : null;

  // Parse packet loss from: "0% packet loss"
  const lossMatch = raw.match(/([\d.]+)%\s+packet loss/);
  const packet_loss = lossMatch ? `${lossMatch[1]}%` : 'N/A';

  // Parse RTT stats from: "rtt min/avg/max/mdev = 4.679/4.679/4.679/0.000 ms"
  const rttStatsMatch = raw.match(/rtt\s+min\/avg\/max\/mdev\s*=\s*([\d.]+)\/([\d.]+)\/([\d.]+)\/([\d.]+)\s*ms/);
  const rtt_min  = rttStatsMatch?.[1] ? `${rttStatsMatch[1]} ms` : 'N/A';
  const rtt_avg  = rttStatsMatch?.[2] ? `${rttStatsMatch[2]} ms` : 'N/A';
  const rtt_max  = rttStatsMatch?.[3] ? `${rttStatsMatch[3]} ms` : 'N/A';
  const rtt_mdev = rttStatsMatch?.[4] ? `${rttStatsMatch[4]} ms` : 'N/A';

  return {
    domain: cleanDomain,
    ip,
    rtt_ms,
    packet_loss,
    rtt_min,
    rtt_avg,
    rtt_max,
    rtt_mdev,
  };
}

export interface MXRecord {
  query: string;
  ttl: string;
  preference: string;
  mx: string;
}

export interface MXLookupResult {
  host: string;
  status: string;
  elapsed: string;
  dns_server: string;
  records: MXRecord[];
}

export async function mxLookup(host: string): Promise<MXLookupResult> {
  const token = await getAuthToken();

  const cleanHost = host.replace(/^https?:\/\//i, '').replace(/\/$/, '');

  const response = await fetch(
    'https://iplocation.io/ajax/mx-lookup',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Referer': 'https://iplocation.io/mx-lookup',
        'Origin': 'https://iplocation.io',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({ host: cleanHost, dnsType: 'google', type: 'mx', method: 'JwtV2' }),
      signal: AbortSignal.timeout(15000),
    }
  );

  if (!response.ok) {
    throw new Error(`MX lookup failed with status ${response.status}`);
  }

  const data = (await response.json()) as any;

  if (data?.errors?.length) {
    throw new Error(data.errors[0] || 'Unknown MX lookup error');
  }

  const mxResult = data?.results?.MX;
  if (!mxResult) throw new Error('No MX data in response');

  const records: MXRecord[] = mxResult?.answer?.DNS?.MX?.records || [];
  const status: string = mxResult.status || 'UNKNOWN';
  const elapsed: string = mxResult.elapsed || 'N/A';
  const dns_server: string = mxResult.server || 'N/A';

  return {
    host: cleanHost,
    status,
    elapsed,
    dns_server,
    records,
  };
}

export interface NSRecord {
  query: string;
  ttl: string;
  value: string;
}

export interface NSLookupResult {
  host: string;
  status: string;
  elapsed: string;
  dns_server: string;
  records: NSRecord[];
}

export async function nsLookup(host: string): Promise<NSLookupResult> {
  const token = await getAuthToken();

  const cleanHost = host.replace(/^https?:\/\//i, '').replace(/\/$/, '');

  const response = await fetch(
    'https://iplocation.io/ajax/ns-lookup',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Referer': 'https://iplocation.io/ns-lookup',
        'Origin': 'https://iplocation.io',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({ host: cleanHost, dns: 'google', type: 'ns', method: 'JwtV2' }),
      signal: AbortSignal.timeout(15000),
    }
  );

  if (!response.ok) {
    throw new Error(`NS lookup failed with status ${response.status}`);
  }

  const data = (await response.json()) as any;

  if (data?.errors?.length) {
    throw new Error(data.errors[0] || 'Unknown NS lookup error');
  }

  const nsResult = data?.results?.NS;
  if (!nsResult) throw new Error('No NS data in response');

  const records: NSRecord[] = nsResult?.answer?.DNS?.NS?.records || [];
  const status: string = nsResult.status || 'UNKNOWN';
  const elapsed: string = nsResult.elapsed || 'N/A';
  const dns_server: string = nsResult.server || 'N/A';

  return {
    host: cleanHost,
    status,
    elapsed,
    dns_server,
    records,
  };
}

export interface DnsNsItem {
  name: string;
  ip: string;
  ttl: string;
  time: string;
  status: boolean;
  auth: boolean;
  parent: boolean;
  local: boolean;
}

export interface DnsTests {
  pass: string[];
  fail: string[];
}

export interface DnsValidationResult {
  host: string;
  ns: DnsNsItem[];
  tests: DnsTests;
}

export async function dnsValidation(host: string): Promise<DnsValidationResult> {
  const token = await getAuthToken();
  const cleanHost = host.replace(/^https?:\/\//i, '').replace(/\/$/, '');

  const bodyParams = new URLSearchParams();
  bodyParams.append('host', cleanHost);
  bodyParams.append('method', 'JwtV2');

  const response = await fetch(
    'https://api.iplocation.io/api/v1/dns-record-validation',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Authorization': `Bearer ${token}`,
        'Referer': 'https://iplocation.io/',
        'Origin': 'https://iplocation.io',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: bodyParams.toString(),
      signal: AbortSignal.timeout(20000),
    }
  );

  if (!response.ok) {
    throw new Error(`DNS validation failed with status ${response.status}`);
  }

  const data = (await response.json()) as any;

  if (data?.errors?.length) {
    throw new Error(data.errors[0] || 'Unknown DNS validation error');
  }

  const resultHost = data?.result?.host || cleanHost;
  const dnsData = data?.result?.dns || {};

  return {
    host: resultHost,
    ns: dnsData.ns || [],
    tests: {
      pass: dnsData.tests?.pass || [],
      fail: dnsData.tests?.fail || [],
    },
  };
}

export interface GenericDnsRecord {
  type: string;
  query: string;
  ttl: string;
  content: string;
  details?: any;
}

export interface DnsLookupAllResult {
  host: string;
  total_records: number;
  records: Record<string, GenericDnsRecord[]>;
}

export async function dnsLookupAll(host: string, typeParam: string = 'COMMON'): Promise<DnsLookupAllResult> {
  const token = await getAuthToken();
  const cleanHost = host.replace(/^https?:\/\//i, '').replace(/\/$/, '');

  const response = await fetch(
    'https://iplocation.io/ajax/dns-lookup',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Referer': 'https://iplocation.io/all-dns-records-of-domain',
        'Origin': 'https://iplocation.io',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({ h: cleanHost, r: 'google', t: typeParam.toUpperCase(), method: 'JwtV2' }),
      signal: AbortSignal.timeout(20000),
    }
  );

  if (!response.ok) {
    throw new Error(`DNS lookup all failed with status ${response.status}`);
  }

  const data = (await response.json()) as any;

  if (data?.errors?.length) {
    throw new Error(data.errors[0] || 'Unknown DNS lookup error');
  }

  const rawResults = data?.results || {};
  const formattedRecords: Record<string, GenericDnsRecord[]> = {};
  let totalCount = 0;

  for (const recType of Object.keys(rawResults)) {
    const typeObj = rawResults[recType];
    const dnsObj = typeObj?.answer?.DNS?.[recType];
    const rawRecs: any[] = dnsObj?.records || [];

    if (rawRecs.length > 0) {
      formattedRecords[recType] = rawRecs.map((r: any) => {
        let content = '';
        if (recType === 'A' || recType === 'AAAA') content = r.ip || '';
        else if (recType === 'MX') content = `[Prio ${r.preference}] ${r.mx}`;
        else if (recType === 'NS' || recType === 'CNAME' || recType === 'PTR' || recType === 'TXT' || recType === 'CAA') content = r.value || r.ip || r.cname || '';
        else if (recType === 'SOA') content = `Primary NS: ${r.mname}, Admin: ${r.rname}, Serial: ${r.serial}`;
        else content = JSON.stringify(r);

        return {
          type: recType,
          query: r.query || cleanHost,
          ttl: r.ttl ? `${r.ttl}s` : 'N/A',
          content,
          details: r,
        };
      });
      totalCount += rawRecs.length;
    }
  }

  return {
    host: cleanHost,
    total_records: totalCount,
    records: formattedRecords,
  };
}

export interface DmarcTests {
  pass: string[];
  fail: string[];
}

export interface DmarcValidationResult {
  host: string;
  tests: DmarcTests;
}

export async function dmarcValidation(host: string): Promise<DmarcValidationResult> {
  const token = await getAuthToken();
  const cleanHost = host.replace(/^https?:\/\//i, '').replace(/\/$/, '');

  const bodyParams = new URLSearchParams();
  bodyParams.append('host', cleanHost);
  bodyParams.append('method', 'JwtV2');

  const response = await fetch(
    'https://api.iplocation.io/api/v1/dmarc-record-validation',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Authorization': `Bearer ${token}`,
        'Referer': 'https://iplocation.io/',
        'Origin': 'https://iplocation.io',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: bodyParams.toString(),
      signal: AbortSignal.timeout(20000),
    }
  );

  if (!response.ok) {
    throw new Error(`DMARC validation failed with status ${response.status}`);
  }

  const data = (await response.json()) as any;

  if (data?.errors?.length) {
    throw new Error(data.errors[0] || 'Unknown DMARC validation error');
  }

  const resultHost = data?.result?.host || cleanHost;
  const dmarcData = data?.result?.dmarc || {};

  return {
    host: resultHost,
    tests: {
      pass: dmarcData.pass || [],
      fail: dmarcData.fail || [],
    },
  };
}

export interface DnsBlacklistItem {
  url: string;
  found: boolean;
  txt: string;
}

export interface IpBlacklistResult {
  ip: string;
  total_checked: number;
  blacklisted_count: number;
  clean_count: number;
  dnsBL: DnsBlacklistItem[];
}

export async function ipBlacklistCheck(ipOrHost: string): Promise<IpBlacklistResult> {
  const token = await getAuthToken();
  const cleanTarget = ipOrHost.replace(/^https?:\/\//i, '').replace(/\/$/, '');

  const bodyParams = new URLSearchParams();
  bodyParams.append('ip', cleanTarget);
  bodyParams.append('fetch', 'fetch');
  bodyParams.append('method', 'JwtV2');

  const response = await fetch(
    'https://api.iplocation.io/api/v1/ip-blacklist-checker',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Authorization': `Bearer ${token}`,
        'Referer': 'https://iplocation.io/',
        'Origin': 'https://iplocation.io',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: bodyParams.toString(),
      signal: AbortSignal.timeout(25000),
    }
  );

  if (!response.ok) {
    throw new Error(`IP blacklist check failed with status ${response.status}`);
  }

  const data = (await response.json()) as any;

  if (data?.errors?.length) {
    throw new Error(data.errors[0] || 'Unknown IP blacklist check error');
  }

  const resolvedIp = data?.result?.ip || cleanTarget;
  const dnsBL: DnsBlacklistItem[] = data?.result?.dnsBL || [];

  const blacklistedCount = dnsBL.filter(item => item.found).length;
  const cleanCount = dnsBL.length - blacklistedCount;

  return {
    ip: resolvedIp,
    total_checked: dnsBL.length,
    blacklisted_count: blacklistedCount,
    clean_count: cleanCount,
    dnsBL,
  };
}

export interface VerifyEmailResult {
  email: string;
  is_valid: boolean;
  status: string;
}

export async function verifyEmail(email: string): Promise<VerifyEmailResult> {
  const token = await getAuthToken();
  const cleanEmail = email.trim();

  const bodyParams = new URLSearchParams();
  bodyParams.append('email', cleanEmail);
  bodyParams.append('method', 'JwtV2');

  const response = await fetch(
    'https://api.iplocation.io/api/v1/verify-email-address',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Authorization': `Bearer ${token}`,
        'Referer': 'https://iplocation.io/',
        'Origin': 'https://iplocation.io',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: bodyParams.toString(),
      signal: AbortSignal.timeout(15000),
    }
  );

  if (!response.ok) {
    throw new Error(`Verify email failed with status ${response.status}`);
  }

  const data = (await response.json()) as any;

  if (data?.errors?.length) {
    throw new Error(data.errors[0] || 'Unknown verify email error');
  }

  const successVal = data?.result?.success;
  const isValid = successVal === 1 || successVal === true;

  return {
    email: cleanEmail,
    is_valid: isValid,
    status: isValid ? 'VALID' : 'INVALID',
  };
}

export interface Ipv4ToIpv6Result {
  ip: string;
  ipv6C: string;
  ipv6E: string;
  ipv6ES: string;
}

export async function ipv4ToIpv6(ip: string): Promise<Ipv4ToIpv6Result> {
  const token = await getAuthToken();
  const cleanIp = ip.trim();

  const response = await fetch(
    'https://iplocation.io/ajax/ipv4-to-ipv6',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Referer': `https://iplocation.io/ipv4-to-ipv6/${cleanIp}`,
        'Origin': 'https://iplocation.io',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({ ip: cleanIp, method: 'JwtV2' }),
      signal: AbortSignal.timeout(15000),
    }
  );

  if (!response.ok) {
    throw new Error(`IPv4 to IPv6 conversion failed with status ${response.status}`);
  }

  const data = (await response.json()) as any;

  if (data?.errors?.length) {
    throw new Error(data.errors[0] || 'Unknown IPv4 to IPv6 error');
  }

  const resObj = data?.result || {};

  return {
    ip: resObj.ip || cleanIp,
    ipv6C: resObj.ipv6C || '',
    ipv6E: resObj.ipv6E || '',
    ipv6ES: resObj.ipv6ES || '',
  };
}

export interface IpToDecimalResult {
  ip: string;
  ip_long: number;
  ipv6C: string;
  ipv6E: string;
  ipv6ES: string;
}

export async function ipToDecimal(ip: string): Promise<IpToDecimalResult> {
  const token = await getAuthToken();
  const cleanIp = ip.trim();

  const response = await fetch(
    'https://iplocation.io/ajax/ip-to-decimal',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Referer': `https://iplocation.io/ip-to-decimal/${cleanIp}`,
        'Origin': 'https://iplocation.io',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({ ip: cleanIp, method: 'JwtV2' }),
      signal: AbortSignal.timeout(15000),
    }
  );

  if (!response.ok) {
    throw new Error(`IP to Decimal conversion failed with status ${response.status}`);
  }

  const data = (await response.json()) as any;

  if (data?.errors?.length) {
    throw new Error(data.errors[0] || 'Unknown IP to Decimal error');
  }

  const resObj = data?.result || {};

  return {
    ip: resObj.ip || cleanIp,
    ip_long: resObj.ipLong || 0,
    ipv6C: resObj.ipv6C || '',
    ipv6E: resObj.ipv6E || '',
    ipv6ES: resObj.ipv6ES || '',
  };
}

export interface Ipv6CompatibilityResult {
  host: string;
  compatible: boolean;
  compatible_t: string;
  web: Array<{ address: string; ip: string }>;
  ns: Array<{ address: string; ip: string }>;
}

export async function checkIpv6Compatibility(host: string): Promise<Ipv6CompatibilityResult> {
  const token = await getAuthToken();
  const cleanHost = host.trim();

  const response = await fetch(
    'https://iplocation.io/ajax/ipv6-compatibility-checker',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Referer': `https://iplocation.io/ipv6-compatibility-checker/${cleanHost}`,
        'Origin': 'https://iplocation.io',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({ host: cleanHost, method: 'JwtV2' }),
      signal: AbortSignal.timeout(15000),
    }
  );

  if (!response.ok) {
    throw new Error(`IPv6 compatibility check failed with status ${response.status}`);
  }

  const data = (await response.json()) as any;

  if (data?.errors?.length) {
    throw new Error(data.errors[0] || 'Unknown IPv6 compatibility check error');
  }

  const resObj = data?.result || {};

  return {
    host: cleanHost,
    compatible: resObj.compatible === true || resObj.compatible === 'true',
    compatible_t: resObj.compatible_t || 'No',
    web: resObj.web || [],
    ns: resObj.ns || [],
  };
}

export interface Ipv6GeneratorResult {
  prefix: string;
  globalID: string;
  subnetID: string;
  IPChunk: string;
  IPFormat: string;
  IP: string;
  NetMask: string;
  Network: string;
  PrefixLength: string;
  CIDR: string;
  WildCard: string;
  BroadCast: string;
  FirstIP: string;
  FirstIPE: string;
  FirstIPES: string;
  LastIP: string;
  LastIPE: string;
  LastIPES: string;
  BlockSize: string;
}

function randomHex(length: number): string {
  let result = '';
  const characters = '0123456789abcdef';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function generateIpv6Address(globalId?: string, subnetId?: string): Promise<Ipv6GeneratorResult> {
  const token = await getAuthToken();
  const cleanGlobal = (globalId && globalId.trim()) ? globalId.trim() : randomHex(10);
  const cleanSubnet = (subnetId && subnetId.trim()) ? subnetId.trim() : randomHex(4);

  const response = await fetch(
    'https://iplocation.io/ajax/ipv6-address-generator',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Referer': 'https://iplocation.io/ipv6-address-generator',
        'Origin': 'https://iplocation.io',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        global_id: cleanGlobal,
        subnet_id: cleanSubnet,
        method: 'JwtV2',
      }),
      signal: AbortSignal.timeout(15000),
    }
  );

  if (!response.ok) {
    throw new Error(`IPv6 address generation failed with status ${response.status}`);
  }

  const data = (await response.json()) as any;

  if (data?.errors?.length) {
    throw new Error(data.errors[0] || 'Unknown IPv6 address generation error');
  }

  const resObj = data?.result || {};

  return {
    prefix: resObj.prefix || '',
    globalID: resObj.globalID || cleanGlobal,
    subnetID: resObj.subnetID || cleanSubnet,
    IPChunk: resObj.IPChunk || '',
    IPFormat: resObj.IPFormat || '',
    IP: resObj.IP || '',
    NetMask: resObj.NetMask || '',
    Network: resObj.Network || '',
    PrefixLength: resObj.PrefixLength || '',
    CIDR: resObj.CIDR || '',
    WildCard: resObj.WildCard || '',
    BroadCast: resObj.BroadCast || '',
    FirstIP: resObj.FirstIP || '',
    FirstIPE: resObj.FirstIPE || '',
    FirstIPES: resObj.FirstIPES || '',
    LastIP: resObj.LastIP || '',
    LastIPE: resObj.LastIPE || '',
    LastIPES: resObj.LastIPES || '',
    BlockSize: resObj.BlockSize || '',
  };
}

export interface Ipv6CidrToRangeResult {
  value: string;
  IP: string;
  NetMask: string;
  Network: string;
  PrefixLength: string;
  CIDR: string;
  WildCard: string;
  BroadCast: string;
  FirstIP: string;
  LastIP: string;
  BlockSize: string;
}

export async function ipv6CidrToRange(cidr: string): Promise<Ipv6CidrToRangeResult> {
  const token = await getAuthToken();
  const cleanCidr = cidr.trim();

  const response = await fetch(
    'https://iplocation.io/ajax/ipv6-cidr-to-range',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Referer': `https://iplocation.io/ipv6-cidr-to-range/${cleanCidr}`,
        'Origin': 'https://iplocation.io',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({ value: cleanCidr, method: 'JwtV2' }),
      signal: AbortSignal.timeout(15000),
    }
  );

  if (!response.ok) {
    throw new Error(`IPv6 CIDR to Range conversion failed with status ${response.status}`);
  }

  const data = (await response.json()) as any;

  if (data?.errors?.length) {
    throw new Error(data.errors[0] || 'Unknown IPv6 CIDR to Range error');
  }

  const resObj = data?.result || {};

  return {
    value: resObj.value || cleanCidr,
    IP: resObj.IP || '',
    NetMask: resObj.NetMask || '',
    Network: resObj.Network || '',
    PrefixLength: resObj.PrefixLength || '',
    CIDR: resObj.CIDR || '',
    WildCard: resObj.WildCard || '',
    BroadCast: resObj.BroadCast || '',
    FirstIP: resObj.FirstIP || '',
    LastIP: resObj.LastIP || '',
    BlockSize: resObj.BlockSize || '',
  };
}

export interface Ipv6RangeToCidrResult {
  value: string;
  BlockSize: string;
  Networks: string[];
}

export async function ipv6RangeToCidr(range: string): Promise<Ipv6RangeToCidrResult> {
  const token = await getAuthToken();
  const cleanRange = range.trim();

  const response = await fetch(
    'https://iplocation.io/ajax/ipv6-range-to-cidr',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Referer': `https://iplocation.io/ipv6-range-to-cidr/${cleanRange}`,
        'Origin': 'https://iplocation.io',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({ value: cleanRange, method: 'JwtV2' }),
      signal: AbortSignal.timeout(15000),
    }
  );

  if (!response.ok) {
    throw new Error(`IPv6 Range to CIDR conversion failed with status ${response.status}`);
  }

  const data = (await response.json()) as any;

  if (data?.errors?.length) {
    throw new Error(data.errors[0] || 'Unknown IPv6 Range to CIDR error');
  }

  const resObj = data?.result || {};

  return {
    value: resObj.value || cleanRange,
    BlockSize: resObj.BlockSize || '',
    Networks: resObj.Networks || [],
  };
}

export interface SubnetCalcResult {
  value: string;
  type: string;
  network: Record<string, {
    IP: string;
    NetMask: string;
    Network: string;
    PrefixLength: string;
    CIDR: string;
    WildCard: string;
    BroadCast: string;
    FirstIP: string;
    LastIP: string;
    BlockSize: string;
  }>;
  list: {
    nets: string[];
    ips: {
      ipv4: string[];
      ipv6: string[];
    };
  };
}

export async function calculateSubnet(ipWithCidr: string): Promise<SubnetCalcResult> {
  const token = await getAuthToken();
  const cleanIp = ipWithCidr.trim();

  const response = await fetch(
    'https://iplocation.io/ajax/subnet-calculator',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Referer': `https://iplocation.io/subnet-calculator/${cleanIp}`,
        'Origin': 'https://iplocation.io',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        info: 'subnetCalculator',
        ip: cleanIp,
        method: 'JwtV2',
      }),
      signal: AbortSignal.timeout(15000),
    }
  );

  if (!response.ok) {
    throw new Error(`Subnet calculator failed with status ${response.status}`);
  }

  const data = (await response.json()) as any;

  if (data?.errors?.length) {
    throw new Error(data.errors[0] || 'Unknown subnet calculation error');
  }

  const resObj = data?.result || {};

  return {
    value: resObj.value || '',
    type: resObj.type || '',
    network: resObj.network || {},
    list: {
      nets: resObj.list?.nets || [],
      ips: {
        ipv4: resObj.list?.ips?.ipv4 || [],
        ipv6: resObj.list?.ips?.ipv6 || [],
      },
    },
  };
}

export interface IpWhoisResult {
  host: string;
  ipC: string;
  ipE: string;
  hostname: string;
  whoisIP: string;
  ipCIDR: string[];
  ipData: {
    last_update: string;
    registration_date: string;
    net_range: string;
    country_code: string;
    country_name: string;
    state_name: string;
    city_name: string;
    postal_code: string;
    latitude: number;
    longitude: number;
    asn: string;
    organization: string;
    network_name: string;
  };
}

export async function ipWhoisLookup(ipAddress: string): Promise<IpWhoisResult> {
  const token = await getAuthToken();
  const cleanIp = ipAddress.trim();

  const response = await fetch(
    'https://iplocation.io/ajax/ip-whois-lookup',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Referer': `https://iplocation.io/ip-whois-lookup/${cleanIp}`,
        'Origin': 'https://iplocation.io',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        parsed: false,
        query: cleanIp,
        method: 'JwtV2',
      }),
      signal: AbortSignal.timeout(15000),
    }
  );

  if (!response.ok) {
    throw new Error(`IP Whois lookup failed with status ${response.status}`);
  }

  const data = (await response.json()) as any;

  if (data?.errors?.length) {
    throw new Error(data.errors[0] || 'Unknown IP Whois lookup error');
  }

  const resObj = data?.res || {};
  const ipData = resObj.ipData || {};

  return {
    host: resObj.host || cleanIp,
    ipC: resObj.ipC || '',
    ipE: resObj.ipE || '',
    hostname: resObj.hostname || '',
    whoisIP: resObj.whoisIP || '',
    ipCIDR: resObj.ipCIDR || [],
    ipData: {
      last_update: ipData.last_update || '',
      registration_date: ipData.registration_date || '',
      net_range: ipData.net_range || '',
      country_code: ipData.country_code || '',
      country_name: ipData.country_name || '',
      state_name: ipData.state_name || '',
      city_name: ipData.city_name || '',
      postal_code: ipData.postal_code || '',
      latitude: Number(ipData.latitude) || 0,
      longitude: Number(ipData.longitude) || 0,
      asn: ipData.asn || '',
      organization: ipData.organization || '',
      network_name: ipData.network_name || '',
    },
  };
}

export interface MacAddressResult {
  errors: string[];
  result: Array<{
    range_start: string;
    range_end: string;
    block: string;
    oui: string;
    history: Array<{
      org_name: string;
      is_private: boolean;
      org_address: string;
      action_date: string;
      action_type: string;
      src: string;
      country: string;
    }>;
  }>;
  mode: string;
  query: string;
  exec_time: number;
}

export async function macAddressLookup(macStr: string): Promise<MacAddressResult> {
  const token = await getAuthToken();
  const cleanMac = macStr.trim();

  const url = `https://macaddress.softrix.net/api/v7/index.php?search_str=${encodeURIComponent(cleanMac)}&searched_type=auto&method=JwtV2`;

  const response = await fetch(
    url,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Referer': 'https://iplocation.io/',
        'Origin': 'https://iplocation.io',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(15000),
    }
  );

  if (!response.ok) {
    throw new Error(`MAC address lookup failed with status ${response.status}`);
  }

  const data = (await response.json()) as any;

  if (data?.errors?.length) {
    throw new Error(data.errors[0] || 'Unknown MAC Address lookup error');
  }

  return {
    errors: data.errors || [],
    result: (data.result || []).map((item: any) => ({
      range_start: item.range_start || '',
      range_end: item.range_end || '',
      block: item.block || '',
      oui: item.oui || '',
      history: (item.history || []).map((h: any) => ({
        org_name: h.org_name || '',
        is_private: h.is_private === true || h.is_private === 'true',
        org_address: h.org_address || '',
        action_date: h.action_date || '',
        action_type: h.action_type || '',
        src: h.src || '',
        country: h.country || '',
      })),
    })),
    mode: data.mode || '',
    query: data.query || cleanMac,
    exec_time: Number(data.exec_time) || 0,
  };
}

export interface PasswordGeneratorOptions {
  length?: number;
  num?: number;
  lowercase?: boolean;
  uppercase?: boolean;
  digits?: boolean;
  basicsymbol?: boolean;
  moresymbol?: boolean;
  skipsimilar?: boolean;
  unique?: boolean;
  weighted?: boolean;
}

export interface PasswordGeneratorResult {
  passwords: string[];
  strength: 'WEAK' | 'GOOD' | 'STRONG' | 'VERY STRONG';
}

export function generatePassword(options: PasswordGeneratorOptions): PasswordGeneratorResult {
  const length = Math.max(4, Math.min(128, Number(options.length) || 16));
  const num = Math.max(1, Math.min(100, Number(options.num) || 1));
  const lowercase = options.lowercase !== false;
  const uppercase = options.uppercase !== false;
  const digits = options.digits !== false;
  const basicsymbol = options.basicsymbol !== false;
  const moresymbol = options.moresymbol === true;
  const skipsimilar = options.skipsimilar === true;
  const unique = options.unique === true;
  const weighted = options.weighted === true;

  let pool: number[][] = [];
  if (lowercase) {
    pool.push([97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122]);
  }
  if (uppercase) {
    pool.push([65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90]);
  }
  if (digits) {
    pool.push([48, 49, 50, 51, 52, 53, 54, 55, 56, 57]);
  }
  
  if (basicsymbol && moresymbol) {
    pool.push([33, 63, 35, 36, 38, 42, 64, 37, 40, 41, 43, 45, 61, 91, 93, 123, 125, 124, 126, 46, 44]);
  } else {
    if (basicsymbol) {
      pool.push([33, 63, 35, 36, 38, 42, 64]);
    }
    if (moresymbol) {
      pool.push([37, 40, 41, 43, 45, 61, 91, 93, 123, 125, 124, 126, 46, 44]);
    }
  }

  if (skipsimilar) {
    pool = pool.map(sub => sub.filter(val => val !== 48 && val !== 49 && val !== 73 && val !== 79 && val !== 108 && val !== 111));
  }

  const totalPoolSize = pool.reduce((acc, sub) => acc + sub.length, 0);
  if (totalPoolSize === 0) {
    throw new Error('You must select at least one character set.');
  }

  if (unique && length > totalPoolSize) {
    throw new Error(`Cannot make passwords of length ${length} using only ${totalPoolSize} unique characters.`);
  }

  let finalPool: any = pool;
  if (!weighted) {
    finalPool = pool.flat();
  }

  const passwords: string[] = [];
  for (let i = 0; i < num; i++) {
    const chars: string[] = [];
    let count = 0;
    while (count < length) {
      let charVal: number;
      if (weighted) {
        const charClass = Math.floor(Math.random() * finalPool.length);
        const classPool = finalPool[charClass];
        charVal = classPool[Math.floor(Math.random() * classPool.length)];
      } else {
        charVal = finalPool[Math.floor(Math.random() * finalPool.length)];
      }
      const charStr = String.fromCharCode(charVal);

      if (unique) {
        if (!chars.includes(charStr)) {
          chars.push(charStr);
          count++;
        }
      } else {
        chars.push(charStr);
        count++;
      }
    }
    passwords.push(chars.join(''));
  }

  let strength: 'WEAK' | 'GOOD' | 'STRONG' | 'VERY STRONG';
  if (length >= 6 && length <= 7) {
    strength = 'WEAK';
  } else if (length >= 8 && length <= 9) {
    strength = 'GOOD';
  } else if (length >= 10 && length <= 11) {
    strength = 'STRONG';
  } else {
    strength = 'VERY STRONG';
  }

  return {
    passwords,
    strength,
  };
}

export interface HashResult {
  str: string;
  md5: string;
  b64: string;
  sha1: string;
}

export async function md5Generator(str: string): Promise<HashResult> {
  const token = await getAuthToken();

  const response = await fetch(
    'https://api.iplocation.io/api/v1/md5-generator',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Referer': 'https://iplocation.io/',
        'Origin': 'https://iplocation.io',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: new URLSearchParams({
        str: str,
        method: 'JwtV2'
      }).toString(),
      signal: AbortSignal.timeout(15000),
    }
  );

  if (!response.ok) {
    throw new Error(`Hash generation failed with status ${response.status}`);
  }

  const data = (await response.json()) as any;

  if (data?.errors?.length) {
    throw new Error(data.errors[0] || 'Unknown Hash Generator error');
  }

  const result = data.result || {};
  return {
    str: result.str || str,
    md5: result.md5 || '',
    b64: result.b64 || '',
    sha1: result.sha1 || '',
  };
}

export interface HttpResponseHeaderCheckResult {
  errors: string[];
  result: Array<{
    _heading: string;
    _data: Record<string, string>;
  }>;
}

export async function checkHttpResponseHeaders(options: {
  serverHeaderCheckQuery: string;
  advOptions?: 'get' | 'head';
  acceptCompressedContent?: boolean | number;
  followRedirects?: boolean | number;
  authOptions?: 'none' | 'basic' | 'digest';
  username?: string;
  password?: string;
}): Promise<HttpResponseHeaderCheckResult> {
  const token = await getAuthToken();

  const advOptions = options.advOptions || 'get';
  const acceptCompressedContent = options.acceptCompressedContent === undefined ? 1 : (options.acceptCompressedContent ? 1 : 0);
  const followRedirects = options.followRedirects === undefined ? 1 : (options.followRedirects ? 1 : 0);
  const authOptions = options.authOptions || 'none';
  const username = options.username || '';
  const password = options.password || '';

  const response = await fetch(
    'https://api.iplocation.io/api/v1/check-http-response-headers',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Referer': 'https://iplocation.io/',
        'Origin': 'https://iplocation.io',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: new URLSearchParams({
        serverHeaderCheckQuery: options.serverHeaderCheckQuery,
        advOptions,
        acceptCompressedContent: String(acceptCompressedContent),
        followRedirects: String(followRedirects),
        authOptions,
        username,
        password,
        method: 'JwtV2'
      }).toString(),
      signal: AbortSignal.timeout(20000),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP Response Headers check failed with status ${response.status}`);
  }

  const data = (await response.json()) as any;

  if (data?.errors?.length) {
    throw new Error(data.errors[0] || 'Unknown HTTP Response Headers check error');
  }

  return {
    errors: data.errors || [],
    result: (data.result || []).map((item: any) => ({
      _heading: item._heading || '',
      _data: item._data || {},
    })),
  };
}

export interface WebsiteHostingProviderResult {
  ip: string;
  ip_type: number;
  hosting_provider: {
    title: string;
    url: string;
    service_type: string;
    country_code: string;
    country_name: string;
    state_name: string;
    city_name: string;
    organization: string;
    zip_code: string;
    domain_name: string;
    isp: string;
  };
}

export async function checkWebsiteHostingProvider(host: string, service: string = 'ip2location'): Promise<WebsiteHostingProviderResult> {
  const token = await getAuthToken();

  const cleanHost = host.replace(/^https?:\/\//i, '').replace(/\/+$/, '');

  const response = await fetch(
    'https://api.iplocation.io/api/v1/check-website-hosting-provider',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Referer': 'https://iplocation.io/',
        'Origin': 'https://iplocation.io',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: new URLSearchParams({
        host: cleanHost,
        service: service,
        method: 'JwtV2'
      }).toString(),
      signal: AbortSignal.timeout(15000),
    }
  );

  if (!response.ok) {
    throw new Error(`Website Hosting Provider check failed with status ${response.status}`);
  }

  const data = (await response.json()) as any;

  if (data?.errors?.length) {
    throw new Error(data.errors[0] || 'Unknown Website Hosting Provider check error');
  }

  const result = data.result || {};
  const svcData = result.ip2location || {};
  const all = svcData.all || {};

  return {
    ip: result.ip || '',
    ip_type: result.ip_type || 4,
    hosting_provider: {
      title: svcData.title || 'IP2Location',
      url: svcData.url || '',
      service_type: svcData.service_type || '',
      country_code: svcData.country_code || '',
      country_name: svcData.country_name || '',
      state_name: svcData.state_name || '',
      city_name: svcData.city_name || '',
      organization: svcData.organization || '',
      zip_code: all.zipCode || svcData.postal_code || '',
      domain_name: all.domainName || '',
      isp: all.isp || svcData.organization || '',
    }
  };
}
















