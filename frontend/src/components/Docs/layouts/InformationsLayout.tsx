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

  return (
    <div className="response-layout">
      <div className="response-header">
        <span className="response-status-badge">
          ✓ RESPONSE PROCESSED
        </span>
        <h2 className="response-title">
          {activeTopic.title} Results
        </h2>
      </div>

      {activeTopic.id === 'weather' && renderWeather()}
      {activeTopic.id === 'kodepos' && renderKodepos()}
      {activeTopic.id === 'jadwal-tv' && renderJadwalTV()}
      {activeTopic.id === 'jadwal-bola' && renderJadwalBola()}
    </div>
  );
}
