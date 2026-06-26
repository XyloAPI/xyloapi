import type { DocTopic } from '../types';

interface BMKGLayoutProps {
  activeTopic: DocTopic;
  resData: any;
}

export default function BMKGLayout({ activeTopic, resData }: BMKGLayoutProps) {
  const isTerkini = resData.type === 'gempa-terkini';
  const gempaList = isTerkini ? [resData.gempa] : (resData.gempa || []);

  const getMagnitudeColor = (magStr: string) => {
    try {
      const mag = parseFloat(magStr);
      if (mag >= 6.0) return 'var(--red-pulse, #ff4d4d)';
      if (mag >= 5.0) return 'var(--gold, #ffaa00)';
      return 'var(--cyan-pulse, #00d2ff)';
    } catch {
      return 'var(--gold, #ffaa00)';
    }
  };

  return (
    <div className="response-layout">
      <div className="response-header">
        <span className="response-status-badge">
          ✓ DATA RETRIEVED SUCCESSFULLY
        </span>
        <h2 className="response-title">
          {activeTopic.title} - BMKG Indonesia
        </h2>
      </div>

      {isTerkini && resData.gempa && (
        <div className="response-card" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'start' }}>
            {resData.gempa.shakemap && (
              <div style={{ flexShrink: 0, border: '1px solid var(--border-color)', padding: '6px', backgroundColor: 'var(--black)' }}>
                <img
                  src={resData.gempa.shakemap}
                  alt="BMKG Shakemap"
                  style={{ maxWidth: '280px', width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }}
                />
              </div>
            )}
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div 
                  className="magnitude-badge-large"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: `2px solid ${getMagnitudeColor(resData.gempa.magnitude)}`
                  }}
                >
                  {resData.gempa.magnitude}
                </div>
                <div>
                  <span className="response-label" style={{ marginBottom: '2px' }}>MAGNITUDE</span>
                  <h3 className="response-title" style={{ fontSize: '16px', margin: 0 }}>
                    {resData.gempa.potensi || 'Gempa Bumi'}
                  </h3>
                </div>
              </div>

              <div className="response-grid-2" style={{ marginTop: '8px' }}>
                <div className="response-subcard">
                  <span className="response-label">TIME</span>
                  <span className="response-value-mono" style={{ fontSize: '12px', fontWeight: 600 }}>{resData.gempa.tanggal} - {resData.gempa.jam}</span>
                </div>
                <div className="response-subcard">
                  <span className="response-label">DEPTH</span>
                  <span className="response-value-mono" style={{ fontSize: '12px', fontWeight: 600 }}>{resData.gempa.kedalaman}</span>
                </div>
                <div className="response-subcard" style={{ gridColumn: 'span 2' }}>
                  <span className="response-label">LOCATION</span>
                  <span className="response-value" style={{ fontSize: '12px', fontWeight: 600 }}>{resData.gempa.wilayah}</span>
                </div>
                <div className="response-subcard">
                  <span className="response-label">COORDINATES</span>
                  <span className="response-value-mono" style={{ fontSize: '11px', fontWeight: 600 }}>{resData.gempa.coordinates} ({resData.gempa.lintang}, {resData.gempa.bujur})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isTerkini && gempaList.length > 0 && (
        <div className="response-list">
          <span className="response-label" style={{ color: 'var(--ash)' }}>
            RECENT EARTHQUAKE LOGS ({resData.total || gempaList.length})
          </span>
          <div className="response-scroll-container">
            {gempaList.map((g: any, idx: number) => (
              <div key={idx} className="response-item">
                <div 
                  className="magnitude-badge"
                  style={{
                    border: `2px solid ${getMagnitudeColor(g.magnitude)}`
                  }}
                >
                  {g.magnitude}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--white)', margin: '0 0 4px 0', textTransform: 'none', letterSpacing: 'normal' }}>
                    {g.wilayah}
                  </h4>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--ash)', fontFamily: 'var(--font-mono)' }}>
                    <span>Depth: <strong>{g.kedalaman}</strong></span>
                    <span>•</span>
                    <span>Time: <strong>{g.tanggal} {g.jam}</strong></span>
                    {g.dirasakan && (
                      <>
                        <span>•</span>
                        <span style={{ color: 'var(--gold-text)' }}>Felt: <strong>{g.dirasakan}</strong></span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
