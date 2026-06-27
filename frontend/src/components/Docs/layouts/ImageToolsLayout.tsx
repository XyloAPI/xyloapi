import type { DocTopic } from '../types';

interface ImageToolsLayoutProps {
  activeTopic: DocTopic;
  resData: any;
  copyToClipboard: (text: string) => void;
}

export default function ImageToolsLayout({ activeTopic, resData, copyToClipboard }: ImageToolsLayoutProps) {
  const isHitungJarak = activeTopic.id === 'hitung-jarak' || activeTopic.id === 'hitungjarak';
  if (isHitungJarak && resData) {
    const dariNama = resData.dari?.nama || '';
    const dariLokasi = resData.dari?.lokasi || '';
    const dariLat = resData.dari?.koordinat?.lat || 0;
    const dariLon = resData.dari?.koordinat?.lon || 0;

    const keNama = resData.ke?.nama || '';
    const keLokasi = resData.ke?.lokasi || '';
    const keLat = resData.ke?.koordinat?.lat || 0;
    const keLon = resData.ke?.koordinat?.lon || 0;

    const jarakText = resData.jarak || '';
    const estimasi = resData.estimasi_waktu || {};

    return (
      <div className="response-layout">
        <div className="response-header">
          <span className="response-status-badge" style={{ backgroundColor: '#4caf50', color: 'var(--black)', fontWeight: 700 }}>
            ✓ DISTANCE CALCULATED SUCCESSFULLY
          </span>
          <h2 className="response-title">
            {dariNama} ➔ {keNama} Route Calculation
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="response-grid-2">
            <div className="response-subcard" style={{ gridColumn: 'span 2', textAlign: 'center', padding: '24px 16px', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid var(--gold)' }}>
              <span className="response-label" style={{ fontSize: '12px', letterSpacing: '2px' }}>TOTAL DISTANCE</span>
              <span style={{ fontSize: '36px', fontWeight: 800, color: 'var(--gold-text)', fontFamily: 'var(--font-mono)', display: 'block', margin: '8px 0' }}>
                {jarakText}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {/* Origin Card */}
            <div style={{
              flex: 1,
              minWidth: '0',
              border: '1px solid var(--border-color)',
              backgroundColor: '#111',
              padding: '16px',
              borderRadius: '4px'
            }}>
              <span className="response-label" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', display: 'block', marginBottom: '10px' }}>ORIGIN (DARI)</span>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--white)', marginBottom: '4px' }}>{dariNama}</div>
              <div style={{ fontSize: '12px', color: 'var(--ash)', lineHeight: '1.5', marginBottom: '12px' }}>{dariLokasi}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold-text)' }}>
                Coordinates: {dariLat}, {dariLon}
              </div>
            </div>

            {/* Destination Card */}
            <div style={{
              flex: 1,
              minWidth: '0',
              border: '1px solid var(--border-color)',
              backgroundColor: '#111',
              padding: '16px',
              borderRadius: '4px'
            }}>
              <span className="response-label" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', display: 'block', marginBottom: '10px' }}>DESTINATION (KE)</span>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--white)', marginBottom: '4px' }}>{keNama}</div>
              <div style={{ fontSize: '12px', color: 'var(--ash)', lineHeight: '1.5', marginBottom: '12px' }}>{keLokasi}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold-text)' }}>
                Coordinates: {keLat}, {keLon}
              </div>
            </div>
          </div>

          {/* Time Estimations */}
          <div style={{
            border: '1px solid var(--border-color)',
            backgroundColor: '#111',
            padding: '16px',
            borderRadius: '4px'
          }}>
            <span className="response-label" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', display: 'block', marginBottom: '14px' }}>TRAVEL TIME ESTIMATION</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '10px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '4px' }}>
                <div style={{ fontSize: '10px', color: 'var(--ash)', textTransform: 'uppercase', fontWeight: 700 }}>Motorcycle</div>
                <div style={{ fontSize: '14px', color: 'var(--white)', fontWeight: 600, marginTop: '4px' }}>{estimasi.motor || '-'}</div>
              </div>
              <div style={{ padding: '10px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '4px' }}>
                <div style={{ fontSize: '10px', color: 'var(--ash)', textTransform: 'uppercase', fontWeight: 700 }}>Car</div>
                <div style={{ fontSize: '14px', color: 'var(--white)', fontWeight: 600, marginTop: '4px' }}>{estimasi.mobil || '-'}</div>
              </div>
              <div style={{ padding: '10px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '4px' }}>
                <div style={{ fontSize: '10px', color: 'var(--ash)', textTransform: 'uppercase', fontWeight: 700 }}>Walking</div>
                <div style={{ fontSize: '14px', color: 'var(--white)', fontWeight: 600, marginTop: '4px' }}>{estimasi.jalan_kaki || '-'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isIpLookup = activeTopic.id === 'iplookup' || activeTopic.id === 'ip';
  if (isIpLookup && resData) {
    const { ip, country, country_code, region, city, latitude, longitude, isp, asn, services } = resData;

    return (
      <div className="response-layout">
        <div className="response-header">
          <span className="response-status-badge" style={{ backgroundColor: '#4caf50', color: 'var(--black)', fontWeight: 700 }}>
            ✓ IP INFORMATION RETRIEVED SUCCESSFULLY
          </span>
          <h2 className="response-title">
            Lookup Result: {ip}
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Main Info Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
              <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>IP ADDRESS</span>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>{ip}</div>
            </div>
            <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
              <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>LOCATION</span>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--white)' }}>
                {city !== 'N/A' && city ? `${city}, ` : ''}{region !== 'N/A' && region ? `${region}, ` : ''}{country || 'N/A'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ash)', marginTop: '4px' }}>ISO Code: {country_code || 'N/A'}</div>
            </div>
            <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
              <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>COORDINATES</span>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>
                {latitude !== null && longitude !== null ? `${latitude}, ${longitude}` : 'N/A'}
              </div>
              {latitude !== null && longitude !== null && (
                <a
                  href={`https://maps.google.com/?q=${latitude},${longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '11px', color: 'var(--gold-text)', textDecoration: 'none', display: 'inline-block', marginTop: '6px', fontWeight: 700 }}
                >
                  VIEW MAP
                </a>
              )}
            </div>
            <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
              <span className="response-label" style={{ display: 'block', marginBottom: '6px' }}>NETWORK PROVIDER (ISP)</span>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--white)' }}>{isp || 'N/A'}</div>
              <div style={{ fontSize: '11px', color: 'var(--ash)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>ASN: {asn || 'N/A'}</div>
            </div>
          </div>

          {/* Database Provider details */}
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: '#111', padding: '16px', borderRadius: '4px' }}>
            <span className="response-label" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', display: 'block', marginBottom: '14px' }}>
              DATA SOURCES ANALYSIS
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              {services && Object.entries(services).map(([key, value]: [string, any]) => {
                if (!value) return null;
                const dbName = key === 'ip2location' ? 'IP2Location' : key === 'ipinfo' ? 'IP Info' : key === 'dbip' ? 'DB IP' : key === 'criminalip' ? 'Criminal IP' : key;
                return (
                  <div key={key} style={{ padding: '12px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '4px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--gold-text)', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #1a1a1a', paddingBottom: '6px', marginBottom: '10px' }}>
                      {dbName}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--ash)' }}>Country:</span>
                        <span style={{ color: 'var(--white)', fontWeight: 600 }}>{value.country_name || 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--ash)' }}>City:</span>
                        <span style={{ color: 'var(--white)', fontWeight: 600 }}>{value.city_name || 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--ash)' }}>Latitude:</span>
                        <span style={{ color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>{value.latitude || 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--ash)' }}>Longitude:</span>
                        <span style={{ color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>{value.longitude || 'N/A'}</span>
                      </div>
                      {key === 'criminalip' ? (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--ash)' }}>VPN:</span>
                            <span style={{ color: value.all?.score?.inbound === 'Safe' ? '#4caf50' : 'red', fontWeight: 600 }}>
                              {value.all?.issues?.is_vpn ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--ash)' }}>Hosting/Cloud:</span>
                            <span style={{ color: 'var(--white)', fontWeight: 600 }}>
                              {value.all?.issues?.is_hosting || value.all?.issues?.is_cloud ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--ash)' }}>Organization:</span>
                          <span style={{ color: 'var(--white)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }} title={value.organization}>
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
        </div>
      </div>
    );
  }

  const isAksaraJawa = activeTopic.id === 'aksara-jawa' || activeTopic.id === 'aksarajawa';
  if (isAksaraJawa && resData) {
    const convertedText = resData.result || '';
    const directionLabel = resData.direction === 'jawa2latin' ? 'Aksara Jawa ➔ Latin' : 'Latin ➔ Aksara Jawa';
    const isJawaOutput = resData.direction !== 'jawa2latin';

    return (
      <div className="response-layout">
        <div className="response-header">
          <span className="response-status-badge" style={{ backgroundColor: 'var(--gold)', color: 'var(--black)' }}>
            ✓ TRANSLITERATION COMPLETED
          </span>
          <h2 className="response-title">
            {activeTopic.title} Result
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="response-grid-2">
            <div className="response-subcard">
              <span className="response-label">CONVERSION DIRECTION</span>
              <span className="response-value-mono" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gold-text)' }}>
                {directionLabel}
              </span>
            </div>
            <div className="response-subcard">
              <span className="response-label">STATUS</span>
              <span className="response-value-mono" style={{ fontSize: '14px', fontWeight: 700, color: '#4caf50' }}>
                SUCCESS
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {/* Transliterated Panel */}
            <div style={{
              flex: 1,
              minWidth: '0',
              border: '1px solid var(--border-color)',
              backgroundColor: '#111',
              padding: '16px',
              borderRadius: '4px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '8px',
                marginBottom: '12px'
              }}>
                <span className="response-label" style={{ margin: 0 }}>TRANSLITERATED RESULT</span>
                <button 
                  onClick={() => copyToClipboard(convertedText)} 
                  className="btn btn-ghost" 
                  style={{ padding: '4px 12px', fontSize: '10px', height: 'auto', minHeight: 'unset' }}
                >
                  COPY
                </button>
              </div>
              <div style={{
                fontFamily: isJawaOutput ? 'var(--font-mono)' : 'var(--font-display)',
                fontSize: isJawaOutput ? '22px' : '14px',
                color: 'var(--white)',
                lineHeight: '1.8',
                minHeight: '80px',
                maxHeight: '200px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                fontWeight: 500
              }}>
                {convertedText}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isTranslate = activeTopic.id === 'translate' || activeTopic.id === 'deepl';
  if (isTranslate && resData) {
    const translatedText = resData.translated || '';
    return (
      <div className="response-layout">
        <div className="response-header">
          <span className="response-status-badge">
            ✓ TRANSLATION COMPLETED
          </span>
          <h2 className="response-title">
            {activeTopic.title} Result
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="response-grid-2">
            <div className="response-subcard">
              <span className="response-label">SOURCE LANGUAGE</span>
              <span className="response-value-mono" style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--gold-text)' }}>
                {resData.from}
              </span>
            </div>
            <div className="response-subcard">
              <span className="response-label">TARGET LANGUAGE</span>
              <span className="response-value-mono" style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase' }}>
                {resData.to}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {/* Translated Panel */}
            <div style={{
              flex: 1,
              minWidth: '0',
              border: '1px solid var(--border-color)',
              backgroundColor: '#111',
              padding: '16px',
              borderRadius: '4px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '8px',
                marginBottom: '12px'
              }}>
                <span className="response-label" style={{ margin: 0 }}>TRANSLATED TEXT</span>
                <button 
                  onClick={() => copyToClipboard(translatedText)} 
                  className="btn btn-ghost" 
                  style={{ padding: '4px 12px', fontSize: '10px', height: 'auto', minHeight: 'unset' }}
                >
                  COPY
                </button>
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '14px',
                color: 'var(--white)',
                lineHeight: '1.6',
                minHeight: '80px',
                maxHeight: '200px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                fontWeight: 500
              }}>
                {translatedText}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isOcr = activeTopic.id === 'ocr';
  if (isOcr && resData) {
    const textContent = resData.text || '';
    const linesCount = resData.lines ? resData.lines.length : 0;
    return (
      <div className="response-layout">
        <div className="response-header">
          <span className="response-status-badge">
            ✓ TEXT EXTRACTED SUCCESSFULLY
          </span>
          <h2 className="response-title">
            {activeTopic.title} Result
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="response-grid-2">
            <div className="response-subcard">
              <span className="response-label">LINES DETECTED</span>
              <span className="response-value-mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gold-text)' }}>
                {linesCount}
              </span>
            </div>
            <div className="response-subcard">
              <span className="response-label">CHARACTER COUNT</span>
              <span className="response-value-mono" style={{ fontSize: '16px', fontWeight: 700 }}>
                {textContent.length}
              </span>
            </div>
          </div>

          <div style={{
            border: '1px solid var(--border-color)',
            backgroundColor: '#111',
            padding: '16px',
            borderRadius: '4px',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '8px',
              marginBottom: '12px'
            }}>
              <span className="response-label" style={{ margin: 0 }}>EXTRACTED TEXT</span>
              <button 
                onClick={() => copyToClipboard(textContent)} 
                className="btn btn-ghost" 
                style={{ padding: '4px 12px', fontSize: '10px', height: 'auto', minHeight: 'unset' }}
              >
                COPY TEXT
              </button>
            </div>
            <pre style={{
              margin: 0,
              padding: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--white)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              maxHeight: '300px',
              overflowY: 'auto',
              backgroundColor: '#0a0a0a',
              border: '1px solid #1a1a1a',
              borderRadius: '2px',
              lineHeight: '1.6'
            }}>
              {textContent || 'No text found.'}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  const isWeb2Zip = activeTopic.id === 'web2zip';
  if (isWeb2Zip) {
    return (
      <div className="response-layout">
        <div className="response-header">
          <span className="response-status-badge">
            ✓ WEBSITE CLONED SUCCESSFULLY
          </span>
          <h2 className="response-title">
            {activeTopic.title} Result
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'start' }}>
          <div style={{
            border: '1px solid var(--border-color)',
            padding: '24px',
            backgroundColor: '#111',
            width: '100%',
            maxWidth: '320px',
            height: '240px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            boxSizing: 'border-box'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--white)', fontWeight: 700, wordBreak: 'break-all', padding: '0 8px' }}>
              {resData.filename}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', color: 'var(--ash)', marginTop: '6px' }}>
              ZIP ARCHIVE GENERATED
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="response-grid-2">
              <div className="response-subcard" style={{ gridColumn: 'span 2' }}>
                <span className="response-label">TARGET URL</span>
                <span className="response-value-mono" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--white)', wordBreak: 'break-all' }}>{resData.url}</span>
              </div>
              <div className="response-subcard">
                <span className="response-label">ZIP SIZE</span>
                <span className="response-value-mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--gold-text)' }}>{resData.size}</span>
              </div>
              <div className="response-subcard">
                <span className="response-label">COPIED FILES</span>
                <span className="response-value-mono" style={{ fontSize: '13px', fontWeight: 700 }}>{resData.copied_files} files</span>
              </div>
            </div>

            <div className="response-list" style={{ marginTop: '10px' }}>
              <span className="response-label">CLONED ZIP LINK</span>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <a href={resData.download} target="_blank" rel="noreferrer" className="btn btn-gold" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', padding: '8px 16px', fontSize: '11px', fontWeight: 700, flex: 1 }}>
                  DOWNLOAD ZIP ARCHIVE
                </a>
                <button onClick={() => copyToClipboard(resData.download)} className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '11px', fontWeight: 700 }}>
                  COPY LINK
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isSplit = activeTopic.id === 'split';
  if (isSplit && resData.slices) {
    const gridCols = resData.cols || 2;
    const gridRows = resData.rows || 2;
    return (
      <div className="response-layout">
        <div className="response-header">
          <span className="response-status-badge">
            ✓ IMAGE SPLIT SUCCESSFUL
          </span>
          <h2 className="response-title">
            Split Image Grid ({gridCols}x{gridRows})
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'start' }}>
          {/* Grid representation */}
          <div style={{ flexShrink: 1, width: '100%', maxWidth: '340px' }}>
            <span className="response-label" style={{ marginBottom: '8px' }}>
              SPLIT PIECES PREVIEW (CLICK TO ENLARGE)
            </span>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
              gap: '4px',
              border: '1px solid var(--border-color)',
              padding: '8px',
              backgroundColor: 'var(--black)',
              backgroundImage: 'linear-gradient(45deg, #151515 25%, transparent 25%), linear-gradient(-45deg, #151515 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #151515 75%), linear-gradient(-45deg, transparent 75%, #151515 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              width: '100%',
              maxWidth: '340px'
            }}>
              {resData.slices.map((slice: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    border: '1px dashed var(--gold)',
                    overflow: 'hidden',
                    aspectRatio: `${slice.width} / ${slice.height}`,
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open(slice.url, '_blank')}
                  title={`Slice ${slice.row + 1}, ${slice.col + 1} (${slice.width}x${slice.height}px)`}
                >
                  <img
                    src={slice.url}
                    referrerPolicy="no-referrer"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    color: 'var(--gold-text)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '8px',
                    padding: '1px 3px'
                  }}>
                    R{slice.row + 1} C{slice.col + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slices list with links */}
          <div className="response-list" style={{ flex: 1, minWidth: '0' }}>
            <span className="response-label">
              DOWNLOAD INDIVIDUAL PARTS
            </span>
            <div className="response-scroll-container" style={{ maxHeight: '320px' }}>
              {resData.slices.map((slice: any, idx: number) => (
                <div key={idx} className="response-item" style={{ justifyContent: 'space-between', padding: '8px 12px' }}>
                  <span className="response-value-mono" style={{ fontSize: '11px' }}>
                    Part {idx + 1} (R{slice.row + 1}, C{slice.col + 1}) - {slice.width}x{slice.height}px
                  </span>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <a
                      href={slice.url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-gold"
                      style={{ textDecoration: 'none', padding: '4px 8px', fontSize: '9px', fontWeight: 700 }}
                    >
                      DOWNLOAD
                    </a>
                    <button
                      onClick={() => copyToClipboard(slice.url)}
                      className="btn btn-ghost"
                      style={{ padding: '4px 8px', fontSize: '9px', fontWeight: 700 }}
                    >
                      COPY
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = resData.url || resData.image;

  const isUpscale = activeTopic.id === 'upscale';
  const isSepia = activeTopic.id === 'sepia';
  const isInvert = activeTopic.id === 'invert';
  const isFlip = activeTopic.id === 'flip';
  const isPixelate = activeTopic.id === 'pixelate';
  const isRound = activeTopic.id === 'round-corners';
  const isNoise = activeTopic.id === 'add-noise';
  const isBlur = activeTopic.id === 'blur';
  const isSharpen = activeTopic.id === 'sharpen';
  const isSolarize = activeTopic.id === 'solarize';
  const isGlow = activeTopic.id === 'glow';
  const isPosterize = activeTopic.id === 'posterize';
  const isBlurFace = activeTopic.id === 'blurface';
  const isEnhance = activeTopic.id === 'enhance';
  const isQR = activeTopic.category === 'QR Tools';
  const isAIImage = activeTopic.category === 'AI Image';
  const isAIEdit = activeTopic.category === 'AI Image Edit';
  const isTools = activeTopic.category === 'Tools';
  const isBase64ToImage = activeTopic.id === 'base64-to-image';

  let badgeText = '✓ BACKGROUND REMOVED';
  if (isUpscale) badgeText = '✓ IMAGE UPSCALED';
  if (isSepia) badgeText = '✓ SEPIA FILTER APPLIED';
  if (isInvert) badgeText = '✓ COLORS INVERTED';
  if (isFlip) badgeText = '✓ IMAGE FLIPPED';
  if (isPixelate) badgeText = '✓ RETRO PIXELATION APPLIED';
  if (isRound) badgeText = '✓ CORNERS ROUNDED';
  if (isNoise) badgeText = '✓ NOISE FILTER APPLIED';
  if (isBlur) badgeText = '✓ IMAGE BLURRED';
  if (isSharpen) badgeText = '✓ IMAGE SHARPENED';
  if (isSolarize) badgeText = '✓ SOLARIZE EFFECT APPLIED';
  if (isGlow) badgeText = '✓ GLOW EFFECT APPLIED';
  if (isPosterize) badgeText = '✓ POSTERIZE EFFECT APPLIED';
  if (isBlurFace) badgeText = '✓ FACES BLURRED';
  if (isEnhance) badgeText = '✓ IMAGE ENHANCED';
  if (isQR) badgeText = '✓ QR CODE GENERATED';
  if (isAIImage) badgeText = '✓ AI IMAGE GENERATED';
  if (isAIEdit) badgeText = '✓ IMAGE EDITED SUCCESSFULLY';
  if (isTools) badgeText = '✓ WEBSITE SCREENSHOT CAPTURED';
  if (isBase64ToImage) badgeText = '✓ BASE64 IMAGE DECODED';

  let downloadText = 'DOWNLOAD TRANSPARENT IMAGE';
  if (isUpscale) downloadText = 'DOWNLOAD UPSCALED IMAGE';
  if (isSepia) downloadText = 'DOWNLOAD SEPIA IMAGE';
  if (isInvert) downloadText = 'DOWNLOAD INVERTED IMAGE';
  if (isFlip) downloadText = 'DOWNLOAD FLIPPED IMAGE';
  if (isPixelate) downloadText = 'DOWNLOAD PIXELATED IMAGE';
  if (isRound) downloadText = 'DOWNLOAD ROUNDED IMAGE';
  if (isNoise) downloadText = 'DOWNLOAD NOISED IMAGE';
  if (isBlur) downloadText = 'DOWNLOAD BLURRED IMAGE';
  if (isSharpen) downloadText = 'DOWNLOAD SHARPENED IMAGE';
  if (isSolarize) downloadText = 'DOWNLOAD SOLARIZED IMAGE';
  if (isGlow) downloadText = 'DOWNLOAD GLOW IMAGE';
  if (isPosterize) downloadText = 'DOWNLOAD POSTERIZED IMAGE';
  if (isBlurFace) downloadText = 'DOWNLOAD FACE BLURRED IMAGE';
  if (isEnhance) downloadText = 'DOWNLOAD ENHANCED IMAGE';
  if (isQR) downloadText = 'DOWNLOAD QR CODE';
  if (isAIImage) downloadText = 'DOWNLOAD GENERATED IMAGE';
  if (isAIEdit) downloadText = 'DOWNLOAD EDITED IMAGE';
  if (isTools) downloadText = 'DOWNLOAD SCREENSHOT';
  if (isBase64ToImage) downloadText = 'DOWNLOAD DECODED IMAGE';

  const showGridBg = !isUpscale && !isSepia && !isInvert && !isFlip && !isPixelate && !isRound && !isNoise && !isBlur && !isSharpen && !isSolarize && !isGlow && !isPosterize && !isBlurFace && !isEnhance && !isQR && !isAIImage && !isAIEdit && !isTools && !isBase64ToImage;
  const previewAlt = isUpscale ? 'Upscaled Preview' : isSepia ? 'Sepia Filter Preview' : isInvert ? 'Inverted Colors Preview' : isFlip ? 'Flipped Image Preview' : isPixelate ? 'Pixelated Preview' : isRound ? 'Rounded Corners Preview' : isNoise ? 'Noise Applied Preview' : isBlur ? 'Blurred Image Preview' : isSharpen ? 'Sharpened Image Preview' : isSolarize ? 'Solarized Preview' : isGlow ? 'Glow Preview' : isPosterize ? 'Posterized Preview' : isBlurFace ? 'Face Blurred Preview' : isEnhance ? 'Enhanced Image Preview' : isQR ? 'QR Code Preview' : isAIImage ? 'AI Generated Image' : isAIEdit ? 'Edited Image Preview' : isTools ? 'Website Screenshot Preview' : isBase64ToImage ? 'Decoded Base64 Image Preview' : 'Transparent Background Preview';

  return (
    <div className="response-layout">
      <div className="response-header">
        <span className="response-status-badge">
          {badgeText}
        </span>
        <h2 className="response-title">
          {activeTopic.title} Result
        </h2>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'start' }}>
        {imageUrl && (
          <div style={{
            border: '1px solid var(--border-color)',
            padding: '8px',
            backgroundColor: showGridBg ? 'var(--black)' : '#111',
            backgroundImage: showGridBg ? 'linear-gradient(45deg, #151515 25%, transparent 25%), linear-gradient(-45deg, #151515 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #151515 75%), linear-gradient(-45deg, transparent 75%, #151515 75%)' : 'none',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            width: '100%',
            maxWidth: '320px',
            boxSizing: 'border-box'
          }}>
            <img src={imageUrl} referrerPolicy="no-referrer" alt={previewAlt} style={{ width: '100%', maxWidth: '320px', maxHeight: '320px', display: 'block', objectFit: 'contain' }} />
          </div>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="response-grid-2">
            {resData.width && resData.height && (
              <div className="response-subcard" style={{ gridColumn: 'span 2' }}>
                <span className="response-label">DIMENSIONS</span>
                <span className="response-value-mono" style={{ fontSize: '13px', fontWeight: 700 }}>{resData.width} x {resData.height} px</span>
              </div>
            )}
            {resData.aspect_ratio && (
              <div className="response-subcard">
                <span className="response-label">ASPECT RATIO</span>
                <span className="response-value-mono" style={{ fontSize: '13px', fontWeight: 700 }}>{resData.aspect_ratio}</span>
              </div>
            )}
            {resData.seed !== undefined && (
              <div className="response-subcard">
                <span className="response-label">SEED</span>
                <span className="response-value-mono" style={{ fontSize: '13px', fontWeight: 700 }}>{resData.seed}</span>
              </div>
            )}
          </div>

          {imageUrl && (
            <div className="response-list" style={{ marginTop: '10px' }}>
              <span className="response-label">OUTPUT LINK</span>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <a href={imageUrl} target="_blank" rel="noreferrer" className="btn btn-gold" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', padding: '8px 16px', fontSize: '11px', fontWeight: 700, flex: 1 }}>
                  {downloadText}
                </a>
                <button onClick={() => copyToClipboard(imageUrl)} className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '11px', fontWeight: 700 }}>
                  COPY LINK
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
