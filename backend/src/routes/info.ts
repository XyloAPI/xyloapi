import { Router } from 'express';
import { executePipeline } from '../utils/pipeline';

const router = Router();

router.all('/:slug', async (req, res) => {
  const { slug } = req.params;
  const payload = {
    ...req.query,
    ...req.body
  };

  try {
    const reqHost = req.headers.host || 'localhost:5000';
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';

    let result;
    if (slug === 'ip' || slug === 'iplookup') {
      const { lookupIP } = require('../utils/ipLookup');
      const ipParam = payload.ip || payload.q || payload.domain || req.ip;
      if (!ipParam) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "IP address or domain is required."
        });
      }
      try {
        const data = await lookupIP(ipParam);
        result = {
          success: true,
          data
        };
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: err.message || "Failed to lookup IP information"
        });
      }
    } else if (slug === 'myip' || slug === 'my-ip') {
      const { lookupIP } = require('../utils/ipLookup');

      // Read real client IP: CF-Connecting-IP → X-Forwarded-For (first hop) → req.ip
      const rawIp =
        (req.headers['cf-connecting-ip'] as string) ||
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        req.ip ||
        '';

      // Strip IPv4-mapped IPv6 prefix (e.g. ::ffff:192.168.1.1 → 192.168.1.1)
      let cleanIp = rawIp.replace(/^::ffff:/, '').trim();

      // Detect loopback / private ranges — fall back to server's public IP
      const isLoopbackOrPrivate = (ip: string) =>
        ip === '::1' ||
        ip === 'localhost' ||
        /^127\./.test(ip) ||
        /^10\./.test(ip) ||
        /^192\.168\./.test(ip) ||
        /^172\.(1[6-9]|2\d|3[01])\./.test(ip);

      if (!cleanIp || isLoopbackOrPrivate(cleanIp)) {
        try {
          // Fetch the server's own public IP as a proxy for local dev
          const pubRes = await fetch('https://api.ipify.org?format=json', {
            signal: AbortSignal.timeout(5000),
          });
          if (pubRes.ok) {
            const pubData = (await pubRes.json()) as any;
            if (pubData?.ip) cleanIp = pubData.ip;
          }
        } catch {
          // If ipify fails too, return a helpful error
          return res.status(400).json({
            success: false,
            creator: "XyloAPI",
            error: "Could not determine public IP. Are you testing locally?"
          });
        }
      }

      if (!cleanIp) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Could not determine client IP."
        });
      }

      try {
        const data = await lookupIP(cleanIp);
        result = {
          success: true,
          data
        };
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: err.message || "Failed to lookup IP information"
        });
      }
    } else if (slug === 'webserver' || slug === 'web-server' || slug === 'check-http-response-headers' || slug === 'http-headers') {
      const { checkHttpResponseHeaders } = require('../utils/ipLookup');
      const host = payload.host || payload.url || payload.serverHeaderCheckQuery || payload.q || payload.domain;
      if (!host) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Parameter 'host' is required (e.g. google.com)."
        });
      }
      const advOptions = payload.advOptions || 'get';
      const acceptCompressedContent = payload.acceptCompressedContent === undefined ? true : (payload.acceptCompressedContent === 'true' || payload.acceptCompressedContent === true || payload.acceptCompressedContent === 1 || payload.acceptCompressedContent === '1');
      const followRedirects = payload.followRedirects === undefined ? true : (payload.followRedirects === 'true' || payload.followRedirects === true || payload.followRedirects === 1 || payload.followRedirects === '1');
      const authOptions = payload.authOptions || 'none';
      const username = payload.username || '';
      const password = payload.password || '';

      try {
        const data = await checkHttpResponseHeaders({
          serverHeaderCheckQuery: host,
          advOptions,
          acceptCompressedContent,
          followRedirects,
          authOptions,
          username,
          password
        });
        result = {
          success: true,
          data
        };
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: err.message || "Failed to check HTTP headers / web server"
        });
      }
    } else if (slug === 'hosting-provider' || slug === 'check-website-hosting-provider' || slug === 'hosting') {
      const { checkWebsiteHostingProvider } = require('../utils/ipLookup');
      const host = payload.host || payload.url || payload.domain || payload.q;
      if (!host) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Parameter 'host' (domain or URL) is required."
        });
      }
      const service = payload.service || 'ip2location';
      try {
        const data = await checkWebsiteHostingProvider(host, service);
        result = {
          success: true,
          data
        };
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: err.message || "Failed to check website hosting provider"
        });
      }
    } else if (slug === 'url-parser' || slug === 'urlparser') {
      const urlStr = payload.url || payload.q;
      if (!urlStr) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Parameter 'url' is required."
        });
      }

      try {
        let normalizedUrl = urlStr.trim();
        if (!/^https?:\/\//i.test(normalizedUrl)) {
          normalizedUrl = 'http://' + normalizedUrl;
        }
        
        const parsed = new URL(normalizedUrl);
        
        const queryParams: Record<string, string> = {};
        parsed.searchParams.forEach((val, key) => {
          queryParams[key] = val;
        });

        const pathSegments = parsed.pathname.split('/').filter(Boolean);

        const hostname = parsed.hostname;
        const hostParts = hostname.split('.');
        let domain = '';
        let subdomain = '';
        let tld = '';

        if (hostParts.length > 1) {
          const lastPart = hostParts[hostParts.length - 1];
          const secondLastPart = hostParts[hostParts.length - 2];
          
          const isTwoPartTld = ['com', 'co', 'org', 'net', 'gov', 'edu', 'ac', 'sch', 'web', 'mil'].includes(secondLastPart) && lastPart.length === 2;
          
          if (isTwoPartTld && hostParts.length >= 3) {
            tld = `.${secondLastPart}.${lastPart}`;
            domain = `${hostParts[hostParts.length - 3]}.${secondLastPart}.${lastPart}`;
            subdomain = hostParts.slice(0, hostParts.length - 3).join('.');
          } else {
            tld = `.${lastPart}`;
            domain = `${secondLastPart}.${lastPart}`;
            subdomain = hostParts.slice(0, hostParts.length - 2).join('.');
          }
        } else {
          domain = hostname;
        }

        result = {
          success: true,
          data: {
            href: parsed.href,
            protocol: parsed.protocol,
            username: parsed.username || undefined,
            password: parsed.password || undefined,
            host: parsed.host,
            hostname: parsed.hostname,
            port: parsed.port || (parsed.protocol === 'https:' ? '443' : '80'),
            pathname: parsed.pathname,
            search: parsed.search || undefined,
            hash: parsed.hash || undefined,
            query: Object.keys(queryParams).length > 0 ? queryParams : undefined,
            path_segments: pathSegments.length > 0 ? pathSegments : undefined,
            subdomain: subdomain || undefined,
            domain: domain,
            tld: tld || undefined
          }
        };
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Invalid URL provided."
        });
      }
    } else if (slug === 'ping') {
      const { pingDomain } = require('../utils/ipLookup');
      const domain = payload.domain || payload.host || payload.url || payload.q;
      if (!domain) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Parameter 'domain' is required."
        });
      }
      try {
        const data = await pingDomain(domain);
        result = { success: true, data };
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: err.message || "Failed to ping domain"
        });
      }
    } else if (slug === 'mx-lookup' || slug === 'mxlookup') {
      const { mxLookup } = require('../utils/ipLookup');
      const host = payload.host || payload.domain || payload.q;
      if (!host) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Parameter 'host' (domain) is required."
        });
      }
      try {
        const data = await mxLookup(host);
        result = { success: true, data };
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: err.message || "Failed to perform MX lookup"
        });
      }
    } else if (slug === 'ns-lookup' || slug === 'nslookup') {
      const { nsLookup } = require('../utils/ipLookup');
      const host = payload.host || payload.domain || payload.q;
      if (!host) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Parameter 'host' (domain) is required."
        });
      }
      try {
        const data = await nsLookup(host);
        result = { success: true, data };
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: err.message || "Failed to perform NS lookup"
        });
      }
    } else if (slug === 'dns-validation' || slug === 'dns-record-validation') {
      const { dnsValidation } = require('../utils/ipLookup');
      const host = payload.host || payload.domain || payload.q;
      if (!host) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Parameter 'host' (domain) is required."
        });
      }
      try {
        const data = await dnsValidation(host);
        result = { success: true, data };
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: err.message || "Failed to perform DNS validation"
        });
      }
    } else if (slug === 'dns-records' || slug === 'dns' || slug === 'all-dns-records') {
      const { dnsLookupAll } = require('../utils/ipLookup');
      const host = payload.host || payload.domain || payload.q;
      const type = payload.type || payload.t || 'COMMON';
      if (!host) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Parameter 'host' (domain) is required."
        });
      }
      try {
        const data = await dnsLookupAll(host, type);
        result = { success: true, data };
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: err.message || "Failed to perform DNS records lookup"
        });
      }
    } else if (slug === 'dmarc-validation' || slug === 'dmarc' || slug === 'dmarc-record-validation') {
      const { dmarcValidation } = require('../utils/ipLookup');
      const host = payload.host || payload.domain || payload.q;
      if (!host) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Parameter 'host' (domain) is required."
        });
      }
      try {
        const data = await dmarcValidation(host);
        result = { success: true, data };
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: err.message || "Failed to perform DMARC validation"
        });
      }
    } else if (slug === 'ip-blacklist' || slug === 'blacklist-check' || slug === 'dnsbl') {
      const { ipBlacklistCheck } = require('../utils/ipLookup');
      const ipOrHost = payload.ip || payload.host || payload.domain || payload.q;
      if (!ipOrHost) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Parameter 'ip' or 'host' is required."
        });
      }
      try {
        const data = await ipBlacklistCheck(ipOrHost);
        result = { success: true, data };
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: err.message || "Failed to perform IP blacklist check"
        });
      }
    } else if (slug === 'verify-email' || slug === 'email-verify' || slug === 'verify-email-address') {
      const { verifyEmail } = require('../utils/ipLookup');
      const email = payload.email || payload.q;
      if (!email) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Parameter 'email' is required."
        });
      }
      try {
        const data = await verifyEmail(email);
        result = { success: true, data };
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: err.message || "Failed to verify email address"
        });
      }
    } else if (slug === 'ipv4-to-ipv6' || slug === 'ipv4-to-v6') {
      const { ipv4ToIpv6 } = require('../utils/ipLookup');
      const ip = payload.ip || payload.q;
      if (!ip) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Parameter 'ip' is required."
        });
      }
      try {
        const data = await ipv4ToIpv6(ip);
        result = { success: true, data };
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: err.message || "Failed to convert IPv4 to IPv6"
        });
      }
    } else if (slug === 'ip-to-decimal' || slug === 'ip-to-long' || slug === 'iptodecimal') {
      const { ipToDecimal } = require('../utils/ipLookup');
      const ip = payload.ip || payload.q;
      if (!ip) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Parameter 'ip' is required."
        });
      }
      try {
        const data = await ipToDecimal(ip);
        result = { success: true, data };
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: err.message || "Failed to convert IP to decimal"
        });
      }
    } else if (slug === 'ipv6-compatibility' || slug === 'ipv6-compatible' || slug === 'ipv6-compatibility-checker') {
      const { checkIpv6Compatibility } = require('../utils/ipLookup');
      const host = payload.host || payload.domain || payload.q;
      if (!host) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Parameter 'host' is required."
        });
      }
      try {
        const data = await checkIpv6Compatibility(host);
        result = { success: true, data };
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: err.message || "Failed to check IPv6 compatibility"
        });
      }
    } else if (slug === 'ipv6-generator' || slug === 'ipv6-address-generator' || slug === 'generate-ipv6') {
      const { generateIpv6Address } = require('../utils/ipLookup');
      const globalId = payload.global_id || payload.globalId;
      const subnetId = payload.subnet_id || payload.subnetId;
      try {
        const data = await generateIpv6Address(globalId, subnetId);
        result = { success: true, data };
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: err.message || "Failed to generate IPv6 address"
        });
      }
    } else if (slug === 'ipv6-cidr-to-range' || slug === 'ipv6-cidr' || slug === 'cidr-to-range') {
      const { ipv6CidrToRange } = require('../utils/ipLookup');
      const cidr = payload.value || payload.cidr || payload.q;
      if (!cidr) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Parameter 'cidr' or 'value' is required."
        });
      }
      try {
        const data = await ipv6CidrToRange(cidr);
        result = { success: true, data };
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: err.message || "Failed to convert IPv6 CIDR to Range"
        });
      }
    } else if (slug === 'ipv6-range-to-cidr' || slug === 'range-to-cidr') {
      const { ipv6RangeToCidr } = require('../utils/ipLookup');
      const range = payload.value || payload.range || payload.q;
      if (!range) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Parameter 'range' or 'value' is required."
        });
      }
      try {
        const data = await ipv6RangeToCidr(range);
        result = { success: true, data };
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: err.message || "Failed to convert IPv6 Range to CIDR"
        });
      }
    } else if (slug === 'subnet-calculator' || slug === 'subnet') {
      const { calculateSubnet } = require('../utils/ipLookup');
      const ipParam = payload.ip || payload.ipWithCidr || payload.q;
      if (!ipParam) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Parameter 'ip' is required (e.g. 39.42.164.235/24)."
        });
      }
      const fullIp = ipParam.includes('/') ? ipParam : `${ipParam}/24`;
      try {
        const data = await calculateSubnet(fullIp);
        result = { success: true, data };
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: err.message || "Failed to calculate subnet"
        });
      }
    } else if (slug === 'ip-whois' || slug === 'ip-whois-lookup' || slug === 'whois-ip') {
      const { ipWhoisLookup } = require('../utils/ipLookup');
      const ip = payload.ip || payload.query || payload.q;
      if (!ip) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Parameter 'ip' or 'query' is required."
        });
      }
      try {
        const data = await ipWhoisLookup(ip);
        result = { success: true, data };
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: err.message || "Failed to lookup IP Whois"
        });
      }
    } else if (slug === 'mac-lookup' || slug === 'mac-address-lookup' || slug === 'mac-address') {
      const { macAddressLookup } = require('../utils/ipLookup');
      const mac = payload.mac || payload.macAddress || payload.search_str || payload.q;
      if (!mac) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Parameter 'mac' is required (e.g. 40-A8-F0-4F-50-9E)."
        });
      }
      try {
        const data = await macAddressLookup(mac);
        result = { success: true, data };
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: err.message || "Failed to lookup MAC Address"
        });
      }
    } else if (slug === 'password-generator' || slug === 'generate-password') {
      const { generatePassword } = require('../utils/ipLookup');
      const length = Number(payload.length) || 16;
      const num = Number(payload.num) || 1;
      const lowercase = payload.lowercase === undefined ? true : (payload.lowercase === 'true' || payload.lowercase === true || payload.lowercase === 1 || payload.lowercase === '1');
      const uppercase = payload.uppercase === undefined ? true : (payload.uppercase === 'true' || payload.uppercase === true || payload.uppercase === 1 || payload.uppercase === '1');
      const digits = payload.digits === undefined ? true : (payload.digits === 'true' || payload.digits === true || payload.digits === 1 || payload.digits === '1');
      const basicsymbol = payload.basicsymbol === undefined ? true : (payload.basicsymbol === 'true' || payload.basicsymbol === true || payload.basicsymbol === 1 || payload.basicsymbol === '1');
      const moresymbol = payload.moresymbol === 'true' || payload.moresymbol === true || payload.moresymbol === 1 || payload.moresymbol === '1';
      const skipsimilar = payload.skipsimilar === 'true' || payload.skipsimilar === true || payload.skipsimilar === 1 || payload.skipsimilar === '1';
      const unique = payload.unique === 'true' || payload.unique === true || payload.unique === 1 || payload.unique === '1';
      const weighted = payload.weighted === 'true' || payload.weighted === true || payload.weighted === 1 || payload.weighted === '1';

      try {
        const data = generatePassword({
          length,
          num,
          lowercase,
          uppercase,
          digits,
          basicsymbol,
          moresymbol,
          skipsimilar,
          unique,
          weighted,
        });
        result = { success: true, data };
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: err.message || "Failed to generate password"
        });
      }
    } else if (slug === 'md5-generator' || slug === 'hash-generator' || slug === 'md5-hash') {
      const { md5Generator } = require('../utils/ipLookup');
      const text = payload.str || payload.text || payload.q;
      if (!text) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: "Parameter 'str' is required (e.g. test)."
        });
      }
      try {
        const data = await md5Generator(text);
        result = { success: true, data };
      } catch (err: any) {
        return res.status(400).json({
          success: false,
          creator: "XyloAPI",
          error: err.message || "Failed to generate MD5/SHA1 hash"
        });
      }
    } else {
      result = await executePipeline(slug, payload, reqHost, protocol);
    }

    if (result && result.success === false) {
      return res.status(400).json({
        success: false,
        creator: "XyloAPI",
        error: "Failed to process request"
      });
    }

    if (result && result.data !== undefined) {
      return res.json({
        success: true,
        creator: "XyloAPI",
        data: result.data
      });
    }

    return res.json({
      success: true,
      creator: "XyloAPI",
      data: result
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      creator: "XyloAPI",
      error: "Failed to process request"
    });
  }
});

export default router;
