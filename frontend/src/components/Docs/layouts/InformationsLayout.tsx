import type { DocTopic } from '../types';

interface InformationsLayoutProps {
  activeTopic: DocTopic;
  resData: any;
}

export default function InformationsLayout({ activeTopic, resData }: InformationsLayoutProps) {
  const renderWeather = () => {
    const current = resData.current || {};
    const forecast = resData.forecast || [];

    return (
      <div className="response-layout">
        {/* Current weather card */}
        <div className="response-card" style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.005) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <span className="response-label" style={{ color: 'var(--gold-text)' }}>
              CURRENT WEATHER IN {resData.location?.toUpperCase()}
            </span>
            <h3 className="response-title" style={{ fontSize: '28px', margin: '4px 0 0 0' }}>
              {current.weather}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--ash)' }}>
              Observation Time: {current.observation_time}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '48px', fontWeight: 800, color: 'var(--white)' }}>
              {current.temperature}°C
            </span>
            <span className="response-value-mono" style={{ color: 'var(--ash)', fontSize: '14px' }}>
              (Feels: {current.feels_like}°C)
            </span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="response-grid-auto">
          <div className="response-subcard">
            <span className="response-label">HUMIDITY</span>
            <span className="response-value-mono" style={{ fontSize: '14px', fontWeight: 700 }}>{current.humidity}%</span>
          </div>
          <div className="response-subcard">
            <span className="response-label">WIND SPEED</span>
            <span className="response-value-mono" style={{ fontSize: '14px', fontWeight: 700 }}>{current.wind_speed_kmh} km/h</span>
          </div>
          <div className="response-subcard">
            <span className="response-label">PRESSURE</span>
            <span className="response-value-mono" style={{ fontSize: '14px', fontWeight: 700 }}>{current.pressure_mb} mb</span>
          </div>
          <div className="response-subcard">
            <span className="response-label">UV INDEX</span>
            <span className="response-value-mono" style={{ fontSize: '14px', fontWeight: 700 }}>{current.uv_index}</span>
          </div>
          <div className="response-subcard">
            <span className="response-label">VISIBILITY</span>
            <span className="response-value-mono" style={{ fontSize: '14px', fontWeight: 700 }}>{current.visibility_km} km</span>
          </div>
        </div>

        {/* Forecast days */}
        <div className="response-list">
          <h4 className="response-label" style={{ fontSize: '11px', color: 'var(--white)', paddingBottom: '6px', borderBottom: '1px solid var(--border-color)' }}>
            3-DAY FORECAST
          </h4>
          <div className="response-list" style={{ gap: '10px' }}>
            {forecast.map((day: any, idx: number) => (
              <div key={idx} className="response-subcard">
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', paddingBottom: '8px', marginBottom: '8px' }}>
                  <strong className="response-value-mono" style={{ color: 'var(--gold-text)' }}>{day.date}</strong>
                  <span className="response-value-mono" style={{ fontSize: '12px' }}>
                    Min: {day.min_temp}°C / Max: {day.max_temp}°C
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {day.hourly?.slice(2, 6).map((hour: any, hIdx: number) => (
                    <div
                      key={hIdx}
                      className="response-subcard"
                      style={{
                        flex: '1 0 100px',
                        textAlign: 'center',
                        padding: '8px',
                        backgroundColor: 'rgba(255,255,255,0.02)'
                      }}
                    >
                      <span className="response-label" style={{ fontSize: '9px', marginBottom: '4px' }}>
                        {parseInt(hour.time) / 100}:00
                      </span>
                      <strong className="response-value-mono" style={{ display: 'block', fontSize: '13px', margin: '4px 0' }}>
                        {hour.temp}°C
                      </strong>
                      <span className="response-value" style={{ display: 'block', fontSize: '10px', color: 'var(--ash)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {hour.weather}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderKodepos = () => {
    const list = resData.kodepos || [];
    return (
      <div className="response-list" style={{ gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="response-label" style={{ color: 'var(--ash)' }}>
            MATCHED POSTAL CODES: {resData.total_grouped} CODES ({resData.total} AREAS)
          </span>
        </div>
        
        <div className="response-scroll-container" style={{ maxHeight: '420px' }}>
          {list.map((item: any, idx: number) => (
            <div key={idx} className="response-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '8px' }}>
                <span className="response-value-mono" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--gold-text)' }}>
                  {item.code}
                </span>
                <span className="response-label" style={{ fontSize: '11px', marginBottom: 0 }}>
                  {item.province} • {item.regency}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {item.areas.map((area: any, aIdx: number) => (
                  <div
                    key={aIdx}
                    className="response-subcard"
                    style={{
                      padding: '4px 8px',
                      fontSize: '11px',
                      color: 'var(--white)'
                    }}
                  >
                    Kec. {area.district}, Kel. {area.village}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderJadwalTV = () => {
    const schedule = resData.schedule || [];
    return (
      <div className="response-list" style={{ gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="response-label" style={{ color: 'var(--ash)' }}>
            CHANNEL: {resData.channel} ({resData.total} PROGRAMS TODAY)
          </span>
        </div>

        <div className="response-scroll-container" style={{ maxHeight: '450px', border: '1px solid var(--border-color)', gap: '0' }}>
          {schedule.map((prog: any, idx: number) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                borderBottom: idx < schedule.length - 1 ? '1px solid var(--border-color)' : 'none',
                backgroundColor: idx % 2 === 0 ? 'rgba(255,255,255,0.005)' : 'rgba(255,255,255,0.015)',
                padding: '12px 16px',
                alignItems: 'center'
              }}
            >
              <div className="response-value-mono" style={{
                width: '70px',
                fontWeight: 700,
                color: 'var(--gold-text)',
                flexShrink: 0
              }}>
                {prog.time}
              </div>
              <div className="response-value" style={{ fontSize: '13px', fontWeight: 600 }}>
                {prog.program}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderJadwalBola = () => {
    const competitions = resData.competitions || [];
    return (
      <div className="response-list" style={{ gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="response-label" style={{ color: 'var(--ash)' }}>
            TOTAL MATCHES: {resData.total_matches} ACROSS {resData.total_competitions} LEAGUES
          </span>
        </div>

        <div className="response-scroll-container" style={{ maxHeight: '480px' }}>
          {competitions.map((comp: any, idx: number) => (
            <div key={idx} className="response-list" style={{ gap: '8px' }}>
              <div className="response-subcard" style={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                padding: '8px 12px',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--gold-text)',
                textTransform: 'uppercase'
              }}>
                {comp.competition} {comp.date && `• ${comp.date}`}
              </div>

              <div className="response-list" style={{ gap: '6px' }}>
                {comp.matches.map((match: any, mIdx: number) => (
                  <div
                    key={mIdx}
                    className="response-card"
                    style={{
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    {/* Teams side */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1 0 200px' }}>
                      {/* Home team */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {match.home_team.crest && (
                          <img
                            src={match.home_team.crest}
                            alt="Crest"
                            style={{ width: '18px', height: '18px', objectFit: 'contain' }}
                          />
                        )}
                        <span className="response-value" style={{ fontSize: '13px', fontWeight: 600 }}>
                          {match.home_team.name}
                        </span>
                        {match.home_team.score !== null && (
                          <span className="response-value-mono" style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--gold-text)' }}>
                            {match.home_team.score}
                          </span>
                        )}
                      </div>
                      {/* Away team */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {match.away_team.crest && (
                          <img
                            src={match.away_team.crest}
                            alt="Crest"
                            style={{ width: '18px', height: '18px', objectFit: 'contain' }}
                          />
                        )}
                        <span className="response-value" style={{ fontSize: '13px', fontWeight: 600 }}>
                          {match.away_team.name}
                        </span>
                        {match.away_team.score !== null && (
                          <span className="response-value-mono" style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--gold-text)' }}>
                            {match.away_team.score}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status side */}
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span className="response-value-mono" style={{
                        fontSize: '9px',
                        padding: '2px 6px',
                        backgroundColor: match.status?.toLowerCase().includes('live') || match.status?.includes("'") ? 'rgba(255, 77, 77, 0.15)' : 'rgba(255,255,255,0.05)',
                        color: match.status?.toLowerCase().includes('live') || match.status?.includes("'") ? '#ff4d4d' : 'var(--ash)'
                      }}>
                        {match.status}
                      </span>
                      <span className="response-value-mono" style={{ fontSize: '11px' }}>
                        {match.kickoff_time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderIpLookup = () => {
    const { ip, country, country_code, region, city, latitude, longitude, isp, org, asn, services } = resData;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>IP ADDRESS</span>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>{ip}</div>
          </div>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>LOCATION</span>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--white)' }}>
              {[city, region, country].filter(v => v && v !== 'N/A').join(', ') || 'N/A'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ash)', marginTop: '4px' }}>ISO: {country_code || 'N/A'}</div>
          </div>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>COORDINATES</span>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>
              {latitude != null && longitude != null ? `${latitude}, ${longitude}` : 'N/A'}
            </div>
            {latitude != null && longitude != null && (
              <a
                href={`https://maps.google.com/?q=${latitude},${longitude}`}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '11px', color: 'var(--gold-text)', textDecoration: 'none', display: 'inline-block', marginTop: '6px', fontWeight: 700 }}
              >
                VIEW ON MAP
              </a>
            )}
          </div>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>NETWORK PROVIDER</span>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--white)' }}>{isp || org || 'N/A'}</div>
            <div style={{ fontSize: '11px', color: 'var(--ash)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>ASN: {asn || 'N/A'}</div>
          </div>
        </div>

        {/* Provider breakdown */}
        {services && Object.keys(services).length > 0 && (
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', display: 'block', marginBottom: '14px' }}>
              DATA SOURCES ANALYSIS
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              {Object.entries(services).map(([key, value]: [string, any]) => {
                if (!value) return null;
                const dbName = key === 'ip2location' ? 'IP2Location' : key === 'ipinfo' ? 'IP Info' : key === 'dbip' ? 'DB IP' : key === 'criminalip' ? 'Criminal IP' : key;
                return (
                  <div key={key} style={{ padding: '12px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '4px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--gold-text)', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #1a1a1a', paddingBottom: '6px', marginBottom: '10px' }}>
                      {dbName}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--ash)' }}>Country</span>
                        <span style={{ color: 'var(--white)', fontWeight: 600 }}>{value.country_name || 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--ash)' }}>City</span>
                        <span style={{ color: 'var(--white)', fontWeight: 600 }}>{value.city_name || 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--ash)' }}>Lat / Lon</span>
                        <span style={{ color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>{value.latitude || '—'} / {value.longitude || '—'}</span>
                      </div>
                      {key === 'criminalip' ? (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--ash)' }}>VPN</span>
                            <span style={{ color: value.all?.issues?.is_vpn ? '#ff6b6b' : '#4caf50', fontWeight: 700 }}>
                              {value.all?.issues?.is_vpn ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--ash)' }}>Hosting</span>
                            <span style={{ color: 'var(--white)', fontWeight: 600 }}>
                              {value.all?.issues?.is_hosting || value.all?.issues?.is_cloud ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--ash)' }}>Threat</span>
                            <span style={{ color: 'var(--white)', fontWeight: 600 }}>{value.all?.score?.inbound || 'N/A'}</span>
                          </div>
                        </>
                      ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--ash)' }}>Organization</span>
                          <span style={{ color: 'var(--white)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '130px' }} title={value.organization}>
                            {value.organization || 'N/A'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="response-layout">
      <div className="response-header">
        <h2 className="response-title">
          {activeTopic.title} Results
        </h2>
      </div>

      {activeTopic.id === 'weather' && renderWeather()}
      {activeTopic.id === 'kodepos' && renderKodepos()}
      {activeTopic.id === 'jadwal-tv' && renderJadwalTV()}
      {activeTopic.id === 'jadwal-bola' && renderJadwalBola()}
      {(activeTopic.id === 'iplookup' || activeTopic.id === 'ip') && renderIpLookup()}
      {(activeTopic.id === 'myip' || activeTopic.id === 'my-ip') && renderIpLookup()}
      {(activeTopic.id === 'webserver' || activeTopic.id === 'web-server') && renderWebServer()}
      {activeTopic.id === 'ping' && renderPing()}
      {(activeTopic.id === 'mx-lookup' || activeTopic.id === 'mxlookup') && renderMxLookup()}
      {(activeTopic.id === 'ns-lookup' || activeTopic.id === 'nslookup') && renderNsLookup()}
      {(activeTopic.id === 'dns-validation' || activeTopic.id === 'dns-record-validation') && renderDnsValidation()}
      {(activeTopic.id === 'dns-records' || activeTopic.id === 'dns' || activeTopic.id === 'all-dns-records') && renderDnsRecords()}
      {(activeTopic.id === 'dmarc-validation' || activeTopic.id === 'dmarc' || activeTopic.id === 'dmarc-record-validation') && renderDmarcValidation()}
      {(activeTopic.id === 'ip-blacklist' || activeTopic.id === 'blacklist-check' || activeTopic.id === 'dnsbl') && renderIpBlacklist()}
      {(activeTopic.id === 'verify-email' || activeTopic.id === 'email-verify' || activeTopic.id === 'verify-email-address') && renderVerifyEmail()}
      {(activeTopic.id === 'ipv4-to-ipv6' || activeTopic.id === 'ipv4-to-v6') && renderIpv4ToIpv6()}
      {(activeTopic.id === 'ip-to-decimal' || activeTopic.id === 'ip-to-long' || activeTopic.id === 'iptodecimal') && renderIpToDecimal()}
      {(activeTopic.id === 'ipv6-compatibility' || activeTopic.id === 'ipv6-compatible' || activeTopic.id === 'ipv6-compatibility-checker') && renderIpv6Compatibility()}
      {(activeTopic.id === 'ipv6-generator' || activeTopic.id === 'ipv6-address-generator' || activeTopic.id === 'generate-ipv6') && renderIpv6Generator()}
      {(activeTopic.id === 'ipv6-cidr' || activeTopic.id === 'ipv6-cidr-to-range' || activeTopic.id === 'cidr-to-range') && renderIpv6Cidr()}
      {(activeTopic.id === 'ipv6-range' || activeTopic.id === 'ipv6-range-to-cidr' || activeTopic.id === 'range-to-cidr') && renderIpv6Range()}
      {(activeTopic.id === 'subnet' || activeTopic.id === 'subnet-calculator') && renderSubnet()}
      {(activeTopic.id === 'ip-whois' || activeTopic.id === 'ip-whois-lookup' || activeTopic.id === 'whois-ip') && renderIpWhois()}
      {(activeTopic.id === 'mac-lookup' || activeTopic.id === 'mac-address-lookup' || activeTopic.id === 'mac-address') && renderMacLookup()}
      {(activeTopic.id === 'password-generator' || activeTopic.id === 'generate-password') && renderPasswordGenerator()}
      {(activeTopic.id === 'md5-generator' || activeTopic.id === 'hash-generator' || activeTopic.id === 'md5-hash') && renderMd5Generator()}
      {(activeTopic.id === 'webserver' || activeTopic.id === 'check-http-response-headers' || activeTopic.id === 'http-headers') && renderWebServer()}
      {(activeTopic.id === 'hosting-provider' || activeTopic.id === 'check-website-hosting-provider' || activeTopic.id === 'hosting') && renderHostingProvider()}
      {(activeTopic.id === 'url-parser' || activeTopic.id === 'urlparser' || activeTopic.id === 'url-analyzer') && renderUrlParser()}
    </div>
  );

  function renderUrlParser() {
    const {
      href,
      protocol,
      username,
      password,
      port,
      pathname,
      hash,
      query,
      path_segments,
      subdomain,
      domain,
      tld
    } = resData || {};

    const items = [
      { label: 'PROTOCOL / SCHEME', val: protocol },
      { label: 'DOMAIN (SLD)', val: domain },
      { label: 'SUBDOMAIN', val: subdomain },
      { label: 'TOP-LEVEL DOMAIN (TLD)', val: tld },
      { label: 'PORT', val: port },
      { label: 'USERNAME', val: username },
      { label: 'PASSWORD', val: password }
    ].filter(item => item.val);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="response-header" style={{ marginBottom: '0' }}>
          <h2 className="response-title">
            URL Component Analyzer
          </h2>
        </div>

        <div style={{
          border: '1px solid var(--border-color)',
          backgroundColor: '#111',
          padding: '20px',
          borderRadius: '4px'
        }}>
          <span style={{
            fontSize: '10px',
            fontWeight: 800,
            color: 'var(--ash)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'block',
            marginBottom: '8px'
          }}>
            FULL EVALUATED URL
          </span>
          <span style={{
            fontSize: '15px',
            fontWeight: 700,
            color: 'var(--gold-text)',
            fontFamily: 'var(--font-mono)',
            wordBreak: 'break-all'
          }}>
            {href || 'N/A'}
          </span>
        </div>

        <div className="response-grid-3">
          {items.map((item, idx) => (
            <div key={idx} className="response-subcard" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '80px' }}>
              <span className="response-label">{item.label}</span>
              <span className="response-value" style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', wordBreak: 'break-all' }}>{item.val}</span>
            </div>
          ))}
        </div>

        <div style={{
          border: '1px solid var(--border-color)',
          backgroundColor: '#111',
          padding: '20px',
          borderRadius: '4px'
        }}>
          <span style={{
            fontSize: '10px',
            fontWeight: 800,
            color: 'var(--ash)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'block',
            marginBottom: '12px'
          }}>
            PATHWAY SEGMENTS ({pathname || '/'})
          </span>
          {path_segments && path_segments.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              <span style={{ color: 'var(--ash)' }}>root</span>
              {path_segments.map((segment: string, sIdx: number) => (
                <span key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--border-color)' }}>➔</span>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--white)'
                  }}>
                    {segment}
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <span style={{ fontSize: '12px', color: 'var(--ash)' }}>No sub-pathway segments (Root Only)</span>
          )}
        </div>

        <div style={{
          border: '1px solid var(--border-color)',
          backgroundColor: '#111',
          padding: '20px',
          borderRadius: '4px'
        }}>
          <span style={{
            fontSize: '10px',
            fontWeight: 800,
            color: 'var(--ash)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'block',
            marginBottom: '12px'
          }}>
            QUERY PARAMETERS (GET PAYLOAD)
          </span>
          {query ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '8px', color: 'var(--ash)' }}>KEY</th>
                    <th style={{ padding: '8px', color: 'var(--ash)' }}>VALUE</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(query).map(([k, v]: [string, any], qIdx) => (
                    <tr key={qIdx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                      <td style={{ padding: '8px', color: 'var(--cyan-pulse)', fontWeight: 700 }}>{k}</td>
                      <td style={{ padding: '8px', color: 'var(--white)', wordBreak: 'break-all' }}>{String(v)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <span style={{ fontSize: '12px', color: 'var(--ash)' }}>No query parameters parsed</span>
          )}
        </div>

        {hash && (
          <div style={{
            border: '1px solid var(--border-color)',
            backgroundColor: '#111',
            padding: '20px',
            borderRadius: '4px'
          }}>
            <span style={{
              fontSize: '10px',
              fontWeight: 800,
              color: 'var(--ash)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'block',
              marginBottom: '8px'
            }}>
              HASH / ANCHOR
            </span>
            <span style={{
              fontSize: '13px',
              color: 'var(--white)',
              fontFamily: 'var(--font-mono)'
            }}>
              {hash}
            </span>
          </div>
        )}
      </div>
    );
  }

  function renderHostingProvider() {
    const { ip, ip_type, hosting_provider } = resData || {};
    const {
      title,
      url,
      service_type,
      country_code,
      country_name,
      state_name,
      city_name,
      organization,
      zip_code,
      domain_name,
      isp
    } = hosting_provider || {};

    const items = [
      { label: 'HOSTING ISP', val: isp },
      { label: 'ORGANIZATION', val: organization },
      { label: 'DOMAIN NAME', val: domain_name },
      { label: 'COUNTRY', val: country_name ? `${country_name} (${country_code || ''})` : '' },
      { label: 'REGION / STATE', val: state_name },
      { label: 'CITY', val: city_name },
      { label: 'ZIP CODE', val: zip_code },
      { label: 'SERVICE PROVIDER', val: title ? `${title} (${service_type || ''})` : '' }
    ].filter(item => item.val);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Top summary card */}
        <div style={{
          border: '1px solid var(--border-color)',
          backgroundColor: '#111',
          padding: '20px',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <span style={{
              fontSize: '10px',
              fontWeight: 800,
              color: 'var(--ash)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'block',
              marginBottom: '6px'
            }}>
              RESOLVED IP ADDRESS
            </span>
            <span style={{
              fontSize: '22px',
              fontWeight: 900,
              color: 'var(--cyan-pulse)',
              fontFamily: 'var(--font-mono)'
            }}>
              {ip || 'N/A'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{
              fontSize: '11px',
              padding: '4px 10px',
              background: 'rgba(0, 240, 255, 0.1)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              borderRadius: '2px',
              color: 'var(--cyan-pulse)',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)'
            }}>
              IPv{ip_type || 4}
            </span>
            {url && (
              <a href={url} target="_blank" rel="noopener noreferrer" style={{
                fontSize: '11px',
                padding: '4px 10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                borderRadius: '2px',
                color: 'var(--ash)',
                textDecoration: 'none',
                fontFamily: 'var(--font-mono)',
                transition: 'all 0.2s'
              }}>
                Source Provider ↗
              </a>
            )}
          </div>
        </div>

        {/* Detailed stats grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {items.map((item, idx) => (
            <div key={idx} style={{
              border: '1px solid var(--border-color)',
              backgroundColor: '#0d0d0d',
              padding: '16px',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <span style={{
                fontSize: '10px',
                fontWeight: 800,
                color: 'var(--ash)',
                letterSpacing: '1px',
                fontFamily: 'var(--font-mono)'
              }}>
                {item.label}
              </span>
              <span style={{
                fontSize: '15px',
                fontWeight: 700,
                color: 'var(--white)',
                fontFamily: 'var(--font-mono)',
                wordBreak: 'break-all'
              }}>
                {item.val}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderWebServer() {
    const hops = resData?.result || [];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {hops.length > 0 ? (
          hops.map((hop: any, idx: number) => {
            const heading = hop._heading || '';
            const headers = hop._data || {};
            const keys = Object.keys(headers);

            let statusColor = '#3498db';
            if (heading.includes(' 200')) {
              statusColor = '#2ecc71';
            } else if (heading.includes(' 301') || heading.includes(' 302') || heading.includes(' 307') || heading.includes(' 308')) {
              statusColor = '#f39c12';
            } else if (heading.includes(' 40') || heading.includes(' 50')) {
              statusColor = '#e74c3c';
            }

            return (
              <div key={idx} style={{
                border: '1px solid var(--border-color)',
                backgroundColor: '#111',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                {/* Hop Header / Status */}
                <div style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: '#0c0c0c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      backgroundColor: statusColor,
                      color: '#000',
                      padding: '2px 6px',
                      borderRadius: '2px',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      HOP {idx + 1}
                    </span>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'var(--white)',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {heading}
                    </span>
                  </div>
                </div>

                {/* Headers Grid */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {keys.map((key, hIdx) => {
                    const val = headers[key];
                    return (
                      <div key={hIdx} style={{
                        padding: '12px 16px',
                        borderBottom: hIdx < keys.length - 1 ? '1px solid #1a1a1a' : 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        backgroundColor: hIdx % 2 === 0 ? '#0e0e0e' : '#111'
                      }}>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          color: 'var(--ash)',
                          letterSpacing: '1px',
                          fontFamily: 'var(--font-mono)'
                        }}>
                          {key}
                        </span>
                        <span style={{
                          fontSize: '13px',
                          color: 'var(--white)',
                          fontFamily: 'var(--font-mono)',
                          wordBreak: 'break-all',
                          lineHeight: '1.4'
                        }} dangerouslySetInnerHTML={{ __html: val }}></span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div style={{
            border: '1px solid var(--border-color)',
            backgroundColor: '#111',
            padding: '30px',
            borderRadius: '4px',
            textAlign: 'center',
            color: 'var(--ash)'
          }}>
            No response headers found.
          </div>
        )}
      </div>
    );
  }


  function renderMd5Generator() {
    const { str, md5, b64, sha1 } = resData || {};

    const items = [
      { label: 'INPUT STRING', val: str },
      { label: 'MD5 HASH', val: md5 },
      { label: 'SHA-1 HASH', val: sha1 },
      { label: 'BASE64 ENCODING', val: b64 }
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
            <span className="response-label" style={{ marginBottom: 0 }}>CRYPTOGRAPHIC HASH RESULTS</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {items.map((item, idx) => (
              <div key={idx} style={{
                padding: '14px 16px',
                borderBottom: idx < items.length - 1 ? '1px solid #1a1a1a' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                background: idx % 2 === 0 ? '#0e0e0e' : '#111'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ash)', letterSpacing: '1px' }}>{item.label}</span>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: item.label === 'INPUT STRING' ? 'var(--gold-text)' : 'var(--white)',
                    fontFamily: 'var(--font-mono)',
                    wordBreak: 'break-all'
                  }}>{item.val || 'N/A'}</span>
                </div>
                {item.val && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.val);
                      alert('Copied to clipboard!');
                    }}
                    style={{
                      background: 'none',
                      border: '1px solid var(--border-color)',
                      color: 'var(--ash)',
                      padding: '4px 8px',
                      borderRadius: '3px',
                      fontSize: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: 'inherit',
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--white)';
                      e.currentTarget.style.borderColor = 'var(--gold-text)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--ash)';
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                    }}
                  >
                    COPY
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }


  function renderPasswordGenerator() {
    const { passwords, strength } = resData || {};
    const passList: string[] = passwords || [];

    let strengthColor = 'var(--gold-text)';
    let strengthBg = 'rgba(212, 175, 55, 0.1)';
    if (strength === 'WEAK') {
      strengthColor = '#ff4d4d';
      strengthBg = 'rgba(255, 77, 77, 0.1)';
    } else if (strength === 'GOOD') {
      strengthColor = '#f39c12';
      strengthBg = 'rgba(243, 156, 18, 0.1)';
    } else if (strength === 'STRONG' || strength === 'VERY STRONG') {
      strengthColor = '#2ecc71';
      strengthBg = 'rgba(46, 204, 113, 0.1)';
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Strength overview */}
        <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '20px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="response-label" style={{ display: 'block', marginBottom: '4px' }}>PASSWORD QUALITY</span>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              color: strengthColor,
              border: `1px solid ${strengthColor}`,
              padding: '4px 10px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              backgroundColor: strengthBg,
              fontFamily: 'var(--font-mono)'
            }}>
              {strength || 'N/A'}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '4px' }}>COUNT</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>{passList.length} generated</div>
          </div>
        </div>

        {/* Password output box */}
        <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="response-label" style={{ marginBottom: 0 }}>GENERATED SECURE PASSWORDS</span>
          </div>
          {passList.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {passList.map((pw, idx) => (
                <div key={idx} style={{
                  padding: '14px 16px',
                  borderBottom: idx < passList.length - 1 ? '1px solid #1a1a1a' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  background: idx % 2 === 0 ? '#0e0e0e' : '#111'
                }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: '11px', color: 'var(--ash)', fontFamily: 'var(--font-mono)', minWidth: '24px' }}>#{idx + 1}</span>
                    <span style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: 'var(--white)',
                      fontFamily: 'var(--font-mono)',
                      wordBreak: 'break-all',
                      letterSpacing: '1px'
                    }}>{pw}</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(pw);
                      alert('Copied to clipboard!');
                    }}
                    style={{
                      background: 'none',
                      border: '1px solid var(--border-color)',
                      color: 'var(--ash)',
                      padding: '4px 8px',
                      borderRadius: '3px',
                      fontSize: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: 'inherit'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--white)';
                      e.currentTarget.style.borderColor = 'var(--gold-text)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--ash)';
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                    }}
                  >
                    COPY
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--ash)', fontSize: '12px' }}>
              No passwords generated.
            </div>
          )}
        </div>
      </div>
    );
  }


  function renderMacLookup() {
    const { result, query, mode } = resData || {};
    const macRecords = result || [];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Search header card */}
        <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '20px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="response-label" style={{ display: 'block', marginBottom: '4px' }}>SEARCHED MAC</span>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>{query || 'N/A'}</div>
          </div>
          <div>
            <span className="response-label" style={{ display: 'block', marginBottom: '4px' }}>MODE</span>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              color: 'var(--gold-text)',
              border: '1px solid var(--gold-border)',
              padding: '2px 8px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              fontFamily: 'var(--font-mono)'
            }}>
              {mode || 'N/A'}
            </span>
          </div>
        </div>

        {macRecords.length > 0 ? (
          macRecords.map((record: any, recordIdx: number) => {
            const historyList = record.history || [];
            const latestHistory = historyList[historyList.length - 1] || {};

            return (
              <div key={recordIdx} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Registry overview */}
                <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
                    <span className="response-label" style={{ marginBottom: 0 }}>REGISTRY INFO & BLOCK BLOCKS</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a1a', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ash)', letterSpacing: '1px' }}>OUI prefix</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>{record.oui || 'N/A'}</span>
                    </div>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a1a', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ash)', letterSpacing: '1px' }}>BLOCK SIZE TYPE</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--white)', textTransform: 'uppercase' }}>{record.block || 'N/A'}</span>
                    </div>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a1a', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ash)', letterSpacing: '1px' }}>RANGE START</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>{record.range_start || 'N/A'}</span>
                    </div>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a1a', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ash)', letterSpacing: '1px' }}>RANGE END</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>{record.range_end || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Organization Details */}
                {latestHistory.org_name && (
                  <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <span className="response-label" style={{ marginBottom: 0 }}>ASSIGNED VENDOR / ORGANIZATION</span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--gold-text)' }}>{latestHistory.org_name}</div>
                        {latestHistory.country && (
                          <div style={{ fontSize: '12px', color: 'var(--ash)', textTransform: 'uppercase', marginTop: '2px' }}>
                            {latestHistory.country}
                          </div>
                        )}
                      </div>
                      {latestHistory.org_address && (
                        <div>
                          <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ash)', letterSpacing: '1px', display: 'block', marginBottom: '2px' }}>VENDOR ADDRESS</span>
                          <div style={{ fontSize: '13px', color: 'var(--white)' }}>{latestHistory.org_address}</div>
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        <div>
                          <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ash)', letterSpacing: '1px', display: 'block', marginBottom: '2px' }}>PRIVATE STATUS</span>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: latestHistory.is_private ? '#ff4d4d' : '#2ecc71',
                          }}>
                            {latestHistory.is_private ? 'PRIVATE BLOCK' : 'PUBLIC REGISTRY'}
                          </span>
                        </div>
                        {latestHistory.action_date && (
                          <div>
                            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ash)', letterSpacing: '1px', display: 'block', marginBottom: '2px' }}>LAST REGISTRY ACTION</span>
                            <span style={{ fontSize: '12px', color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>
                              {latestHistory.action_date} ({latestHistory.action_type || 'N/A'})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* History Timeline */}
                {historyList.length > 1 && (
                  <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
                      <span className="response-label" style={{ marginBottom: 0 }}>REGISTRY HISTORY TIMELINE</span>
                    </div>
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {historyList.map((hist: any, hIdx: number) => (
                        <div key={hIdx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gold-text)', marginTop: '4px' }}></div>
                            {hIdx < historyList.length - 1 && (
                              <div style={{ width: '2px', height: '40px', background: '#1a1a1a', marginTop: '4px' }}></div>
                            )}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--white)', fontWeight: 600 }}>{hist.org_name}</span>
                            <span style={{ fontSize: '11px', color: 'var(--ash)', fontFamily: 'var(--font-mono)' }}>
                              {hist.action_date} — action: {hist.action_type} {hist.country ? `(${hist.country})` : ''}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '30px', borderRadius: '4px', textAlign: 'center', color: 'var(--ash)' }}>
            No records found for this MAC Address.
          </div>
        )}
      </div>
    );
  }


  function renderIpWhois() {
    const { host, hostname, whoisIP, ipCIDR, ipData } = resData || {};
    const cidrList: string[] = ipCIDR || [];
    const details = ipData || {};

    const metaItems = [
      { label: 'HOST / IP ADDRESS', val: host },
      { label: 'REVERSE HOSTNAME', val: hostname },
      { label: 'NETWORK RANGE', val: details.net_range },
      { label: 'ORGANIZATION', val: details.organization },
      { label: 'NETWORK NAME', val: details.network_name },
      { label: 'ASN', val: details.asn },
      { label: 'REGISTRATION DATE', val: details.registration_date },
      { label: 'LAST UPDATE', val: details.last_update },
      { label: 'COUNTRY', val: details.country_name ? `${details.country_name} (${details.country_code || ''})` : '' },
      { label: 'LOCATION (STATE / CITY)', val: [details.state_name, details.city_name].filter(Boolean).join(', ') },
      { label: 'COORDINATES (LAT / LON)', val: details.latitude || details.longitude ? `${details.latitude || 0}, ${details.longitude || 0}` : '' },
      { label: 'POSTAL CODE', val: details.postal_code },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Main Whois Info Card */}
        <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
            <span className="response-label" style={{ marginBottom: 0 }}>REGISTRY METRICS & WHOIS DATA</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {metaItems.map((item, idx) => (
              <div key={idx} style={{
                padding: '14px 16px',
                borderBottom: '1px solid #1a1a1a',
                borderRight: '1px solid #1a1a1a',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ash)', letterSpacing: '1px' }}>{item.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--white)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{item.val || 'N/A'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CIDR list if any */}
        {cidrList.length > 0 && (
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '8px' }}>ASSOCIATED CIDR BLOCKS</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {cidrList.map((cidr, idx) => (
                <span key={idx} style={{ padding: '4px 8px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '2px', fontSize: '12px', color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>{cidr}</span>
              ))}
            </div>
          </div>
        )}

        {/* Raw Whois response */}
        {whoisIP && (
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="response-label" style={{ marginBottom: 0 }}>RAW WHOIS RECORD</span>
            </div>
            <pre style={{
              margin: 0,
              padding: '16px',
              backgroundColor: '#070707',
              color: '#8c92ac',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              lineHeight: '1.6',
              overflowX: 'auto',
              maxHeight: '400px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}>
              {whoisIP.trim()}
            </pre>
          </div>
        )}
      </div>
    );
  }

  function renderSubnet() {
    const { network, list } = resData || {};
    const netKeys = Object.keys(network || {});
    const netDetails = netKeys.length > 0 ? network[netKeys[0]] : null;
    const netList: string[] = list?.nets || [];
    const ipList: string[] = list?.ips?.ipv4 || [];

    const stats = netDetails ? [
      { label: 'IP ADDRESS', val: netDetails.IP },
      { label: 'NETMASK', val: netDetails.NetMask },
      { label: 'NETWORK ADDRESS', val: netDetails.Network },
      { label: 'PREFIX LENGTH', val: netDetails.PrefixLength },
      { label: 'CIDR BLOCK', val: netDetails.CIDR },
      { label: 'WILDCARD MASK', val: netDetails.WildCard },
      { label: 'BROADCAST ADDRESS', val: netDetails.BroadCast },
      { label: 'FIRST USABLE IP', val: netDetails.FirstIP },
      { label: 'LAST USABLE IP', val: netDetails.LastIP },
      { label: 'TOTAL IP BLOCK SIZE', val: netDetails.BlockSize },
    ] : [];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Main CIDR Stats */}
        {netDetails && (
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '24px', borderRadius: '4px', textAlign: 'center' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '8px' }}>SUBNET RANGE CIDR</span>
            <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--gold-text)', fontFamily: 'var(--font-mono)' }}>{netDetails.CIDR || 'N/A'}</div>
          </div>
        )}

        {/* Network Metrics Grid */}
        {stats.length > 0 && (
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
              <span className="response-label" style={{ marginBottom: 0 }}>SUBNET CALCULATION METRICS</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {stats.map((item, idx) => (
                <div key={idx} style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid #1a1a1a',
                  borderRight: '1px solid #1a1a1a',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ash)', letterSpacing: '1px' }}>{item.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--white)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{item.val || 'N/A'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subnet Blocks & IP Lists */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Subnet Division Nets */}
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="response-label" style={{ marginBottom: 0 }}>SUBNET BLOCKS</span>
              <span style={{ fontSize: '10px', color: 'var(--ash)', fontFamily: 'var(--font-mono)' }}>{netList.length} nets</span>
            </div>
            {netList.length > 0 ? (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {netList.map((net, idx) => (
                  <div key={idx} style={{ padding: '10px 16px', borderBottom: idx < netList.length - 1 ? '1px solid #1a1a1a' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--ash)', fontFamily: 'var(--font-mono)' }}>Net #{idx + 1}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>{net}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '16px', color: 'var(--ash)', fontSize: '12px', textAlign: 'center' }}>No subnet blocks generated.</div>
            )}
          </div>

          {/* Usable IP Addresses */}
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="response-label" style={{ marginBottom: 0 }}>USABLE IP ADDRESSES LIST</span>
              <span style={{ fontSize: '10px', color: 'var(--ash)', fontFamily: 'var(--font-mono)' }}>{ipList.length} IPs</span>
            </div>
            {ipList.length > 0 ? (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px', padding: '16px' }}>
                  {ipList.map((ip, idx) => (
                    <div key={idx} style={{ padding: '6px 8px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '2px', textAlign: 'center', fontSize: '11px', color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>
                      {ip}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ padding: '16px', color: 'var(--ash)', fontSize: '12px', textAlign: 'center' }}>No usable IP addresses found in list.</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function renderIpv6Range() {
    const { value, BlockSize, Networks } = resData || {};
    const netList: string[] = Networks || [];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Input & Block Size Header */}
        <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '20px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="response-label" style={{ display: 'block', marginBottom: '4px' }}>INPUT RANGE</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--white)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{value || 'N/A'}</div>
          </div>
          <div>
            <span className="response-label" style={{ display: 'block', marginBottom: '4px' }}>BLOCK SIZE</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--gold-text)', fontFamily: 'var(--font-mono)' }}>{BlockSize || '0'}</div>
          </div>
        </div>

        {/* Equivalent CIDR Blocks */}
        <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="response-label" style={{ marginBottom: 0 }}>EQUIVALENT CIDR NETWORKS</span>
            <span style={{ fontSize: '10px', color: 'var(--ash)', fontFamily: 'var(--font-mono)' }}>{netList.length} blocks</span>
          </div>
          {netList.length > 0 ? (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', padding: '8px 16px', background: '#0a0a0a', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ash)', letterSpacing: '1px' }}>INDEX</span>
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ash)', letterSpacing: '1px' }}>CIDR BLOCK</span>
              </div>
              {netList.map((net, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', padding: '10px 16px', borderBottom: idx < netList.length - 1 ? '1px solid #1a1a1a' : 'none', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--ash)', fontFamily: 'var(--font-mono)' }}>#{idx + 1}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--white)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{net}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '16px', color: 'var(--ash)', fontSize: '12px', textAlign: 'center' }}>No equivalent CIDR networks found.</div>
          )}
        </div>
      </div>
    );
  }

  function renderIpv6Cidr() {
    const {
      value,
      IP,
      NetMask,
      Network,
      PrefixLength,
      WildCard,
      BroadCast,
      FirstIP,
      LastIP,
      BlockSize
    } = resData || {};

    const stats = [
      { label: 'IP ADDRESS', val: IP },
      { label: 'PREFIX LENGTH', val: PrefixLength },
      { label: 'NETMASK', val: NetMask },
      { label: 'NETWORK', val: Network },
      { label: 'WILDCARD', val: WildCard },
      { label: 'BROADCAST', val: BroadCast },
      { label: 'BLOCK SIZE', val: BlockSize },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Main Range Card */}
        <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '24px', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span className="response-label" style={{ display: 'block', marginBottom: '4px' }}>INPUT CIDR VALUE</span>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>{value || 'N/A'}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid #1a1a1a', paddingTop: '16px' }}>
            <div>
              <span className="response-label" style={{ display: 'block', marginBottom: '4px' }}>FIRST IP ADDRESS</span>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--gold-text)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{FirstIP || 'N/A'}</div>
            </div>
            <div>
              <span className="response-label" style={{ display: 'block', marginBottom: '4px' }}>LAST IP ADDRESS</span>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--gold-text)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{LastIP || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Network Metrics */}
        <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
            <span className="response-label" style={{ marginBottom: 0 }}>NETWORK STATS & RANGE METRICS</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {stats.map((item, idx) => (
              <div key={idx} style={{
                padding: '14px 16px',
                borderBottom: '1px solid #1a1a1a',
                borderRight: '1px solid #1a1a1a',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ash)', letterSpacing: '1px' }}>{item.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--white)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{item.val || 'N/A'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderIpv6Generator() {
    const {
      prefix,
      globalID,
      subnetID,
      IPChunk,
      IPFormat,
      IP,
      NetMask,
      Network,
      PrefixLength,
      CIDR,
      WildCard,
      BroadCast,
      FirstIP,
      FirstIPE,
      FirstIPES,
      LastIP,
      LastIPE,
      LastIPES,
      BlockSize
    } = resData || {};

    const items = [
      { label: 'PREFIX', val: prefix },
      { label: 'GLOBAL ID', val: globalID },
      { label: 'SUBNET ID', val: subnetID },
      { label: 'IP CHUNK', val: IPChunk },
      { label: 'IP FORMAT', val: IPFormat },
      { label: 'NETMASK', val: NetMask },
      { label: 'NETWORK', val: Network },
      { label: 'PREFIX LENGTH', val: PrefixLength },
      { label: 'CIDR', val: CIDR },
      { label: 'WILDCARD', val: WildCard },
      { label: 'BROADCAST', val: BroadCast },
      { label: 'FIRST IP', val: FirstIP },
      { label: 'FIRST IP (EXPANDED)', val: FirstIPE },
      { label: 'FIRST IP (EXPANDED SHORTHAND)', val: FirstIPES },
      { label: 'LAST IP', val: LastIP },
      { label: 'LAST IP (EXPANDED)', val: LastIPE },
      { label: 'LAST IP (EXPANDED SHORTHAND)', val: LastIPES },
      { label: 'BLOCK SIZE', val: BlockSize },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Main Generated Address */}
        <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '24px', borderRadius: '4px', textAlign: 'center' }}>
          <span className="response-label" style={{ display: 'block', marginBottom: '8px' }}>GENERATED IPv6 ADDRESS</span>
          <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--gold-text)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{IP || 'N/A'}</div>
        </div>

        {/* Detailed Metrics */}
        <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
            <span className="response-label" style={{ marginBottom: 0 }}>ADDRESS GENERATION METRICS</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {items.map((item, idx) => (
              <div key={idx} style={{
                padding: '14px 16px',
                borderBottom: '1px solid #1a1a1a',
                borderRight: '1px solid #1a1a1a',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ash)', letterSpacing: '1px' }}>{item.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--white)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{item.val || 'N/A'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderIpv6Compatibility() {
    const { host, compatible, compatible_t, web, ns } = resData || {};
    const webItems: any[] = web || [];
    const nsItems: any[] = ns || [];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Main Status */}
        <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '20px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="response-label" style={{ display: 'block', marginBottom: '4px' }}>TARGET DOMAIN / HOST</span>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>{host || 'N/A'}</div>
          </div>
          <div>
            <span style={{
              fontSize: '11px',
              fontWeight: 900,
              padding: '6px 14px',
              borderRadius: '2px',
              backgroundColor: compatible ? 'rgba(76,175,80,0.2)' : 'rgba(255,77,77,0.2)',
              color: compatible ? '#4caf50' : '#ff4d4d',
              border: compatible ? '1px solid rgba(76,175,80,0.4)' : '1px solid rgba(255,77,77,0.4)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '1.5px'
            }}>
              IPV6 {compatible_t?.toUpperCase() || (compatible ? 'COMPATIBLE' : 'NOT COMPATIBLE')}
            </span>
          </div>
        </div>

        {/* Web Servers IPv6 Check */}
        <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="response-label" style={{ marginBottom: 0 }}>WEB SERVERS IPV6 ADDRESSES</span>
            <span style={{ fontSize: '10px', color: 'var(--ash)', fontFamily: 'var(--font-mono)' }}>{webItems.length} records</span>
          </div>
          {webItems.length > 0 ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', padding: '8px 16px', background: '#0a0a0a', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ash)', letterSpacing: '1px' }}>ADDRESS</span>
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ash)', letterSpacing: '1px' }}>IPV6 RESOLUTION</span>
              </div>
              {webItems.map((item, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', padding: '10px 16px', borderBottom: idx < webItems.length - 1 ? '1px solid #1a1a1a' : 'none', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--white)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{item.address}</span>
                  <span style={{ fontSize: '12px', color: item.ip ? 'var(--gold-text)' : 'var(--ash)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{item.ip || 'No IPv6 configured'}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '16px', color: 'var(--ash)', fontSize: '12px', textAlign: 'center' }}>No web server records found.</div>
          )}
        </div>

        {/* Name Servers IPv6 Check */}
        <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="response-label" style={{ marginBottom: 0 }}>NAME SERVERS IPV6 ADDRESSES</span>
            <span style={{ fontSize: '10px', color: 'var(--ash)', fontFamily: 'var(--font-mono)' }}>{nsItems.length} records</span>
          </div>
          {nsItems.length > 0 ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', padding: '8px 16px', background: '#0a0a0a', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ash)', letterSpacing: '1px' }}>NAME SERVER</span>
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ash)', letterSpacing: '1px' }}>IPV6 RESOLUTION</span>
              </div>
              {nsItems.map((item, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', padding: '10px 16px', borderBottom: idx < nsItems.length - 1 ? '1px solid #1a1a1a' : 'none', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--white)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{item.address}</span>
                  <span style={{ fontSize: '12px', color: item.ip ? 'var(--gold-text)' : 'var(--ash)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{item.ip || 'No IPv6 configured'}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '16px', color: 'var(--ash)', fontSize: '12px', textAlign: 'center' }}>No name server records found.</div>
          )}
        </div>
      </div>
    );
  }

  function renderIpToDecimal() {
    const { ip, ip_long, ipv6C, ipv6E } = resData || {};

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>SOURCE IP ADDRESS</span>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>{ip || 'N/A'}</div>
          </div>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>DECIMAL (IPLONG)</span>
            <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--gold-text)', fontFamily: 'var(--font-mono)' }}>{ip_long ?? 'N/A'}</div>
          </div>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>IPV6 COMPATIBILITY</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--white)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{ipv6C || 'N/A'}</div>
          </div>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>IPV6 EXPANDED</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--white)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{ipv6E || 'N/A'}</div>
          </div>
        </div>
      </div>
    );
  }

  function renderIpv4ToIpv6() {
    const { ip, ipv6C, ipv6E, ipv6ES } = resData || {};

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>SOURCE IPV4 ADDRESS</span>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>{ip || 'N/A'}</div>
          </div>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>IPV6 SHORTHAND (COMPRESSED)</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--gold-text)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{ipv6ES || 'N/A'}</div>
          </div>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>IPV6 COMPATIBILITY</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--white)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{ipv6C || 'N/A'}</div>
          </div>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>IPV6 EXPANDED (FULL)</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--white)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{ipv6E || 'N/A'}</div>
          </div>
        </div>
      </div>
    );
  }

  function renderVerifyEmail() {
    const { email, is_valid, status } = resData || {};

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Main Card */}
        <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '24px', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span className="response-label" style={{ display: 'block', marginBottom: '4px' }}>TARGET EMAIL ADDRESS</span>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--white)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
                {email || 'N/A'}
              </div>
            </div>
            <div>
              <span style={{
                fontSize: '13px',
                fontWeight: 900,
                padding: '6px 14px',
                borderRadius: '3px',
                backgroundColor: is_valid ? 'rgba(76,175,80,0.2)' : 'rgba(255,77,77,0.2)',
                color: is_valid ? '#4caf50' : '#ff4d4d',
                border: is_valid ? '1px solid rgba(76,175,80,0.4)' : '1px solid rgba(255,77,77,0.4)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '1px'
              }}>
                {status || (is_valid ? 'VALID' : 'INVALID')}
              </span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#0a0a0a', padding: '12px 16px', borderRadius: '3px', border: '1px solid #1a1a1a' }}>
              <span style={{ fontSize: '11px', color: 'var(--ash)', display: 'block', marginBottom: '2px' }}>DELIVERABILITY STATUS</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: is_valid ? '#4caf50' : '#ff4d4d' }}>
                {is_valid ? 'Deliverable / Address Exists' : 'Undeliverable / Invalid Address'}
              </span>
            </div>
            <div style={{ background: '#0a0a0a', padding: '12px 16px', borderRadius: '3px', border: '1px solid #1a1a1a' }}>
              <span style={{ fontSize: '11px', color: 'var(--ash)', display: 'block', marginBottom: '2px' }}>MX MAIL SERVER RESPONSE</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--white)' }}>
                {is_valid ? 'Recipient Accepted' : 'Recipient Rejected'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderIpBlacklist() {
    const { ip, total_checked, blacklisted_count, clean_count, dnsBL } = resData || {};
    const items: any[] = dnsBL || [];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Meta summary row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>RESOLVED IP</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--white)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{ip || 'N/A'}</div>
          </div>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>SERVERS CHECKED</span>
            <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--gold-text)', fontFamily: 'var(--font-mono)' }}>{total_checked ?? items.length}</div>
          </div>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>CLEAN</span>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#4caf50', fontFamily: 'var(--font-mono)' }}>{clean_count ?? 0}</div>
          </div>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>BLACKLISTED</span>
            <div style={{ fontSize: '28px', fontWeight: 900, color: blacklisted_count > 0 ? '#ff4d4d' : 'var(--ash)', fontFamily: 'var(--font-mono)' }}>{blacklisted_count ?? 0}</div>
          </div>
        </div>

        {/* DNSBL Table */}
        {items.length > 0 && (
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
              <span className="response-label" style={{ marginBottom: 0 }}>DNSBL DATABASE STATUS</span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 120px',
              padding: '8px 16px',
              background: '#0a0a0a',
              borderBottom: '1px solid var(--border-color)',
            }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ash)', letterSpacing: '1px' }}>DNSBL SERVER</span>
              <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ash)', letterSpacing: '1px' }}>RESULT</span>
            </div>
            {items.map((item, idx) => (
              <div key={idx} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 120px',
                padding: '10px 16px',
                borderBottom: idx < items.length - 1 ? '1px solid #1a1a1a' : 'none',
                backgroundColor: item.found ? 'rgba(255,77,77,0.05)' : (idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'),
                alignItems: 'center',
              }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: item.found ? '#ff6b6b' : 'var(--white)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
                  {item.url}
                </span>
                <div>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 900,
                    padding: '3px 8px',
                    borderRadius: '2px',
                    backgroundColor: item.found ? 'rgba(255,77,77,0.2)' : 'rgba(76,175,80,0.15)',
                    color: item.found ? '#ff4d4d' : '#4caf50',
                    border: item.found ? '1px solid rgba(255,77,77,0.4)' : '1px solid rgba(76,175,80,0.3)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {item.found ? 'LISTED' : 'CLEAN'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function renderDmarcValidation() {
    const { host, tests } = resData || {};
    const passList: string[] = tests?.pass || [];
    const failList: string[] = tests?.fail || [];

    const formatTestName = (name: string) => {
      return name
        .split('_')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Meta summary row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>TARGET HOST</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--white)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{host || 'N/A'}</div>
          </div>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>PASSED CHECKS</span>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#4caf50', fontFamily: 'var(--font-mono)' }}>{passList.length}</div>
          </div>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>FAILED CHECKS</span>
            <div style={{ fontSize: '28px', fontWeight: 900, color: failList.length > 0 ? '#ff4d4d' : 'var(--ash)', fontFamily: 'var(--font-mono)' }}>{failList.length}</div>
          </div>
        </div>

        {/* Validation Tests Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Passed */}
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', borderRadius: '4px', padding: '16px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '12px', color: '#4caf50' }}>
              ✓ PASSED DMARC POLICIES ({passList.length})
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {passList.map((test, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'var(--white)', background: '#0a0a0a', padding: '8px 12px', borderRadius: '3px', border: '1px solid #1a1a1a' }}>
                  <span style={{ color: '#4caf50', fontWeight: 900 }}>✓</span>
                  <span>{formatTestName(test)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Failed */}
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', borderRadius: '4px', padding: '16px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '12px', color: failList.length > 0 ? '#ff4d4d' : 'var(--ash)' }}>
              ✕ FAILED DMARC POLICIES ({failList.length})
            </span>
            {failList.length === 0 ? (
              <div style={{ fontSize: '12px', color: 'var(--ash)', fontStyle: 'italic', padding: '12px' }}>
                No DMARC policy failures detected! All security checks passed.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {failList.map((test, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#ff6b6b', background: 'rgba(255,77,77,0.05)', padding: '8px 12px', borderRadius: '3px', border: '1px solid rgba(255,77,77,0.2)' }}>
                    <span style={{ fontWeight: 900 }}>✕</span>
                    <span>{formatTestName(test)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function renderDnsRecords() {
    const { host, total_records, records } = resData || {};
    const recordTypes = records ? Object.keys(records) : [];

    const typeColors: Record<string, string> = {
      A: '#4caf50',
      AAAA: '#2196f3',
      MX: '#ff9800',
      NS: '#9c27b0',
      TXT: '#00bcd4',
      SOA: '#e91e63',
      CNAME: '#009688',
      CAA: '#ff5722',
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Meta summary row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>TARGET HOST</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--white)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{host || 'N/A'}</div>
          </div>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>TOTAL RECORDS</span>
            <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--gold-text)', fontFamily: 'var(--font-mono)' }}>{total_records ?? 0}</div>
          </div>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>RECORD TYPES</span>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#2196f3', fontFamily: 'var(--font-mono)' }}>{recordTypes.length}</div>
          </div>
        </div>

        {/* Record Type Sections */}
        {recordTypes.map(type => {
          const items: any[] = records[type] || [];
          const badgeColor = typeColors[type] || 'var(--gold)';

          return (
            <div key={type} style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden' }}>
              {/* Type Header */}
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#0a0a0a'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 900,
                    padding: '3px 8px',
                    borderRadius: '2px',
                    backgroundColor: `${badgeColor}22`,
                    color: badgeColor,
                    border: `1px solid ${badgeColor}44`,
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {type}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--white)' }}>
                    {type} Records ({items.length})
                  </span>
                </div>
              </div>

              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 100px',
                padding: '8px 16px',
                background: '#0e0e0e',
                borderBottom: '1px solid var(--border-color)',
              }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ash)', letterSpacing: '1px' }}>VALUE / CONTENT</span>
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ash)', letterSpacing: '1px' }}>TTL</span>
              </div>

              {/* Items */}
              {items.map((item, idx) => (
                <div key={idx} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 100px',
                  padding: '12px 16px',
                  borderBottom: idx < items.length - 1 ? '1px solid #1a1a1a' : 'none',
                  backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--white)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
                    {item.content}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--ash)', fontFamily: 'var(--font-mono)' }}>
                    {item.ttl}
                  </span>
                </div>
              ))}
            </div>
          );
        })}

        {recordTypes.length === 0 && (
          <div style={{ border: '1px solid #333', backgroundColor: '#111', padding: '24px', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ color: 'var(--ash)', fontSize: '13px' }}>No DNS records found for this domain.</div>
          </div>
        )}
      </div>
    );
  }

  function renderDnsValidation() {
    const { host, ns, tests } = resData || {};
    const passList: string[] = tests?.pass || [];
    const failList: string[] = tests?.fail || [];

    const formatTestName = (name: string) => {
      return name
        .split('_')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Meta summary row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>TARGET HOST</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--white)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{host || 'N/A'}</div>
          </div>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>PASSED TESTS</span>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#4caf50', fontFamily: 'var(--font-mono)' }}>{passList.length}</div>
          </div>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>FAILED TESTS</span>
            <div style={{ fontSize: '28px', fontWeight: 900, color: failList.length > 0 ? '#ff4d4d' : 'var(--ash)', fontFamily: 'var(--font-mono)' }}>{failList.length}</div>
          </div>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>NAME SERVERS</span>
            <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--gold-text)', fontFamily: 'var(--font-mono)' }}>{ns?.length ?? 0}</div>
          </div>
        </div>

        {/* Name Servers Details */}
        {ns && ns.length > 0 && (
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
              <span className="response-label" style={{ marginBottom: 0 }}>NAME SERVERS STATUS</span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 100px 90px 80px',
              padding: '8px 16px',
              background: '#0a0a0a',
              borderBottom: '1px solid var(--border-color)',
            }}>
              {['NAMESERVER', 'LATENCY', 'TTL', 'STATUS'].map(h => (
                <span key={h} style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ash)', letterSpacing: '1px' }}>{h}</span>
              ))}
            </div>
            {ns.map((item: any, idx: number) => (
              <div key={idx} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 100px 90px 80px',
                padding: '12px 16px',
                borderBottom: idx < ns.length - 1 ? '1px solid #1a1a1a' : 'none',
                backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--white)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
                  {item.name}
                </span>
                <span style={{ fontSize: '12px', color: '#4caf50', fontFamily: 'var(--font-mono)' }}>
                  {item.time} ms
                </span>
                <span style={{ fontSize: '12px', color: 'var(--ash)', fontFamily: 'var(--font-mono)' }}>
                  {item.ttl}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  color: item.status ? '#4caf50' : '#ff4d4d'
                }}>
                  {item.status ? 'OK' : 'FAIL'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Validation Tests Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Passed */}
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', borderRadius: '4px', padding: '16px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '12px', color: '#4caf50' }}>
              ✓ PASSED VALIDATIONS ({passList.length})
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {passList.map((test, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'var(--white)', background: '#0a0a0a', padding: '8px 12px', borderRadius: '3px', border: '1px solid #1a1a1a' }}>
                  <span style={{ color: '#4caf50', fontWeight: 900 }}>✓</span>
                  <span>{formatTestName(test)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Failed */}
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', borderRadius: '4px', padding: '16px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '12px', color: failList.length > 0 ? '#ff4d4d' : 'var(--ash)' }}>
              ✕ FAILED VALIDATIONS ({failList.length})
            </span>
            {failList.length === 0 ? (
              <div style={{ fontSize: '12px', color: 'var(--ash)', fontStyle: 'italic', padding: '12px' }}>
                No validation failures detected! All checks passed.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {failList.map((test, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#ff6b6b', background: 'rgba(255,77,77,0.05)', padding: '8px 12px', borderRadius: '3px', border: '1px solid rgba(255,77,77,0.2)' }}>
                    <span style={{ fontWeight: 900 }}>✕</span>
                    <span>{formatTestName(test)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function renderNsLookup() {
    const { host, status, elapsed, dns_server, records } = resData || {};
    const isOk = status === 'NOERROR';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Meta info row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>DOMAIN</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--white)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{host || 'N/A'}</div>
          </div>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>STATUS</span>
            <div style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: isOk ? '#4caf50' : '#ff6b6b' }}>{status || 'N/A'}</div>
          </div>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>DNS SERVER</span>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>{dns_server || 'N/A'}</div>
            <div style={{ fontSize: '11px', color: 'var(--ash)', marginTop: '4px' }}>Query time: {elapsed || 'N/A'}</div>
          </div>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>SERVERS FOUND</span>
            <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--gold-text)', fontFamily: 'var(--font-mono)' }}>
              {records?.length ?? 0}
            </div>
          </div>
        </div>

        {/* NS Records table */}
        {records && records.length > 0 && (
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
              <span className="response-label" style={{ marginBottom: 0 }}>NAME SERVERS</span>
            </div>
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 100px',
              padding: '8px 16px',
              background: '#0a0a0a',
              borderBottom: '1px solid var(--border-color)',
            }}>
              {['NAMESERVER HOST', 'TTL'].map(h => (
                <span key={h} style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ash)', letterSpacing: '1px' }}>{h}</span>
              ))}
            </div>
            {/* Table rows */}
            {records.map((rec: any, idx: number) => (
              <div key={idx} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 100px',
                padding: '12px 16px',
                borderBottom: idx < records.length - 1 ? '1px solid #1a1a1a' : 'none',
                backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--white)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
                  {rec.value}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--ash)', fontFamily: 'var(--font-mono)' }}>
                  {rec.ttl}s
                </span>
              </div>
            ))}
          </div>
        )}

        {records && records.length === 0 && (
          <div style={{ border: '1px solid #333', backgroundColor: '#111', padding: '24px', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ color: 'var(--ash)', fontSize: '13px' }}>No NS records found for this domain.</div>
          </div>
        )}
      </div>
    );
  }

  function renderMxLookup() {
    const { host, status, elapsed, dns_server, records } = resData || {};
    const isOk = status === 'NOERROR';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Meta info row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>DOMAIN</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--white)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{host || 'N/A'}</div>
          </div>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>STATUS</span>
            <div style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: isOk ? '#4caf50' : '#ff6b6b' }}>{status || 'N/A'}</div>
          </div>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>DNS SERVER</span>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>{dns_server || 'N/A'}</div>
            <div style={{ fontSize: '11px', color: 'var(--ash)', marginTop: '4px' }}>Query time: {elapsed || 'N/A'}</div>
          </div>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>RECORDS FOUND</span>
            <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--gold-text)', fontFamily: 'var(--font-mono)' }}>
              {records?.length ?? 0}
            </div>
          </div>
        </div>

        {/* MX Records table */}
        {records && records.length > 0 && (
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
              <span className="response-label" style={{ marginBottom: 0 }}>MX RECORDS</span>
            </div>
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 90px',
              padding: '8px 16px',
              background: '#0a0a0a',
              borderBottom: '1px solid var(--border-color)',
            }}>
              {['PRIORITY', 'MAIL SERVER', 'TTL'].map(h => (
                <span key={h} style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ash)', letterSpacing: '1px' }}>{h}</span>
              ))}
            </div>
            {/* Table rows */}
            {[...records]
              .sort((a, b) => parseInt(a.preference) - parseInt(b.preference))
              .map((rec, idx) => (
              <div key={idx} style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 90px',
                padding: '12px 16px',
                borderBottom: idx < records.length - 1 ? '1px solid #1a1a1a' : 'none',
                backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                alignItems: 'center',
              }}>
                <span style={{
                  fontSize: '13px',
                  fontWeight: 900,
                  fontFamily: 'var(--font-mono)',
                  color: parseInt(rec.preference) <= 10 ? 'var(--gold-text)' : 'var(--white)',
                }}>
                  {rec.preference}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--white)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
                  {rec.mx}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--ash)', fontFamily: 'var(--font-mono)' }}>
                  {rec.ttl}s
                </span>
              </div>
            ))}
          </div>
        )}

        {records && records.length === 0 && (
          <div style={{ border: '1px solid #333', backgroundColor: '#111', padding: '24px', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ color: 'var(--ash)', fontSize: '13px' }}>No MX records found for this domain.</div>
          </div>
        )}
      </div>
    );
  }

  function renderPing() {
    const { domain, ip, rtt_ms, packet_loss, rtt_min, rtt_avg, rtt_max, rtt_mdev } = resData || {};

    // RTT quality color
    const rttColor = rtt_ms == null ? 'var(--ash)'
      : rtt_ms < 20  ? '#4caf50'
      : rtt_ms < 100 ? '#f48120'
      : '#ff4d4d';

    // RTT bar width (cap at 500ms → 100%)
    const rttBarPct = rtt_ms != null ? Math.min((rtt_ms / 500) * 100, 100) : 0;

    const lossNum = parseFloat(packet_loss);
    const lossColor = isNaN(lossNum) ? 'var(--ash)' : lossNum === 0 ? '#4caf50' : lossNum < 10 ? '#f48120' : '#ff4d4d';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          {/* RTT */}
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '18px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '8px' }}>LATENCY (RTT)</span>
            <div style={{ fontSize: '28px', fontWeight: 900, color: rttColor, fontFamily: 'var(--font-mono)' }}>
              {rtt_ms != null ? `${rtt_ms} ms` : 'N/A'}
            </div>
            {/* Bar */}
            <div style={{ marginTop: '10px', height: '4px', backgroundColor: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${rttBarPct}%`, backgroundColor: rttColor, borderRadius: '2px', transition: 'width 0.4s ease' }} />
            </div>
          </div>

          {/* IP */}
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '18px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '8px' }}>RESOLVED IP</span>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>{ip || 'N/A'}</div>
            <div style={{ fontSize: '11px', color: 'var(--ash)', marginTop: '6px' }}>{domain}</div>
          </div>

          {/* Packet loss */}
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '18px', borderRadius: '4px' }}>
            <span className="response-label" style={{ display: 'block', marginBottom: '8px' }}>PACKET LOSS</span>
            <div style={{ fontSize: '28px', fontWeight: 900, color: lossColor, fontFamily: 'var(--font-mono)' }}>
              {packet_loss || 'N/A'}
            </div>
          </div>
        </div>

        {/* RTT Stats */}
        <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
          <span className="response-label" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', display: 'block', marginBottom: '14px' }}>
            RTT STATISTICS
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            {[
              { label: 'MIN', value: rtt_min },
              { label: 'AVG', value: rtt_avg },
              { label: 'MAX', value: rtt_max },
              { label: 'MDEV', value: rtt_mdev },
            ].map(({ label, value }) => (
              <div key={label} style={{ padding: '10px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: 'var(--ash)', fontWeight: 700, marginBottom: '6px', letterSpacing: '1px' }}>{label}</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>{value || 'N/A'}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }
}

