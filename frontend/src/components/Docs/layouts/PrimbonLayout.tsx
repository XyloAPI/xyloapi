import type { DocTopic } from '../types';

interface PrimbonLayoutProps {
  activeTopic: DocTopic;
  resData: any;
}

export default function PrimbonLayout({ activeTopic, resData }: PrimbonLayoutProps) {
  if (!resData) return null;

  // Render Tafsir Mimpi Layout
  if (activeTopic.id === 'tafsir-mimpi') {
    const query = resData.mimpi || '';
    const hasil = resData.hasil || [];
    const hasResults = hasil.length > 0;

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
            <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>KATA KUNCI MIMPI</span>
            <span className="response-value-mono" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--white)', marginTop: '4px', textTransform: 'capitalize' }}>
              "{query}"
            </span>
          </div>

          {hasResults ? (
            <div className="response-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span className="response-label" style={{ color: 'var(--ash)' }}>
                HASIL TAFSIR MIMPI ({hasil.length})
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {hasil.map((item: any, idx: number) => (
                  <div key={idx} style={{
                    padding: '16px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gold, #ffaa00)' }}>
                      {item.mimpi}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--white)', lineHeight: '1.5' }}>
                      {item.arti || 'Tidak ada arti spesifik yang tercantum.'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              padding: '24px',
              textAlign: 'center',
              border: '1px dashed var(--border-color)',
              borderRadius: '4px',
              color: 'var(--ash)',
              fontSize: '13px'
            }}>
              {resData.message || `Tidak ditemukan tafsir mimpi untuk kata kunci "${query}".`}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Arti Nama Layout
  if (activeTopic.id === 'arti-nama') {
    const nama = resData.nama || '';
    const arti = resData.arti || '';
    const catatan = resData.catatan || '';

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
            <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>NAMA YANG DICARI</span>
            <span className="response-value-mono" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--white)', marginTop: '4px', textTransform: 'capitalize' }}>
              {nama}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              padding: '16px',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>ARTI NAMA</span>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gold, #ffaa00)', lineHeight: '1.5' }}>
                {arti || 'Tidak ditemukan arti untuk nama ini.'}
              </span>
            </div>

            {catatan && (
              <div style={{
                padding: '16px',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>KARAKTER & KEPRIBADIAN</span>
                <span style={{ fontSize: '13px', color: 'var(--white)', lineHeight: '1.6' }}>
                  {catatan}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render Kecocokan Nama Layout
  if (activeTopic.id === 'kecocokan-nama') {
    const {
      nama = '',
      tgl_lahir = '',
      life_path_number = '',
      destiny_number = '',
      hearts_desire_number = '',
      personality_number = '',
      kecocokan = [],
      rata_rata = '',
      catatan = ''
    } = resData;

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Main Info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>NAMA</span>
              <span className="response-value-mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--white)', marginTop: '4px', textTransform: 'capitalize' }}>
                {nama}
              </span>
            </div>
            <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>TANGGAL LAHIR</span>
              <span className="response-value-mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gold, #ffaa00)', marginTop: '4px' }}>
                {tgl_lahir}
              </span>
            </div>
          </div>

          {/* Numerology Numbers Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
            <div className="response-subcard" style={{ padding: '12px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.01)', textAlign: 'center' }}>
              <span className="response-label" style={{ fontSize: '9px' }}>LIFE PATH</span>
              <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--white)', display: 'block', margin: '4px 0' }}>{life_path_number}</span>
            </div>
            <div className="response-subcard" style={{ padding: '12px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.01)', textAlign: 'center' }}>
              <span className="response-label" style={{ fontSize: '9px' }}>DESTINY</span>
              <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--white)', display: 'block', margin: '4px 0' }}>{destiny_number}</span>
            </div>
            <div className="response-subcard" style={{ padding: '12px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.01)', textAlign: 'center' }}>
              <span className="response-label" style={{ fontSize: '9px' }}>HEART'S DESIRE</span>
              <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--white)', display: 'block', margin: '4px 0' }}>{hearts_desire_number}</span>
            </div>
            <div className="response-subcard" style={{ padding: '12px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.01)', textAlign: 'center' }}>
              <span className="response-label" style={{ fontSize: '9px' }}>PERSONALITY</span>
              <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--white)', display: 'block', margin: '4px 0' }}>{personality_number}</span>
            </div>
          </div>

          {/* Compatibility Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '10px' }}>
            {/* Compatibility Aspects */}
            <div style={{ border: '1px solid var(--border-color)', padding: '16px', backgroundColor: 'rgba(0,0,0,0.1)' }}>
              <span className="response-label" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', display: 'block', marginBottom: '12px' }}>ASPEK KECOCOKAN</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {kecocokan && kecocokan.map((item: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--ash)' }}>{item.aspek}</span>
                    <span style={{ color: 'var(--white)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{item.persentase}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Score Rata-rata */}
            <div style={{ border: '1px solid var(--border-color)', padding: '16px', backgroundColor: 'rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', letterSpacing: '1px' }}>RATA-RATA KECOCOKAN</span>
              <span style={{ fontSize: '42px', fontWeight: 800, color: 'var(--gold, #ffaa00)', fontFamily: 'var(--font-mono)', margin: '8px 0' }}>
                {rata_rata}
              </span>
              {catatan && (
                <span style={{ fontSize: '11px', color: 'var(--ash)', textAlign: 'center', lineHeight: '1.4' }}>
                  {catatan}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Kecocokan Nama Pasangan Layout
  if (activeTopic.id === 'nama-pasangan') {
    const {
      nama_anda = '',
      nama_pasangan = '',
      sisi_positif = '',
      sisi_negatif = '',
      deskripsi = ''
    } = resData;

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Couple profiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', alignItems: 'center' }}>
            {/* Person 1 */}
            <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)', textAlign: 'center' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>PIHAK PERTAMA</span>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--white)', margin: '4px 0 2px 0', textTransform: 'capitalize' }}>
                {nama_anda}
              </h3>
            </div>

            {/* Connection SVG */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', userSelect: 'none' }}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="#ff4d4d" 
                width="32" 
                height="32"
                style={{ 
                  filter: 'drop-shadow(0 0 8px rgba(255, 77, 77, 0.6))',
                  display: 'block'
                }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>

            {/* Person 2 */}
            <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)', textAlign: 'center' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>PIHAK KEDUA</span>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--white)', margin: '4px 0 2px 0', textTransform: 'capitalize' }}>
                {nama_pasangan}
              </h3>
            </div>
          </div>

          {/* Sisi Positif / Negatif */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', border: '1px solid rgba(0, 210, 255, 0.2)', backgroundColor: 'rgba(0, 210, 255, 0.02)', borderRadius: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#00d2ff', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>SISI POSITIF ANDA</span>
              <span style={{ fontSize: '13px', color: 'var(--white)', lineHeight: '1.5' }}>
                {sisi_positif || '-'}
              </span>
            </div>
            <div style={{ padding: '16px', border: '1px solid rgba(255, 77, 77, 0.2)', backgroundColor: 'rgba(255, 77, 77, 0.02)', borderRadius: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#ff4d4d', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>SISI NEGATIF ANDA</span>
              <span style={{ fontSize: '13px', color: 'var(--white)', lineHeight: '1.5' }}>
                {sisi_negatif || '-'}
              </span>
            </div>
          </div>

          {/* Description / Analysis */}
          {deskripsi && (
            <div style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>ANALISIS KECOCOKAN</span>
              <span style={{ fontSize: '13.5px', color: 'var(--smoke)', lineHeight: '1.6' }}>
                {deskripsi}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Tanggal Jadian Layout
  if (activeTopic.id === 'tanggal-jadian') {
    const {
      tanggal = '',
      karakteristik = '',
      deskripsi = ''
    } = resData;

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Main Info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>TANGGAL JADIAN / PERNIKAHAN</span>
              <span className="response-value-mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gold, #ffaa00)', marginTop: '4px' }}>
                {tanggal}
              </span>
            </div>
            <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>KARAKTERISTIK HUBUNGAN</span>
              <span className="response-value-mono" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--white)', marginTop: '4px' }}>
                {karakteristik || '-'}
              </span>
            </div>
          </div>

          {/* Description / Analysis */}
          {deskripsi && (
            <div style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>PENJELASAN RAMALAN</span>
              <span style={{ fontSize: '13.5px', color: 'var(--smoke)', lineHeight: '1.6' }}>
                {deskripsi}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Sifat Usaha Layout
  if (activeTopic.id === 'sifat-usaha') {
    const {
      hari_lahir = '',
      tanggal = '',
      deskripsi = ''
    } = resData;

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Main Info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>HARI LAHIR &amp; WETON</span>
              <span className="response-value-mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gold, #ffaa00)', marginTop: '4px' }}>
                {hari_lahir}
              </span>
            </div>
            {tanggal && (
              <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>TANGGAL LAHIR</span>
                <span className="response-value-mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--white)', marginTop: '4px' }}>
                  {tanggal}
                </span>
              </div>
            )}
          </div>

          {/* Description / Analysis */}
          {deskripsi && (
            <div style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>REKOMENDASI &amp; KARAKTER USAHA</span>
              <span style={{ fontSize: '13.5px', color: 'var(--smoke)', lineHeight: '1.6' }}>
                {deskripsi}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Rejeki Hoki Layout
  if (activeTopic.id === 'rejeki-hoki') {
    const {
      hari_lahir = '',
      tanggal = '',
      deskripsi = '',
      chart_image = ''
    } = resData;

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Main Info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>HARI LAHIR &amp; WETON</span>
              <span className="response-value-mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gold, #ffaa00)', marginTop: '4px' }}>
                {hari_lahir}
              </span>
            </div>
            {tanggal && (
              <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>TANGGAL LAHIR</span>
                <span className="response-value-mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--white)', marginTop: '4px' }}>
                  {tanggal}
                </span>
              </div>
            )}
          </div>

          {/* Description / Analysis */}
          {deskripsi && (
            <div style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>RAMALAN HOKI</span>
              <span style={{ fontSize: '13.5px', color: 'var(--smoke)', lineHeight: '1.6' }}>
                {deskripsi}
              </span>
            </div>
          )}

          {/* Chart Image */}
          {chart_image && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid var(--border-color)', padding: '16px', backgroundColor: 'rgba(0,0,0,0.1)' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', letterSpacing: '0.5px' }}>SIKLUS &amp; FLUKTUASI REJEKI (PAL SRIGATI)</span>
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '6px' }}>
                <img 
                  src={chart_image} 
                  alt="Siklus Rejeki Pal Srigati" 
                  style={{ 
                    maxWidth: '100%', 
                    height: 'auto', 
                    borderRadius: '4px', 
                    border: '1px solid var(--border-color)',
                    filter: 'brightness(0.9) contrast(1.1)' 
                  }} 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Pekerjaan Cocok Layout
  if (activeTopic.id === 'pekerjaan-cocok') {
    const {
      hari_lahir = '',
      tanggal = '',
      deskripsi = ''
    } = resData;

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Main Info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>HARI LAHIR &amp; WETON</span>
              <span className="response-value-mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gold, #ffaa00)', marginTop: '4px' }}>
                {hari_lahir}
              </span>
            </div>
            {tanggal && (
              <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>TANGGAL LAHIR</span>
                <span className="response-value-mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--white)', marginTop: '4px' }}>
                  {tanggal}
                </span>
              </div>
            )}
          </div>

          {/* Description / Analysis */}
          {deskripsi && (
            <div style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>REKOMENDASI PEKERJAAN</span>
              <span style={{ fontSize: '13.5px', color: 'var(--smoke)', lineHeight: '1.6' }}>
                {deskripsi}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Ramalan Pitagoras Layout
  if (activeTopic.id === 'ramalan-pitagoras') {
    const {
      tanggal_lahir = '',
      angka_akar_title = '',
      angka_akar_val = '',
      sisi_negatif = '',
      bisnis_insight = '',
      elemen = '',
      rekomendasi_arah = [],
      kombinasi_angka = [],
      tetraktys_table = []
    } = resData;

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Top Grid: Weton & Element */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>TANGGAL LAHIR</span>
              <span className="response-value-mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--white)', marginTop: '4px' }}>
                {tanggal_lahir}
              </span>
            </div>
            {elemen && (
              <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>ELEMEN PITAGORAS</span>
                <span className="response-value-mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gold, #ffaa00)', marginTop: '4px' }}>
                  {elemen}
                </span>
              </div>
            )}
          </div>

          {/* Holy Tetraktys Table */}
          {tetraktys_table && tetraktys_table.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '20px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '4px' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', letterSpacing: '0.5px', marginBottom: '8px' }}>THE HOLY TETRAKTYS DIAGRAM</span>
              <div style={{ overflowX: 'auto', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: '15px', color: 'var(--white)', minWidth: '280px' }}>
                  <tbody>
                    {tetraktys_table.map((row: any[], rIdx: number) => (
                      <tr key={rIdx}>
                        {row.map((cell: any, cIdx: number) => {
                          const isDivider = cell.bgcolor === '#000000';
                          const style: React.CSSProperties = {
                            padding: cell.height === '2' ? '0' : '6px 8px',
                            textAlign: cell.align || 'center',
                            minWidth: cell.width === '2' ? '2px' : 'auto',
                            height: cell.height === '2' ? '2px' : 'auto',
                            backgroundColor: isDivider ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                            color: cell.text.includes('The Holy Tetraktys') ? 'var(--gold, #ffaa00)' : 'var(--white)',
                            whiteSpace: 'pre-line',
                            lineHeight: '1.4'
                          };
                          
                          return (
                            <td 
                              key={cIdx} 
                              colSpan={cell.colspan} 
                              rowSpan={cell.rowspan}
                              style={style}
                            >
                              {cell.text}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Root Number Card */}
          {(angka_akar_title || angka_akar_val) && (
            <div style={{ padding: '18px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span className="response-label" style={{ fontSize: '11px', color: 'var(--gold, #ffaa00)', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                  {angka_akar_title ? angka_akar_title.toUpperCase() : 'ANGKA AKAR'}
                </span>
              </div>
              
              {angka_akar_val && (
                <div>
                  <span className="response-label" style={{ fontSize: '9px', color: 'var(--ash)', display: 'block', marginBottom: '2px' }}>SISI POSITIF &amp; KARAKTER</span>
                  <span style={{ fontSize: '13.5px', color: 'var(--smoke)', lineHeight: '1.6' }}>
                    {angka_akar_val}
                  </span>
                </div>
              )}

              {sisi_negatif && (
                <div style={{ marginTop: '6px' }}>
                  <span className="response-label" style={{ fontSize: '9px', color: 'var(--ash)', display: 'block', marginBottom: '2px' }}>SISI NEGATIF</span>
                  <span style={{ fontSize: '13.5px', color: '#ff6666', lineHeight: '1.6' }}>
                    {sisi_negatif}
                  </span>
                </div>
              )}

              {bisnis_insight && (
                <div style={{ marginTop: '6px', fontStyle: 'italic', borderLeft: '2px solid var(--gold)', paddingLeft: '10px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--ash)' }}>
                    "{bisnis_insight}"
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Rekomendasi Profesi & Bisnis (Unsur) */}
          {rekomendasi_arah && rekomendasi_arah.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', letterSpacing: '0.5px' }}>PILIHAN KARIR &amp; BISNIS YANG COCOK</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {rekomendasi_arah.map((r: any, idx: number) => (
                  <div key={idx} style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.15)', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--gold, #ffaa00)' }}>UNSUR {r.unsur}</span>
                    {r.profesi && (
                      <div>
                        <span style={{ fontSize: '10px', color: 'var(--ash)', display: 'block', fontWeight: 600 }}>PROFESI</span>
                        <span style={{ fontSize: '13px', color: 'var(--smoke)' }}>{r.profesi}</span>
                      </div>
                    )}
                    {r.bisnis && (
                      <div>
                        <span style={{ fontSize: '10px', color: 'var(--ash)', display: 'block', fontWeight: 600 }}>BISNIS</span>
                        <span style={{ fontSize: '13px', color: 'var(--smoke)' }}>{r.bisnis}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Kombinasi Angka */}
          {kombinasi_angka && kombinasi_angka.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', letterSpacing: '0.5px' }}>ANALISIS ANGKA &amp; KOMBINASI</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {kombinasi_angka.map((c: any, idx: number) => (
                  <div key={idx} style={{ padding: '12px 16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.01)', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--white)' }}>{c.kombinasi}</span>
                    <span style={{ fontSize: '13px', color: 'var(--smoke)', lineHeight: '1.5' }}>{c.deskripsi}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Potensi Penyakit Layout
  if (activeTopic.id === 'potensi-penyakit') {
    const {
      tanggal_lahir = '',
      sektor_analisa = [],
      penjelasan_potensi = '',
      potensi_penyakit = [],
      catatan = '',
      tetraktys_table = []
    } = resData;

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Top Grid: Weton */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>TANGGAL LAHIR</span>
              <span className="response-value-mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--white)', marginTop: '4px' }}>
                {tanggal_lahir}
              </span>
            </div>
          </div>

          {/* Holy Tetraktys Table */}
          {tetraktys_table && tetraktys_table.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '20px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '4px' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', letterSpacing: '0.5px', marginBottom: '8px' }}>THE HOLY TETRAKTYS DIAGRAM</span>
              <div style={{ overflowX: 'auto', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: '15px', color: 'var(--white)', minWidth: '280px' }}>
                  <tbody>
                    {tetraktys_table.map((row: any[], rIdx: number) => (
                      <tr key={rIdx}>
                        {row.map((cell: any, cIdx: number) => {
                          const isDivider = cell.bgcolor === '#000000';
                          const style: React.CSSProperties = {
                            padding: cell.height === '2' ? '0' : '6px 8px',
                            textAlign: cell.align || 'center',
                            minWidth: cell.width === '2' ? '2px' : 'auto',
                            height: cell.height === '2' ? '2px' : 'auto',
                            backgroundColor: isDivider ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                            color: cell.text.includes('The Holy Tetraktys') ? 'var(--gold, #ffaa00)' : 'var(--white)',
                            whiteSpace: 'pre-line',
                            lineHeight: '1.4'
                          };
                          
                          return (
                            <td 
                              key={cIdx} 
                              colSpan={cell.colspan} 
                              rowSpan={cell.rowspan}
                              style={style}
                            >
                              {cell.text}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sektor yg dianalisa */}
          {sektor_analisa && sektor_analisa.length > 0 && (
            <div style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', letterSpacing: '0.5px' }}>SEKTOR YANG DIANALISA</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '4px' }}>
                {sektor_analisa.map((s: string, idx: number) => (
                  <div key={idx} style={{ padding: '8px 14px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)', fontFamily: 'monospace', fontSize: '13px', color: 'var(--gold, #ffaa00)', borderRadius: '4px' }}>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Penjelasan potensi & Daftar Penyakit */}
          {(penjelasan_potensi || (potensi_penyakit && potensi_penyakit.length > 0)) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {penjelasan_potensi && (
                <span style={{ fontSize: '13.5px', color: 'var(--smoke)', lineHeight: '1.5' }}>
                  {penjelasan_potensi}
                </span>
              )}
              {potensi_penyakit && potensi_penyakit.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {potensi_penyakit.map((p: any, idx: number) => (
                    <div key={idx} style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#ff6666' }}>ELEMEN {p.elemen}</span>
                      <span style={{ fontSize: '13px', color: 'var(--smoke)', lineHeight: '1.6' }}>{p.deskripsi}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Catatan / Warning */}
          {catatan && (
            <div style={{ padding: '14px', border: '1px solid rgba(255, 170, 0, 0.2)', backgroundColor: 'rgba(255, 170, 0, 0.02)', borderRadius: '4px' }}>
              <span style={{ fontSize: '12.5px', color: 'var(--ash)', lineHeight: '1.5', display: 'block', fontStyle: 'italic' }}>
                {catatan}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Simbol Tarot Layout
  if (activeTopic.id === 'simbol-tarot') {
    const {
      tanggal_lahir = '',
      kartu_tarot = '',
      image_url = '',
      deskripsi = ''
    } = resData;

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Top Weton subcard */}
          <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)', width: 'fit-content', minWidth: '200px' }}>
            <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>TANGGAL LAHIR</span>
            <span className="response-value-mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--white)', marginTop: '4px' }}>
              {tanggal_lahir}
            </span>
          </div>

          {/* Main Content Area */}
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}>
            {/* Tarot Image */}
            {image_url && (
              <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                <img 
                  src={image_url} 
                  alt={kartu_tarot} 
                  style={{
                    width: '150px',
                    height: 'auto',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    backgroundColor: 'rgba(255,255,255,0.05)'
                  }} 
                />
              </div>
            )}

            {/* Title & Description */}
            <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {kartu_tarot && (
                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', display: 'block', marginBottom: '2px' }}>KARTU TAROT ANDA</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--gold, #ffaa00)' }}>
                    {kartu_tarot}
                  </span>
                </div>
              )}
              {deskripsi && (
                <div>
                  <span className="response-label" style={{ fontSize: '9px', color: 'var(--ash)', display: 'block', marginBottom: '4px' }}>MAKNA &amp; JALAN HIDUP</span>
                  <span style={{ fontSize: '14.5px', color: 'var(--smoke)', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                    {deskripsi}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Ramalan Kartu Lenormand Layout
  if (activeTopic.id === 'ramalan-kartu') {
    const {
      nama = '',
      ringkasan = '',
      total_kartu = 0,
      kartu = []
    } = resData;

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Top: Nama & Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
            {nama && (
              <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>NAMA</span>
                <span className="response-value-mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--white)', marginTop: '4px' }}>
                  {nama}
                </span>
              </div>
            )}
            {total_kartu > 0 && (
              <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>TOTAL KARTU</span>
                <span className="response-value-mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gold, #ffaa00)', marginTop: '4px' }}>
                  {total_kartu} kartu
                </span>
              </div>
            )}
          </div>

          {/* Ringkasan */}
          {ringkasan && (
            <div style={{ padding: '14px', border: '1px solid rgba(255, 170, 0, 0.2)', backgroundColor: 'rgba(255, 170, 0, 0.02)', borderRadius: '4px' }}>
              <span style={{ fontSize: '13px', color: 'var(--ash)', lineHeight: '1.5', display: 'block' }}>
                {ringkasan}
              </span>
            </div>
          )}

          {/* Kartu Grid */}
          {kartu && kartu.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', letterSpacing: '0.5px' }}>
                KARTU-KARTU ANDA (DIURUTKAN DARI TERDEKAT KE TERJAUH)
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[...kartu]
                  .sort((a: any, b: any) => a.jarak - b.jarak)
                  .map((card: any, idx: number) => (
                  <div key={idx} style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '16px',
                    alignItems: 'flex-start',
                    padding: '14px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: card.jarak === 0 ? 'rgba(255, 170, 0, 0.05)' : 'rgba(255, 255, 255, 0.01)',
                    borderRadius: '4px',
                    borderColor: card.jarak === 0 ? 'rgba(255, 170, 0, 0.4)' : 'var(--border-color)'
                  }}>
                    {card.thumbnail && (
                      <img
                        src={card.gambar || card.thumbnail}
                        alt={card.nama || ''}
                        style={{
                          width: '52px',
                          height: 'auto',
                          flexShrink: 0,
                          borderRadius: '4px',
                          border: '1px solid var(--border-color)',
                          objectFit: 'contain'
                        }}
                      />
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: card.jarak === 0 ? 'var(--gold, #ffaa00)' : 'var(--white)' }}>
                          {card.nama || `Kartu #${card.num}`}
                        </span>
                        {card.jarak === 0 && (
                          <span style={{ fontSize: '9px', color: 'var(--gold, #ffaa00)', fontWeight: 600, border: '1px solid rgba(255,170,0,0.4)', padding: '2px 6px', borderRadius: '2px', letterSpacing: '0.5px' }}>
                            KARTU PRIBADI
                          </span>
                        )}
                        {card.jarak > 0 && (
                          <span style={{ fontSize: '9px', color: 'var(--ash)', border: '1px solid var(--border-color)', padding: '2px 6px', borderRadius: '2px', letterSpacing: '0.5px' }}>
                            JARAK {card.jarak}
                          </span>
                        )}
                      </div>
                      {card.keterangan && (
                        <span style={{ fontSize: '12.5px', color: 'var(--smoke)', lineHeight: '1.5' }}>
                          {card.keterangan}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  // Render Feng Shui Layout
  if (activeTopic.id === 'feng-shui') {
    const {
      nama = '',
      tahun_lahir = '',
      jenis_kelamin = '',
      angka_kua = '',
      kelompok_kua = '',
      karakter = '',
      warna_keberuntungan = '',
      sektor_baik = [],
      sektor_buruk = []
    } = resData;

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Top identity grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
            {nama && (
              <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>NAMA</span>
                <span className="response-value-mono" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--white)', marginTop: '4px' }}>{nama}</span>
              </div>
            )}
            {tahun_lahir && (
              <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>TAHUN LAHIR</span>
                <span className="response-value-mono" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--white)', marginTop: '4px' }}>{tahun_lahir}</span>
              </div>
            )}
            {jenis_kelamin && (
              <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>JENIS KELAMIN</span>
                <span className="response-value-mono" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--white)', marginTop: '4px' }}>{jenis_kelamin}</span>
              </div>
            )}
            {angka_kua && (
              <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>ANGKA KUA</span>
                <span className="response-value-mono" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--gold, #ffaa00)', marginTop: '4px' }}>{angka_kua}</span>
              </div>
            )}
          </div>

          {/* Kelompok, Karakter, Warna */}
          <div style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {kelompok_kua && (
              <div>
                <span className="response-label" style={{ fontSize: '9px', color: 'var(--ash)', display: 'block', marginBottom: '2px' }}>KELOMPOK KUA</span>
                <span style={{ fontSize: '14px', color: 'var(--gold, #ffaa00)', fontWeight: 600 }}>{kelompok_kua}</span>
              </div>
            )}
            {karakter && (
              <div>
                <span className="response-label" style={{ fontSize: '9px', color: 'var(--ash)', display: 'block', marginBottom: '2px' }}>KARAKTER</span>
                <span style={{ fontSize: '13.5px', color: 'var(--smoke)' }}>{karakter}</span>
              </div>
            )}
            {warna_keberuntungan && (
              <div>
                <span className="response-label" style={{ fontSize: '9px', color: 'var(--ash)', display: 'block', marginBottom: '2px' }}>WARNA KEBERUNTUNGAN</span>
                <span style={{ fontSize: '13.5px', color: 'var(--smoke)' }}>{warna_keberuntungan}</span>
              </div>
            )}
          </div>

          {/* Sektor Baik */}
          {sektor_baik && sektor_baik.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', letterSpacing: '0.5px' }}>SEKTOR / ARAH BAIK</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sektor_baik.map((s: any, idx: number) => (
                  <div key={idx} style={{ padding: '14px', border: '1px solid rgba(100, 200, 100, 0.2)', backgroundColor: 'rgba(100, 200, 100, 0.03)', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#77dd77' }}>{s.nama}</span>
                      {s.arah && (
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--white)', border: '1px solid rgba(100, 200, 100, 0.4)', padding: '2px 8px', borderRadius: '2px' }}>
                          {s.arah}
                        </span>
                      )}
                    </div>
                    {s.keterangan && (
                      <span style={{ fontSize: '12.5px', color: 'var(--smoke)', lineHeight: '1.5', fontStyle: 'italic' }}>{s.keterangan}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sektor Buruk */}
          {sektor_buruk && sektor_buruk.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', letterSpacing: '0.5px' }}>SEKTOR / ARAH BURUK</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sektor_buruk.map((s: any, idx: number) => (
                  <div key={idx} style={{ padding: '14px', border: '1px solid rgba(255, 100, 100, 0.2)', backgroundColor: 'rgba(255, 100, 100, 0.03)', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#ff6666' }}>{s.nama}</span>
                      {s.arah && (
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--white)', border: '1px solid rgba(255, 100, 100, 0.4)', padding: '2px 8px', borderRadius: '2px' }}>
                          {s.arah}
                        </span>
                      )}
                    </div>
                    {s.keterangan && (
                      <span style={{ fontSize: '12.5px', color: 'var(--smoke)', lineHeight: '1.5', fontStyle: 'italic' }}>{s.keterangan}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Ramalan I Ching Layout
  if (activeTopic.id === 'ramalan-i-ching') {
    const {
      hexagram = '',
      nama_hexagram = '',
      deskripsi = ''
    } = resData;

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '32px', alignItems: 'center' }}>
            {/* Hexagram visualization */}
            {hexagram && hexagram.length === 6 && (
              <div style={{
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '24px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                alignItems: 'center'
              }}>
                <span className="response-label" style={{ fontSize: '9px', color: 'var(--ash)', marginBottom: '8px' }}>HEXAGRAM DARI ATAS KE BAWAH</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                  {hexagram.split('').map((char: string, idx: number) => {
                    const isYin = char === '0';
                    return (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '9.5px', color: 'var(--ash)', width: '45px', textAlign: 'right', fontFamily: 'monospace' }}>
                          Baris {6 - idx}
                        </span>
                        {isYin ? (
                          <div style={{ display: 'flex', width: '120px', gap: '16px', height: '10px' }}>
                            <div style={{ flex: 1, backgroundColor: 'var(--gold, #ffaa00)', borderRadius: '2px' }} />
                            <div style={{ flex: 1, backgroundColor: 'var(--gold, #ffaa00)', borderRadius: '2px' }} />
                          </div>
                        ) : (
                          <div style={{ width: '120px', height: '10px', backgroundColor: 'var(--gold, #ffaa00)', borderRadius: '2px' }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Results Title & Description */}
            <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {nama_hexagram && (
                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                  <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', display: 'block', marginBottom: '4px' }}>NAMA HEXAGRAM</span>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--gold, #ffaa00)' }}>
                    {nama_hexagram}
                  </span>
                </div>
              )}
              {deskripsi && (
                <div>
                  <span className="response-label" style={{ fontSize: '9px', color: 'var(--ash)', display: 'block', marginBottom: '6px' }}>TAFSIR RAMALAN</span>
                  <span style={{ fontSize: '15px', color: 'var(--smoke)', lineHeight: '1.7' }}>
                    {deskripsi}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Hari Baik Layout
  if (activeTopic.id === 'hari-baik') {
    const {
      weton = '',
      kategori = '',
      status = '',
      karakter = ''
    } = resData;

    const isBaik = status === 'BAIK';

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Top weton/status card */}
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <div>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', display: 'block', marginBottom: '4px' }}>WETON / TANGGAL</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--white)' }}>{weton}</span>
            </div>
            {status && (
              <span style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: isBaik ? '#77dd77' : '#ff6666',
                border: `1px solid ${isBaik ? 'rgba(119, 221, 119, 0.4)' : 'rgba(255, 102, 102, 0.4)'}`,
                backgroundColor: isBaik ? 'rgba(119, 221, 119, 0.05)' : 'rgba(255, 102, 102, 0.05)',
                padding: '6px 16px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                HARI {status}
              </span>
            )}
          </div>

          {/* Watak details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {kategori && (
              <div style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: '4px' }}>
                <span className="response-label" style={{ fontSize: '9px', color: 'var(--ash)', display: 'block', marginBottom: '4px' }}>KLASIFIKASI KAMAROKAM</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gold, #ffaa00)' }}>{kategori}</span>
              </div>
            )}
            {karakter && (
              <div style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: '4px' }}>
                <span className="response-label" style={{ fontSize: '9px', color: 'var(--ash)', display: 'block', marginBottom: '4px' }}>WATAK HARI</span>
                <span style={{ fontSize: '14.5px', color: 'var(--smoke)', lineHeight: '1.5' }}>{karakter}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render Hari Larangan Layout
  if (activeTopic.id === 'hari-larangan') {
    const {
      weton = '',
      status = '',
      karakter = ''
    } = resData;

    const isBiasa = status === 'BIASA';

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Top weton/status card */}
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <div>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', display: 'block', marginBottom: '4px' }}>WETON / TANGGAL</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--white)' }}>{weton}</span>
            </div>
            {status && (
              <span style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: isBiasa ? '#77dd77' : '#ff6666',
                border: `1px solid ${isBiasa ? 'rgba(119, 221, 119, 0.4)' : 'rgba(255, 102, 102, 0.4)'}`,
                backgroundColor: isBiasa ? 'rgba(119, 221, 119, 0.05)' : 'rgba(255, 102, 102, 0.05)',
                padding: '6px 16px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                HARI {status}
              </span>
            )}
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {karakter && (
              <div style={{ padding: '16px', border: `1px solid ${isBiasa ? 'var(--border-color)' : 'rgba(255, 102, 102, 0.2)'}`, backgroundColor: isBiasa ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 102, 102, 0.02)', borderRadius: '4px' }}>
                <span className="response-label" style={{ fontSize: '9px', color: 'var(--ash)', display: 'block', marginBottom: '6px' }}>PANDUAN PRIMBON</span>
                <span style={{ fontSize: '14.5px', color: 'var(--smoke)', lineHeight: '1.6' }}>
                  {isBiasa ? 'Hari ini ' : 'Awas! Hari ini '}
                  <strong>{status}</strong>. {karakter}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render Hari Naas Layout
  if (activeTopic.id === 'hari-naas') {
    const {
      hari_lahir = '',
      hari_naas = '',
      catatan = ''
    } = resData;

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Details grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {hari_lahir && (
              <div style={{ padding: '20px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: '4px' }}>
                <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', display: 'block', marginBottom: '8px' }}>HARI LAHIR ANDA</span>
                <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--white)' }}>
                  {hari_lahir}
                </span>
              </div>
            )}

            {hari_naas && (
              <div style={{ padding: '20px', border: '1px solid rgba(255, 102, 102, 0.3)', backgroundColor: 'rgba(255, 102, 102, 0.02)', borderRadius: '4px' }}>
                <span className="response-label" style={{ fontSize: '10px', color: '#ff6666', display: 'block', marginBottom: '8px', fontWeight: 'bold', letterSpacing: '0.5px' }}>HARI NAAS ANDA</span>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#ff6666' }}>
                  {hari_naas}
                </span>
              </div>
            )}
          </div>

          {/* Advice / Catatan */}
          {catatan && (
            <div style={{ padding: '16px', border: '1px solid rgba(255, 170, 0, 0.2)', backgroundColor: 'rgba(255, 170, 0, 0.02)', borderRadius: '4px' }}>
              <span className="response-label" style={{ fontSize: '9px', color: 'var(--gold, #ffaa00)', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>CATATAN KESELAMATAN</span>
              <span style={{ fontSize: '14px', color: 'var(--smoke)', lineHeight: '1.6' }}>
                {catatan}
              </span>
            </div>
          )}

          {/* General Primbon Advice */}
          <div style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '4px' }}>
            <span className="response-label" style={{ fontSize: '9px', color: 'var(--ash)', display: 'block', marginBottom: '6px' }}>PETUNJUK TRADISIONAL</span>
            <span style={{ fontSize: '13.5px', color: 'var(--ash)', lineHeight: '1.6' }}>
              Pada hari naas tersebut, leluhur menyarankan untuk lebih mawas diri, menghindari perjalanan jauh maupun mengadakan acara-acara penting, serta memperbanyak doa dan sedekah demi keselamatan lahir dan batin.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Render Naga Hari Layout
  if (activeTopic.id === 'naga-hari') {
    const {
      weton = '',
      naga_hari_lokasi = '',
      arah_tujuan = ''
    } = resData;

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Top weton card */}
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', display: 'block', marginBottom: '4px' }}>WETON / TANGGAL</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--white)' }}>{weton}</span>
          </div>

          {/* Details grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {naga_hari_lokasi && (
              <div style={{ padding: '20px', border: '1px solid rgba(255, 102, 102, 0.3)', backgroundColor: 'rgba(255, 102, 102, 0.02)', borderRadius: '4px' }}>
                <span className="response-label" style={{ fontSize: '10px', color: '#ff6666', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>KEDUDUKAN SANG NAGA HARI (DIHINDARI)</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#ff6666', display: 'block', marginBottom: '6px' }}>
                  {naga_hari_lokasi}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--ash)', lineHeight: '1.4' }}>
                  Jangan melakukan perjalanan menuju arah ini karena dapat mendatangkan musibah atau rintangan.
                </span>
              </div>
            )}

            {arah_tujuan && (
              <div style={{ padding: '20px', border: '1px solid rgba(119, 221, 119, 0.3)', backgroundColor: 'rgba(119, 221, 119, 0.02)', borderRadius: '4px' }}>
                <span className="response-label" style={{ fontSize: '10px', color: '#77dd77', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>ARAH BAIK (DIANJURKAN)</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  {arah_tujuan.split(',').map((dir: string) => (
                    <span key={dir} style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#77dd77',
                      border: '1px solid rgba(119, 221, 119, 0.4)',
                      backgroundColor: 'rgba(119, 221, 119, 0.1)',
                      padding: '4px 10px',
                      borderRadius: '4px'
                    }}>
                      {dir.trim()}
                    </span>
                  ))}
                </div>
                <span style={{ fontSize: '13px', color: 'var(--ash)', lineHeight: '1.4' }}>
                  Arah perjalanan yang disarankan jika Anda ingin sukses dalam urusan dagang, kerja, atau kepentingan lainnya.
                </span>
              </div>
            )}
          </div>

          {/* Lore / Legenda */}
          <div style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '4px' }}>
            <span className="response-label" style={{ fontSize: '9px', color: 'var(--ash)', display: 'block', marginBottom: '6px' }}>ASAL USUL SANG NAGA HARI</span>
            <span style={{ fontSize: '13.5px', color: 'var(--ash)', lineHeight: '1.6' }}>
              Menurut kitab Primbon, delapan naga sakti putra Dewi Kadru bertapa di delapan penjuru angin atas perintah Batara Wisnu ( Ki Dalang Jaruman ). Kedudukan naga ini berpindah setiap harinya dan memancarkan energi magis yang mempengaruhi keselamatan serta keberhasilan perjalanan manusia.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Render Arah Rejeki Layout
  if (activeTopic.id === 'arah-rejeki') {
    const {
      weton = '',
      arah_rejeki = ''
    } = resData;

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Top weton card */}
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', display: 'block', marginBottom: '4px' }}>WETON / TANGGAL</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--white)' }}>{weton}</span>
          </div>

          {/* Details */}
          {arah_rejeki && (
            <div style={{ padding: '24px', border: '1px solid rgba(119, 221, 119, 0.3)', backgroundColor: 'rgba(119, 221, 119, 0.02)', borderRadius: '4px', textAlign: 'center' }}>
              <span className="response-label" style={{ fontSize: '11px', color: 'var(--ash)', display: 'block', marginBottom: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>KEDUDUKAN ARAH REJEKI (DIUTAMAKAN)</span>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '16px' }}>
                {arah_rejeki.split('&').map((dir: string) => (
                  <span key={dir} style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    color: '#77dd77',
                    border: '1.5px solid rgba(119, 221, 119, 0.6)',
                    backgroundColor: 'rgba(119, 221, 119, 0.15)',
                    padding: '8px 24px',
                    borderRadius: '6px',
                    boxShadow: '0 0 10px rgba(119, 221, 119, 0.1)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    {dir.trim()}
                  </span>
                ))}
              </div>

              <p style={{ fontSize: '14.5px', color: 'var(--smoke)', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
                Menurut perhitungan Primbon Gayatri, jika Anda melangkah atau melakukan usaha (seperti berjualan atau dinas) ke arah di atas, energi keberuntungan Anda akan maksimal.
              </p>
            </div>
          )}

          {/* General Advice */}
          <div style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '4px' }}>
            <span className="response-label" style={{ fontSize: '9px', color: 'var(--ash)', display: 'block', marginBottom: '6px' }}>PETUNJUK TRADISIONAL GAYATRI</span>
            <span style={{ fontSize: '13.5px', color: 'var(--ash)', lineHeight: '1.6' }}>
              Metode Petung Gayatri merumuskan watak rejeki dari delapan penjuru angin secara dinamis berdasarkan weton hari. Arah rejeki ini sangat membantu bagi pelaku usaha, sales, marketing, maupun siapa saja yang ingin memaksimalkan rejeki lewat arah keberangkatan.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Render Ramalan Peruntungan Layout
  if (activeTopic.id === 'ramalan-peruntungan') {
    const {
      nama = '',
      tgl_lahir = '',
      tahun_peruntungan = '',
      header = '',
      ramalan = []
    } = resData;

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Couple profile header style */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <div>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', display: 'block', marginBottom: '4px' }}>NAMA</span>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--white)', textTransform: 'capitalize' }}>{nama}</span>
            </div>
            <div>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', display: 'block', marginBottom: '4px' }}>TANGGAL LAHIR</span>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--white)' }}>{tgl_lahir}</span>
            </div>
            <div>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', display: 'block', marginBottom: '4px' }}>TAHUN TARGET</span>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--gold, #ffaa00)' }}>{tahun_peruntungan}</span>
            </div>
          </div>

          {/* Heading */}
          {header && (
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--white)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '4px 0 0 0' }}>
              {header}
            </h3>
          )}

          {/* Ramalan paragraphs */}
          {ramalan && ramalan.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {ramalan.map((para: string, idx: number) => (
                <div key={idx} style={{
                  padding: '16px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'rgba(0, 0, 0, 0.15)',
                  borderRadius: '4px',
                  lineHeight: '1.6',
                  color: 'var(--smoke)',
                  fontSize: '14px'
                }}>
                  {para}
                </div>
              ))}
            </div>
          ) : (
            <span style={{ color: 'var(--ash)', fontStyle: 'italic' }}>Tidak ada data ramalan peruntungan untuk tahun tersebut.</span>
          )}
        </div>
      </div>
    );
  }

  // Render Weton Jawa Layout
  if (activeTopic.id === 'weton') {
    const {
      weton = '',
      neptu = {},
      watak_hari = '',
      naga_hari = '',
      jam_baik = '',
      watak_kelahiran = '',
      nasib_rejeki = []
    } = resData;

    const {
      pancasuda = '',
      saptawara = '',
      kamarokam = ''
    } = neptu;

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          
          {/* 1. Header Weton & Neptu */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', display: 'block', marginBottom: '4px' }}>HARI & WETON LAHIR</span>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--white)' }}>{weton}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderLeft: '1px solid var(--border-color)', paddingLeft: '16px' }}>
              <span className="response-label" style={{ fontSize: '9px', color: 'var(--ash)' }}>JUMALH NEPTU</span>
              {pancasuda && <span style={{ fontSize: '12px', color: 'var(--smoke)' }}>{pancasuda}</span>}
              {saptawara && <span style={{ fontSize: '12px', color: 'var(--smoke)' }}>{saptawara}</span>}
              {kamarokam && <span style={{ fontSize: '12px', color: 'var(--smoke)' }}>{kamarokam}</span>}
            </div>
          </div>

          {/* 2. Watak Kelahiran */}
          {watak_kelahiran && (
            <div style={{ padding: '20px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: '4px' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--gold)', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>WATAK KELAHIRAN</span>
              <p style={{ fontSize: '14.5px', color: 'var(--smoke)', lineHeight: '1.6', margin: 0 }}>
                {watak_kelahiran}
              </p>
            </div>
          )}

          {/* 3. Petunjuk Hari Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {watak_hari && (
              <div style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '4px' }}>
                <span className="response-label" style={{ fontSize: '9px', color: 'var(--ash)', display: 'block', marginBottom: '6px' }}>WATAK HARI (KAMAROKAM)</span>
                <span style={{ fontSize: '14px', color: 'var(--white)', fontWeight: 600 }}>{watak_hari}</span>
              </div>
            )}
            
            {jam_baik && (
              <div style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '4px' }}>
                <span className="response-label" style={{ fontSize: '9px', color: 'var(--ash)', display: 'block', marginBottom: '6px' }}>JAM BAIK (SAPTAWARA & PANCAWARA)</span>
                <span style={{ fontSize: '13px', color: 'var(--smoke)', lineHeight: '1.4' }}>{jam_baik}</span>
              </div>
            )}
          </div>

          {naga_hari && (
            <div style={{ padding: '16px', border: '1px solid rgba(255, 102, 102, 0.2)', backgroundColor: 'rgba(255, 102, 102, 0.02)', borderRadius: '4px' }}>
              <span className="response-label" style={{ fontSize: '9px', color: '#ff6666', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>NAGA HARI</span>
              <span style={{ fontSize: '13.5px', color: 'var(--smoke)', lineHeight: '1.5' }}>{naga_hari}</span>
            </div>
          )}

          {/* 4. Perjalanan Nasib & Rejeki */}
          {nasib_rejeki && nasib_rejeki.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>GRAFIK PERJALANAN NASIB & REJEKI</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
                {nasib_rejeki.map((item: any, idx: number) => (
                  <div key={idx} style={{
                    padding: '16px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'rgba(255, 255, 255, 0.01)',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--gold, #ffaa00)', letterSpacing: '0.5px' }}>
                      {item.usia}
                    </span>
                    <p style={{ fontSize: '13px', color: 'var(--smoke)', lineHeight: '1.5', margin: 0 }}>
                      {item.prediksi}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Sifat Karakter Layout
  if (activeTopic.id === 'sifat-karakter') {
    const {
      nama = '',
      tgl_lahir = '',
      garis_hidup = '',
      penjelasan = []
    } = resData;

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Couple profile header style */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <div>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', display: 'block', marginBottom: '4px' }}>NAMA</span>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--white)', textTransform: 'capitalize' }}>{nama}</span>
            </div>
            <div>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', display: 'block', marginBottom: '4px' }}>TANGGAL LAHIR</span>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--white)' }}>{tgl_lahir}</span>
            </div>
            {garis_hidup && (
              <div>
                <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', display: 'block', marginBottom: '4px' }}>GARIS HIDUP</span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: 'var(--gold, #ffaa00)',
                  border: '1px solid rgba(255, 170, 0, 0.4)',
                  backgroundColor: 'rgba(255, 170, 0, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  display: 'inline-block'
                }}>
                  {garis_hidup}
                </span>
              </div>
            )}
          </div>

          {/* Penjelasan paragraphs */}
          {penjelasan && penjelasan.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {penjelasan.map((para: string, idx: number) => (
                <div key={idx} style={{
                  padding: '16px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'rgba(0, 0, 0, 0.15)',
                  borderRadius: '4px',
                  lineHeight: '1.6',
                  color: 'var(--smoke)',
                  fontSize: '14px'
                }}>
                  {para}
                </div>
              ))}
            </div>
          ) : (
            <span style={{ color: 'var(--ash)', fontStyle: 'italic' }}>Tidak ada data penjelasan sifat karakter.</span>
          )}
        </div>
      </div>
    );
  }

  // Render Potensi Keberuntungan Layout
  if (activeTopic.id === 'potensi-keberuntungan') {
    const {
      nama = '',
      tgl_lahir = '',
      potensi = []
    } = resData;

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Couple profile header style */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <div>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', display: 'block', marginBottom: '4px' }}>NAMA</span>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--white)', textTransform: 'capitalize' }}>{nama}</span>
            </div>
            <div>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', display: 'block', marginBottom: '4px' }}>TANGGAL LAHIR</span>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--white)' }}>{tgl_lahir}</span>
            </div>
          </div>

          {/* Potensi paragraphs */}
          {potensi && potensi.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {potensi.map((para: string, idx: number) => (
                <div key={idx} style={{
                  padding: '20px',
                  border: '1.5px solid rgba(119, 221, 119, 0.3)',
                  backgroundColor: 'rgba(119, 221, 119, 0.02)',
                  borderRadius: '4px',
                  lineHeight: '1.7',
                  color: 'var(--smoke)',
                  fontSize: '14.5px',
                  boxShadow: '0 0 12px rgba(119, 221, 119, 0.05)'
                }}>
                  {para}
                </div>
              ))}
            </div>
          ) : (
            <span style={{ color: 'var(--ash)', fontStyle: 'italic' }}>Tidak ada data potensi keberuntungan.</span>
          )}
        </div>
      </div>
    );
  }

  // Render Memancing Ikan Layout
  if (activeTopic.id === 'memancing-ikan') {
    const {
      weton = '',
      status = '',
      catatan = ''
    } = resData;

    // Detect if bad status (Temil / difficult to catch fish)
    const isBad = status.toLowerCase() === 'temil';

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Weton Header */}
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', display: 'block', marginBottom: '4px' }}>WETON / TANGGAL MEMANCING</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--white)' }}>{weton}</span>
          </div>

          {/* Status & Catatan Card */}
          {status && (
            <div style={{
              padding: '24px',
              border: isBad ? '1px solid rgba(255, 102, 102, 0.3)' : '1px solid rgba(119, 221, 119, 0.3)',
              backgroundColor: isBad ? 'rgba(255, 102, 102, 0.02)' : 'rgba(119, 221, 119, 0.02)',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                  color: isBad ? '#ff6666' : '#77dd77',
                  border: isBad ? '1.5px solid rgba(255, 102, 102, 0.5)' : '1.5px solid rgba(119, 221, 119, 0.5)',
                  backgroundColor: isBad ? 'rgba(255, 102, 102, 0.15)' : 'rgba(119, 221, 119, 0.15)',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  textTransform: 'uppercase'
                }}>
                  {status}
                </span>
                <span style={{ fontSize: '14px', color: 'var(--white)', fontWeight: 600 }}>
                  {isBad ? 'Arah Kurang Baik' : 'Arah / Hari Baik'}
                </span>
              </div>

              {catatan && (
                <p style={{ fontSize: '14px', color: 'var(--smoke)', lineHeight: '1.6', margin: 0 }}>
                  {catatan}
                </p>
              )}
            </div>
          )}

          {/* Advice card */}
          <div style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '4px' }}>
            <span className="response-label" style={{ fontSize: '9px', color: 'var(--ash)', display: 'block', marginBottom: '6px' }}>PETUNJUK TRADISIONAL MEMANCING</span>
            <span style={{ fontSize: '13px', color: 'var(--ash)', lineHeight: '1.6' }}>
              Primbon memancing ikan merupakan petunjuk warisan leluhur untuk menentukan hari keberangkatan memancing agar terhindar dari hasil nihil (Temil). Padukan hitungan ini dengan pengamatan kondisi pasang surut air, angin, dan fase bulan demi hasil tangkapan yang maksimal.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Render Masa Subur Layout
  if (activeTopic.id === 'masa-subur') {
    const {
      siklus = '',
      tgl_menstruasi_berikutnya = '',
      tgl_ovulasi = '',
      tgl_masa_subur = '',
      konsepsi_laki_laki = '',
      konsepsi_perempuan = '',
      tgl_persalinan = ''
    } = resData;

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          
          {/* Top banner: Cycle & Next Period */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
            <div>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', display: 'block', marginBottom: '4px' }}>ESTIMASI MENS BERIKUTNYA</span>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--white)' }}>{tgl_menstruasi_berikutnya || '-'}</span>
            </div>
            <div>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', display: 'block', marginBottom: '4px' }}>RATA-RATA SIKLUS MENS</span>
              <span style={{
                fontSize: '13px',
                fontWeight: 'bold',
                color: 'var(--gold, #ffaa00)',
                border: '1px solid rgba(255, 170, 0, 0.4)',
                backgroundColor: 'rgba(255, 170, 0, 0.1)',
                padding: '3px 10px',
                borderRadius: '4px',
                display: 'inline-block'
              }}>
                {siklus}
              </span>
            </div>
          </div>

          {/* Fertility details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {tgl_masa_subur && (
              <div style={{
                padding: '20px',
                border: '1px solid rgba(119, 221, 119, 0.3)',
                backgroundColor: 'rgba(119, 221, 119, 0.02)',
                borderRadius: '4px'
              }}>
                <span className="response-label" style={{ fontSize: '10px', color: '#77dd77', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>MASA SUBUR (PALING SUBUR)</span>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--white)' }}>{tgl_masa_subur}</span>
                <span style={{ fontSize: '12px', color: 'var(--ash)', display: 'block', marginTop: '6px' }}>
                  Kesempatan hamil paling tinggi jika berhubungan intim pada rentang waktu ini.
                </span>
              </div>
            )}

            {tgl_ovulasi && (
              <div style={{
                padding: '20px',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                backgroundColor: 'rgba(255, 215, 0, 0.02)',
                borderRadius: '4px'
              }}>
                <span className="response-label" style={{ fontSize: '10px', color: '#ffd700', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>TANGGAL OVULASI</span>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--white)' }}>{tgl_ovulasi}</span>
                <span style={{ fontSize: '12px', color: 'var(--ash)', display: 'block', marginTop: '6px' }}>
                  Pelepasan sel telur matang dari ovarium.
                </span>
              </div>
            )}
          </div>

          {/* Gender Conception Theory */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', fontWeight: 'bold' }}>TIPS KONSEPSI JENIS KELAMIN (TEORI SHETTLES)</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {konsepsi_laki_laki && (
                <div style={{
                  padding: '16px',
                  border: '1px solid rgba(135, 206, 250, 0.3)',
                  backgroundColor: 'rgba(135, 206, 250, 0.02)',
                  borderRadius: '4px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" style={{ color: '#87cefa' }}>
                      <path d="M14.5 9.5 21 3m0 0h-5.5M21 3v5.5M10 21a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
                    </svg>
                    <span style={{ fontSize: '12.5px', fontWeight: 'bold', color: '#87cefa' }}>KONSEPSI BAYI LAKI-LAKI</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--white)' }}>{konsepsi_laki_laki}</span>
                  <p style={{ fontSize: '11.5px', color: 'var(--ash)', margin: '6px 0 0 0', lineHeight: '1.4' }}>
                    Saran hubungan intim sedekat mungkin dengan waktu ovulasi (sperma Y lebih cepat tapi berumur pendek).
                  </p>
                </div>
              )}

              {konsepsi_perempuan && (
                <div style={{
                  padding: '16px',
                  border: '1px solid rgba(255, 182, 193, 0.3)',
                  backgroundColor: 'rgba(255, 182, 193, 0.02)',
                  borderRadius: '4px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" style={{ color: '#ffb6c1' }}>
                      <path d="M12 15.5a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 0V22m-4-3h8" />
                    </svg>
                    <span style={{ fontSize: '12.5px', fontWeight: 'bold', color: '#ffb6c1' }}>KONSEPSI BAYI PEREMPUAN</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--white)' }}>{konsepsi_perempuan}</span>
                  <p style={{ fontSize: '11.5px', color: 'var(--ash)', margin: '6px 0 0 0', lineHeight: '1.4' }}>
                    Saran hubungan intim 2-3 hari sebelum ovulasi (sperma X lebih lambat tapi bertahan lebih lama).
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Delivery estimation */}
          {tgl_persalinan && (
            <div style={{
              padding: '16px 20px',
              border: '1.5px solid rgba(186, 85, 211, 0.3)',
              backgroundColor: 'rgba(186, 85, 211, 0.02)',
              borderRadius: '4px',
              boxShadow: '0 0 12px rgba(186, 85, 211, 0.05)'
            }}>
              <span className="response-label" style={{ fontSize: '10px', color: '#ba55d3', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>PERKIRAAN TANGGAL PERSALINAN (DUE DATE)</span>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--white)' }}>{tgl_persalinan}</span>
              <span style={{ fontSize: '11.5px', color: 'var(--ash)', display: 'block', marginTop: '4px' }}>
                Estimasi kelahiran jika terjadi konsepsi/kehamilan pada masa subur siklus menstruasi ini.
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Zodiak Layout
  if (activeTopic.id === 'zodiak') {
    const {
      zodiak = '',
      rentang_tanggal = '',
      sifat = '',
      karakteristik = {},
      penjelasan_karakter = '',
      asmara = ''
    } = resData;

    // Split properties/sifat into badges
    const sifatBadges = sifat ? sifat.split(',').map((s: string) => s.trim()) : [];

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Header section with Zodiac Title and Rentang Tanggal */}
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
            <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', display: 'block', marginBottom: '4px' }}>ZODIAK LAHIR</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--white)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{zodiak}</span>
              <span style={{ fontSize: '14px', color: 'var(--gold, #ffaa00)', fontWeight: 500 }}>{rentang_tanggal}</span>
            </div>

            {/* Sifat badges */}
            {sifatBadges.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {sifatBadges.map((badge: string, idx: number) => (
                  <span key={idx} style={{
                    fontSize: '11px',
                    color: 'var(--smoke)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    padding: '3px 10px',
                    borderRadius: '20px'
                  }}>
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Karakteristik Keberuntungan Grid */}
          {karakteristik && Object.keys(karakteristik).length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', fontWeight: 'bold' }}>ATRIBUT KEBERUNTUNGAN</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                {Object.entries(karakteristik).map(([key, val]: [string, any]) => (
                  <div key={key} style={{
                    padding: '14px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'rgba(0, 0, 0, 0.12)',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <span style={{ fontSize: '9px', color: 'var(--ash)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{key}</span>
                    <span style={{ fontSize: '13.5px', color: 'var(--white)', fontWeight: 600 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Details (Karakter & Asmara) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {penjelasan_karakter && (
              <div style={{ padding: '20px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.01)', borderRadius: '4px' }}>
                <span className="response-label" style={{ fontSize: '10px', color: 'var(--gold, #ffaa00)', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>KARAKTER & KEPRIBADIAN</span>
                <p style={{ fontSize: '14px', color: 'var(--smoke)', lineHeight: '1.6.5', margin: 0, whiteSpace: 'pre-line' }}>
                  {penjelasan_karakter}
                </p>
              </div>
            )}

            {asmara && (
              <div style={{
                padding: '20px',
                border: '1px solid rgba(255, 182, 193, 0.3)',
                backgroundColor: 'rgba(255, 182, 193, 0.02)',
                borderRadius: '4px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14" style={{ color: '#ffb6c1' }}>
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                  <span style={{ fontSize: '10px', color: '#ffb6c1', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>KEHIDUPAN ASMARA</span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--smoke)', lineHeight: '1.6.5', margin: 0, whiteSpace: 'pre-line' }}>
                  {asmara}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render Shio Layout
  if (activeTopic.id === 'shio') {
    const {
      shio = '',
      penjelasan = []
    } = resData;

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Shio Title Header */}
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', display: 'block', marginBottom: '4px' }}>SHIO TIONGHOA</span>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--white)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{shio}</span>
          </div>

          {/* Narrative paragraphs */}
          {penjelasan && penjelasan.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {penjelasan.map((para: string, idx: number) => (
                <div key={idx} style={{
                  padding: '20px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'rgba(255, 255, 255, 0.005)',
                  borderRadius: '4px',
                  lineHeight: '1.7',
                  color: 'var(--smoke)',
                  fontSize: '14.5px'
                }}>
                  {para}
                </div>
              ))}
            </div>
          ) : (
            <span style={{ color: 'var(--ash)', fontStyle: 'italic' }}>Tidak ada data penjelasan Shio.</span>
          )}
        </div>
      </div>
    );
  }

  // Render Kayu Bertuah Layout
  if (activeTopic.id === 'kayu-bertuah') {
    const isSingle = resData && typeof resData === 'object' && !Array.isArray(resData) && resData.nama;

    if (isSingle) {
      const wood = resData;
      return (
        <div className="response-layout">
          <div className="response-header">
            <h2 className="response-title">
              {activeTopic.title}
            </h2>
          </div>

          <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
            <div style={{
              padding: '24px',
              border: '1.5px solid rgba(222, 184, 135, 0.3)',
              backgroundColor: 'rgba(222, 184, 135, 0.02)',
              borderRadius: '4px',
              boxShadow: '0 0 16px rgba(222, 184, 135, 0.05)'
            }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#deb887', marginBottom: '16px' }}>
                {wood.nama}
              </div>

              <p style={{ fontSize: '14.5px', color: 'var(--white)', lineHeight: '1.7', margin: 0 }}>
                {wood.deskripsi}
              </p>
            </div>
          </div>
        </div>
      );
    }

    const list = Array.isArray(resData) ? resData : (Array.isArray(resData.data) ? resData.data : []);

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Header section */}
          <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <div>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', display: 'block', marginBottom: '4px' }}>KATALOG MITOLOGI</span>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--white)' }}>Kamus Khasiat Kayu Bertuah</span>
            </div>
            <span style={{
              fontSize: '11px',
              backgroundColor: 'rgba(222, 184, 135, 0.1)',
              color: '#deb887',
              border: '1px solid rgba(222, 184, 135, 0.3)',
              padding: '4px 10px',
              borderRadius: '4px',
              fontWeight: 'bold',
              height: 'fit-content'
            }}>
              {list.length} JENIS KAYU
            </span>
          </div>

          {/* Woods Grid */}
          {list.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {list.map((wood: any, idx: number) => (
                <div key={idx} style={{
                  padding: '20px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'rgba(255, 255, 255, 0.01)',
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" style={{ color: '#deb887', flexShrink: 0 }}>
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="M12 6v12M6 12h12" />
                    </svg>
                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#deb887' }}>
                      {wood.nama}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--smoke)', lineHeight: '1.6', margin: 0 }}>
                    {wood.deskripsi}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <span style={{ color: 'var(--ash)', fontStyle: 'italic' }}>Tidak ada data kayu bertuah.</span>
          )}
        </div>
      </div>
    );
  }

  // Render Batu Permata Layout
  if (activeTopic.id === 'batu-permata') {
    const isSingle = resData && typeof resData === 'object' && !Array.isArray(resData) && resData.nama;

    if (isSingle) {
      const batu = resData;
      return (
        <div className="response-layout">
          <div className="response-header">
            <h2 className="response-title">
              {activeTopic.title}
            </h2>
          </div>

          <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
            <div style={{
              padding: '24px',
              border: '1.5px solid rgba(147, 112, 219, 0.3)',
              backgroundColor: 'rgba(147, 112, 219, 0.02)',
              borderRadius: '4px',
              boxShadow: '0 0 16px rgba(147, 112, 219, 0.05)'
            }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#b39ddb', marginBottom: '16px' }}>
                {batu.nama}
              </div>

              <p style={{ fontSize: '14.5px', color: 'var(--white)', lineHeight: '1.7', margin: 0 }}>
                {batu.deskripsi}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }

  // Render Pamali / Pantangan Layout
  if (activeTopic.id === 'pamali' || activeTopic.id === 'pantangan') {
    const isSingle = resData && typeof resData === 'object' && !Array.isArray(resData) && resData.judul;

    if (isSingle) {
      const pamali = resData;
      return (
        <div className="response-layout">
          <div className="response-header">
            <h2 className="response-title">{activeTopic.title}</h2>
          </div>

          <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
            <div style={{
              padding: '24px',
              border: '1.5px solid rgba(239, 68, 68, 0.25)',
              backgroundColor: 'rgba(239, 68, 68, 0.03)',
              borderRadius: '4px',
              boxShadow: '0 0 16px rgba(239, 68, 68, 0.05)'
            }}>
              {/* Warning badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" style={{ color: '#f87171', flexShrink: 0 }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#f87171', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Pantangan / Pamali</span>
              </div>

              {/* Title */}
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--white)', marginBottom: '16px', lineHeight: '1.4' }}>
                {pamali.judul}
              </div>

              {/* Description */}
              <p style={{ fontSize: '14.5px', color: 'var(--smoke)', lineHeight: '1.75', margin: '0 0 12px 0' }}>
                {pamali.penjelasan}
              </p>

              {/* Footer meta */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}>
                  #{pamali.id}
                </span>
                {pamali.slug && (
                  <span style={{
                    fontSize: '10px',
                    color: 'var(--ash)',
                    fontFamily: 'var(--font-mono)',
                    padding: '3px 0'
                  }}>
                    {pamali.slug}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }

  // Render Tanggal Lahir Layout (Hari, Tanggal, Bulan)
  if (activeTopic.id === 'tanggal-lahir') {
    const hasData = resData && typeof resData === 'object' && !Array.isArray(resData);
    const hariData   = hasData ? resData.hari   : null;
    const tanggalData = hasData ? resData.tanggal : null;
    const bulanData  = hasData ? resData.bulan  : null;

    if (!hasData || (!hariData && !tanggalData && !bulanData)) return null;

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">{activeTopic.title}</h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>

          {/* Hari Card */}
          {hariData && (
            <div style={{
              padding: '20px',
              border: '1px solid rgba(96, 165, 250, 0.25)',
              backgroundColor: 'rgba(96, 165, 250, 0.03)',
              borderRadius: '4px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" style={{ color: '#60a5fa', flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#60a5fa', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Hari Lahir</span>
                <span style={{
                  marginLeft: 'auto', fontSize: '11px', fontWeight: 'bold',
                  backgroundColor: 'rgba(96, 165, 250, 0.1)', color: '#60a5fa',
                  border: '1px solid rgba(96, 165, 250, 0.25)', padding: '2px 10px', borderRadius: '4px'
                }}>{hariData.nama}</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--white)', lineHeight: '1.7', margin: 0 }}>
                {hariData.sifat}
              </p>
            </div>
          )}

          {/* Tanggal Card */}
          {tanggalData && (
            <div style={{
              padding: '20px',
              border: '1px solid rgba(251, 191, 36, 0.25)',
              backgroundColor: 'rgba(251, 191, 36, 0.03)',
              borderRadius: '4px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" style={{ color: '#fbbf24', flexShrink: 0 }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#fbbf24', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Tanggal Lahir</span>
                <span style={{
                  marginLeft: 'auto', fontSize: '11px', fontWeight: 'bold',
                  backgroundColor: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24',
                  border: '1px solid rgba(251, 191, 36, 0.25)', padding: '2px 10px', borderRadius: '4px'
                }}>Tanggal {tanggalData.nomor}</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--white)', lineHeight: '1.7', margin: 0 }}>
                {tanggalData.penjelasan}
              </p>
            </div>
          )}

          {/* Bulan Card */}
          {bulanData && (
            <div style={{
              padding: '20px',
              border: '1px solid rgba(52, 211, 153, 0.25)',
              backgroundColor: 'rgba(52, 211, 153, 0.03)',
              borderRadius: '4px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" style={{ color: '#34d399', flexShrink: 0 }}>
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#34d399', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Bulan Lahir</span>
                <span style={{
                  marginLeft: 'auto', fontSize: '11px', fontWeight: 'bold',
                  backgroundColor: 'rgba(52, 211, 153, 0.1)', color: '#34d399',
                  border: '1px solid rgba(52, 211, 153, 0.25)', padding: '2px 10px', borderRadius: '4px'
                }}>{bulanData.nama}</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {Array.isArray(bulanData.sifat)
                  ? bulanData.sifat.map((s: string, i: number) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: 'var(--white)', lineHeight: '1.6' }}>
                      <span style={{ color: '#34d399', fontSize: '12px', marginTop: '3px', flexShrink: 0 }}>▸</span>
                      <span>{s}</span>
                    </li>
                  ))
                  : <li style={{ fontSize: '14px', color: 'var(--white)', lineHeight: '1.7' }}>{bulanData.sifat}</li>
                }
              </ul>
            </div>
          )}

        </div>
      </div>
    );
  }

  // Render Hari Baik Menikah Layout
  if (activeTopic.id === 'hari-baik-menikah') {
    const d = resData && typeof resData === 'object' && !Array.isArray(resData) ? resData : null;
    if (!d || !d.hari_disarankan) return null;

    const hariList: { tanggal: string; weton_detail: string }[] = d.hari_disarankan || [];

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">{activeTopic.title}</h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'rgba(255,255,255,0.01)' }}>

          {/* Weton Info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div style={{ padding: '14px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
              <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--ash)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Anda</span>
              <p style={{ margin: '0 0 3px 0', fontSize: '12px', color: 'var(--smoke)' }}>{d.tanggal_lahir_1}</p>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: 'var(--white)' }}>{d.weton_1}</p>
            </div>
            <div style={{ padding: '14px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
              <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--ash)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Pasangan</span>
              <p style={{ margin: '0 0 3px 0', fontSize: '12px', color: 'var(--smoke)' }}>{d.tanggal_lahir_2}</p>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: 'var(--white)' }}>{d.weton_2}</p>
            </div>
            <div style={{ padding: '14px', border: '1px solid rgba(251,191,36,0.3)', backgroundColor: 'rgba(251,191,36,0.04)', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#fbbf24', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>Total Neptu</span>
              <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#fbbf24' }}>{d.total_neptu}</span>
            </div>
          </div>

          {/* Hari Disarankan */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" style={{ color: '#34d399' }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#34d399', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Hari Pernikahan yang Disarankan ({hariList.length} hari)
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {hariList.map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: i === 0 ? 'rgba(52, 211, 153, 0.04)' : 'rgba(0,0,0,0.15)',
                  borderRadius: '4px',
                  borderLeft: i === 0 ? '3px solid #34d399' : '3px solid transparent',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontSize: '10px', fontWeight: 'bold', minWidth: '20px', textAlign: 'center',
                      color: i === 0 ? '#34d399' : 'var(--ash)'
                    }}>{i + 1}</span>
                    <span style={{ fontSize: '14px', fontWeight: i === 0 ? 'bold' : 'normal', color: i === 0 ? 'var(--white)' : 'var(--smoke)' }}>
                      {item.tanggal}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    color: 'var(--ash)',
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.weton_detail}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Render Weton Jodoh Layout
  if (activeTopic.id === 'weton-jodoh') {
    const d = resData && typeof resData === 'object' && !Array.isArray(resData) ? resData : null;
    if (!d || !d.kategori) return null;

    const KATEGORI_COLOR: Record<string, string> = {
      'Ratu':    '#fbbf24', 'Pesthi':  '#fbbf24', 'Tinari':  '#34d399', 'Pandu':   '#60a5fa',
      'Pegat':   '#f87171', 'Topo':    '#f87171', 'Wasesa':  '#a78bfa', 'Demang':  '#a78bfa',
      'Srikandi': '#fb923c',
    };
    const kategoriColor = KATEGORI_COLOR[d.kategori] || '#94a3b8';

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">{activeTopic.title}</h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'rgba(255,255,255,0.01)' }}>

          {/* Couple Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {/* Person 1 */}
            <div style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
              <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--ash)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Anda</span>
              <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--smoke)' }}>{d.tanggal_lahir_1}</p>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: 'var(--white)' }}>{d.weton_1}</p>
            </div>
            {/* Person 2 */}
            <div style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
              <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--ash)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Pasangan</span>
              <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--smoke)' }}>{d.tanggal_lahir_2}</p>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: 'var(--white)' }}>{d.weton_2}</p>
            </div>
          </div>

          {/* Result Card */}
          <div style={{
            padding: '24px',
            border: `1.5px solid ${kategoriColor}44`,
            backgroundColor: `${kategoriColor}08`,
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--ash)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Hasil Kecocokan</span>

            {/* Total Neptu */}
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', color: 'var(--smoke)' }}>Total Neptu: </span>
              <span style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--white)' }}>{d.total_neptu}</span>
            </div>

            {/* Kategori Badge */}
            <div style={{
              display: 'inline-block',
              fontSize: '22px', fontWeight: 'bold',
              color: kategoriColor,
              backgroundColor: `${kategoriColor}15`,
              border: `2px solid ${kategoriColor}55`,
              padding: '10px 32px',
              borderRadius: '4px',
              letterSpacing: '0.05em',
              marginBottom: '16px'
            }}>
              {d.kategori}
            </div>

            {/* Makna */}
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--smoke)', lineHeight: '1.7' }}>
              {d.makna}
            </p>
          </div>

        </div>
      </div>
    );
  }

  // Render Ramalan Jodoh / Jodoh Bali Layout
  if (activeTopic.id === 'ramalan-jodoh' || activeTopic.id === 'ramalan-jodoh-bali') {
    const { person1 = {}, person2 = {}, petung = [], catatan, hasil_header } = resData;
    const isBali = activeTopic.id === 'ramalan-jodoh-bali';

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title} - {hasil_header || (isBali ? 'Pal Sri Sedana' : 'Kitab Betaljemur Adammakna')}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Couple profiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', alignItems: 'center' }}>
            {/* Person 1 */}
            <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)', textAlign: 'center' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>PIHAK PERTAMA</span>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--white)', margin: '4px 0 2px 0', textTransform: 'capitalize' }}>
                {person1.nama || 'Nama 1'}
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--gold, #ffaa00)', fontFamily: 'var(--font-mono)' }}>
                {person1.tgl_lahir}
              </span>
            </div>

            {/* Connection Icon */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', userSelect: 'none' }}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#ff4d4d" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                width="32" 
                height="32"
                style={{ 
                  filter: 'drop-shadow(0 0 8px rgba(255, 77, 77, 0.6))',
                  display: 'block'
                }}
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </div>

            {/* Person 2 */}
            <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)', textAlign: 'center' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>PIHAK KEDUA</span>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--white)', margin: '4px 0 2px 0', textTransform: 'capitalize' }}>
                {person2.nama || 'Nama 2'}
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--gold, #ffaa00)', fontFamily: 'var(--font-mono)' }}>
                {person2.tgl_lahir}
              </span>
            </div>
          </div>

          {/* Petung list */}
          {petung.length > 0 && (
            <div className="response-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span className="response-label" style={{ color: 'var(--ash)' }}>
                6 ASPEK PERHITUNGAN PERJODOHAN (PETUNG)
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                {petung.map((item: any, idx: number) => {
                  // Format/split detail if there's a prefix in square brackets, e.g. "[Sisa 3 & 7]"
                  const match = item.detail.match(/^(\[[^\]]+\])\s*(.*)/);
                  const badge = match ? match[1] : '';
                  const bodyText = match ? match[2] : item.detail;

                  return (
                    <div key={idx} style={{
                      padding: '16px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--white)' }}>
                          {item.header}
                        </span>
                        {badge && (
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            backgroundColor: 'rgba(255, 170, 0, 0.1)',
                            color: 'var(--gold, #ffaa00)',
                            border: '1px solid rgba(255, 170, 0, 0.3)',
                            borderRadius: '3px',
                            fontFamily: 'var(--font-mono)'
                          }}>
                            {badge}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '13px', color: 'var(--smoke)', lineHeight: '1.5' }}>
                        {bodyText}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Advice */}
          {catatan && (
            <div style={{
              marginTop: '10px',
              padding: '16px',
              border: '1px solid rgba(0, 210, 255, 0.2)',
              backgroundColor: 'rgba(0, 210, 255, 0.02)',
              borderRadius: '4px',
              display: 'flex',
              gap: '12px',
              alignItems: 'start'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '20px' }}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="var(--cyan-pulse, #00d2ff)" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  width="18" 
                  height="18"
                  style={{ filter: 'drop-shadow(0 0 5px rgba(0, 210, 255, 0.5))' }}
                >
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5.5 5.5 0 0 0 7 8c0 1.3.5 2.6 1.5 3.5.7.8 1.3 1.5 1.5 2.5" />
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className="response-label" style={{ color: 'var(--cyan-pulse, #00d2ff)', fontSize: '10px' }}>SARAN & PENJELASAN</span>
                <span style={{ fontSize: '12px', color: 'var(--smoke)', lineHeight: '1.5' }}>
                  {catatan}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Ramalan Suami Istri Layout
  if (activeTopic.id === 'ramalan-suami-istri') {
    const { person1 = {}, person2 = {}, hasil = [], catatan } = resData;

    // Helper to get status colors for different meanings
    const getMeaningStyles = (meaning: string) => {
      const lower = meaning.toLowerCase();
      if (lower.startsWith('sri')) {
        return {
          badgeBg: 'rgba(255, 170, 0, 0.1)',
          badgeColor: 'var(--gold, #ffaa00)',
          badgeBorder: 'rgba(255, 170, 0, 0.3)',
          label: 'Sri'
        };
      }
      if (lower.startsWith('lungguh')) {
        return {
          badgeBg: 'rgba(0, 210, 255, 0.1)',
          badgeColor: 'var(--cyan-pulse, #00d2ff)',
          badgeBorder: 'rgba(0, 210, 255, 0.3)',
          label: 'Lungguh'
        };
      }
      if (lower.startsWith('gedong')) {
        return {
          badgeBg: 'rgba(16, 185, 129, 0.1)',
          badgeColor: '#10b981',
          badgeBorder: 'rgba(16, 185, 129, 0.3)',
          label: 'Gedong'
        };
      }
      if (lower.startsWith('pete')) {
        return {
          badgeBg: 'rgba(245, 158, 11, 0.1)',
          badgeColor: '#f59e0b',
          badgeBorder: 'rgba(245, 158, 11, 0.3)',
          label: 'Pete'
        };
      }
      if (lower.startsWith('pati')) {
        return {
          badgeBg: 'rgba(239, 68, 68, 0.1)',
          badgeColor: '#ef4444',
          badgeBorder: 'rgba(239, 68, 68, 0.3)',
          label: 'Pati'
        };
      }
      return {
        badgeBg: 'rgba(255, 255, 255, 0.05)',
        badgeColor: 'var(--white)',
        badgeBorder: 'rgba(255, 255, 255, 0.1)',
        label: 'Lainnya'
      };
    };

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Couple profiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', alignItems: 'center' }}>
            {/* Husband */}
            <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)', textAlign: 'center' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>SUAMI</span>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--white)', margin: '4px 0 2px 0', textTransform: 'capitalize' }}>
                {person1.nama || 'Nama Suami'}
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--gold, #ffaa00)', fontFamily: 'var(--font-mono)' }}>
                {person1.tgl_lahir}
              </span>
            </div>

            {/* Connection Icon */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', userSelect: 'none' }}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="#00d2ff" 
                width="32" 
                height="32"
                style={{ 
                  filter: 'drop-shadow(0 0 8px rgba(0, 210, 255, 0.6))',
                  display: 'block'
                }}
              >
                <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>

            {/* Wife */}
            <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)', textAlign: 'center' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>ISTRI</span>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--white)', margin: '4px 0 2px 0', textTransform: 'capitalize' }}>
                {person2.nama || 'Nama Istri'}
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--gold, #ffaa00)', fontFamily: 'var(--font-mono)' }}>
                {person2.tgl_lahir}
              </span>
            </div>
          </div>

          {/* Life path milestones */}
          {hasil.length > 0 && (
            <div className="response-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span className="response-label" style={{ color: 'var(--ash)' }}>
                PREDIKSI BERDASARKAN USIA PERNIKAHAN
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                {hasil.map((item: any, idx: number) => {
                  const styles = getMeaningStyles(item.meaning);
                  return (
                    <div key={idx} style={{
                      padding: '12px 16px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(255, 255, 255, 0.01)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '10px', color: 'var(--ash)', fontFamily: 'var(--font-mono)' }}>USIA PERNIKAHAN</span>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--white)' }}>
                          {item.range}
                        </span>
                      </div>
                      <div style={{
                        padding: '6px 12px',
                        backgroundColor: styles.badgeBg,
                        color: styles.badgeColor,
                        border: `1px solid ${styles.badgeBorder}`,
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 700,
                        textAlign: 'right'
                      }}>
                        {item.meaning}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Advice */}
          {catatan && (
            <div style={{
              marginTop: '10px',
              padding: '16px',
              border: '1px solid rgba(0, 210, 255, 0.2)',
              backgroundColor: 'rgba(0, 210, 255, 0.02)',
              borderRadius: '4px',
              display: 'flex',
              gap: '12px',
              alignItems: 'start'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '20px' }}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="var(--cyan-pulse, #00d2ff)" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  width="18" 
                  height="18"
                  style={{ filter: 'drop-shadow(0 0 5px rgba(0, 210, 255, 0.5))' }}
                >
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5.5 5.5 0 0 0 7 8c0 1.3.5 2.6 1.5 3.5.7.8 1.3 1.5 1.5 2.5" />
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className="response-label" style={{ color: 'var(--cyan-pulse, #00d2ff)', fontSize: '10px' }}>SARAN & PENJELASAN</span>
                <span style={{ fontSize: '12px', color: 'var(--smoke)', lineHeight: '1.5' }}>
                  {catatan}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Ramalan Cinta Layout
  if (activeTopic.id === 'ramalan-cinta') {
    const { person1 = {}, person2 = {}, positif = '', negatif = '', catatan } = resData;

    const positiveTraits = positif ? positif.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
    const negativeTraits = negatif ? negatif.split(',').map((t: string) => t.trim()).filter(Boolean) : [];

    return (
      <div className="response-layout">
        <div className="response-header">
          <h2 className="response-title">
            {activeTopic.title}
          </h2>
        </div>

        <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Couple profiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', alignItems: 'center' }}>
            {/* Person 1 */}
            <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)', textAlign: 'center' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>PIHAK PERTAMA</span>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--white)', margin: '4px 0 2px 0', textTransform: 'capitalize' }}>
                {person1.nama || 'Nama 1'}
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--gold, #ffaa00)', fontFamily: 'var(--font-mono)' }}>
                {person1.tgl_lahir}
              </span>
            </div>

            {/* Connection Icon */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', userSelect: 'none' }}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#ff4d4d" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                width="32" 
                height="32"
                style={{ 
                  filter: 'drop-shadow(0 0 8px rgba(255, 77, 77, 0.6))',
                  display: 'block'
                }}
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </div>

            {/* Person 2 */}
            <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)', textAlign: 'center' }}>
              <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>PIHAK KEDUA</span>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--white)', margin: '4px 0 2px 0', textTransform: 'capitalize' }}>
                {person2.nama || 'Nama 2'}
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--gold, #ffaa00)', fontFamily: 'var(--font-mono)' }}>
                {person2.tgl_lahir}
              </span>
            </div>
          </div>

          {/* Sisi Positif & Negatif */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {/* Positive traits */}
            <div className="response-subcard" style={{ padding: '16px', border: '1px solid rgba(16, 185, 129, 0.2)', backgroundColor: 'rgba(16, 185, 129, 0.01)' }}>
              <span className="response-label" style={{ color: '#10b981', display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14" style={{ marginRight: '6px' }}>
                  <path d="M12 2c0 5.523 4.477 10 10 10-5.523 0-10 4.477-10 10 0-5.523-4.477-10-10-10 5.523 0 10-4.477 10-10z" />
                </svg>
                SISI POSITIF ANDA
              </span>
              {positiveTraits.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {positiveTraits.map((trait: string, idx: number) => (
                    <span key={idx} style={{
                      padding: '4px 10px',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      color: '#10b981',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      {trait}
                    </span>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: '12px', color: 'var(--ash)' }}>Tidak ada data</span>
              )}
            </div>

            {/* Negative traits */}
            <div className="response-subcard" style={{ padding: '16px', border: '1px solid rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.01)' }}>
              <span className="response-label" style={{ color: '#ef4444', display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" style={{ marginRight: '6px' }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                SISI NEGATIF ANDA
              </span>
              {negativeTraits.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {negativeTraits.map((trait: string, idx: number) => (
                    <span key={idx} style={{
                      padding: '4px 10px',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      {trait}
                    </span>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: '12px', color: 'var(--ash)' }}>Tidak ada data</span>
              )}
            </div>
          </div>

          {/* Advice / Catatan */}
          {catatan && (
            <div style={{
              marginTop: '10px',
              padding: '16px',
              border: '1px solid rgba(255, 77, 77, 0.2)',
              backgroundColor: 'rgba(255, 77, 77, 0.01)',
              borderRadius: '4px',
              display: 'flex',
              gap: '12px',
              alignItems: 'start'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '20px', userSelect: 'none' }}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#ff4d4d" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  width="18" 
                  height="18"
                  style={{ filter: 'drop-shadow(0 0 5px rgba(255, 77, 77, 0.5))' }}
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className="response-label" style={{ color: '#ff4d4d', fontSize: '10px' }}>ANALISIS HUBUNGAN</span>
                <span style={{ fontSize: '12px', color: 'var(--smoke)', lineHeight: '1.5' }}>
                  {catatan}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Nomor HP Hoki Layout
  const getPositiveColor = (percentageStr: string) => {
    try {
      const val = parseFloat(percentageStr.replace('%', ''));
      if (val >= 60) return 'var(--gold, #ffaa00)';
      return 'var(--cyan-pulse, #00d2ff)';
    } catch {
      return 'var(--cyan-pulse, #00d2ff)';
    }
  };

  const { nomer, bagua_shuzi, energi_positif, energi_negatif, catatan } = resData;

  const posPercentage = energi_positif?.persentase || '0%';
  const negPercentage = energi_negatif?.persentase || '0%';

  return (
    <div className="response-layout">
      <div className="response-header">
        <h2 className="response-title">
          {activeTopic.title} Result
        </h2>
      </div>

      <div className="response-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
        {/* Main Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
            <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>NOMOR HP</span>
            <span className="response-value-mono" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--white)', marginTop: '4px' }}>
              {nomer}
            </span>
          </div>

          <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
            <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>BAGUA SHUZI</span>
            <span className="response-value-mono" style={{ fontSize: '20px', fontWeight: 700, color: getPositiveColor(bagua_shuzi), marginTop: '4px' }}>
              {bagua_shuzi}
            </span>
          </div>

          <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
            <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>ENERGI POSITIF</span>
            <span className="response-value-mono" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--gold, #ffaa00)', marginTop: '4px' }}>
              {posPercentage}
            </span>
          </div>

          <div className="response-subcard" style={{ padding: '16px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
            <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)' }}>ENERGI NEGATIF</span>
            <span className="response-value-mono" style={{ fontSize: '20px', fontWeight: 700, color: 'rgba(255, 77, 77, 0.8)', marginTop: '4px' }}>
              {negPercentage}
            </span>
          </div>
        </div>

        {/* Energy breakdown columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '10px' }}>
          {/* Positive Energy Panel */}
          <div style={{ border: '1px solid rgba(255, 170, 0, 0.2)', padding: '16px', backgroundColor: 'rgba(255, 170, 0, 0.02)' }}>
            <div style={{ borderBottom: '1px dashed rgba(255, 170, 0, 0.2)', paddingBottom: '8px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold, #ffaa00)', fontFamily: 'var(--font-mono)' }}>ENERGI POSITIF</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold, #ffaa00)', fontFamily: 'var(--font-mono)' }}>{posPercentage}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {energi_positif && Object.entries(energi_positif).map(([key, val]) => {
                if (key === 'persentase') return null;
                const formattedKey = key.replace(/_/g, ' ').toUpperCase();
                return (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: 'var(--ash)' }}>{formattedKey}</span>
                    <span style={{ color: 'var(--white)', fontWeight: 700 }}>{String(val)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Negative Energy Panel */}
          <div style={{ border: '1px solid rgba(255, 77, 77, 0.2)', padding: '16px', backgroundColor: 'rgba(255, 77, 77, 0.02)' }}>
            <div style={{ borderBottom: '1px dashed rgba(255, 77, 77, 0.2)', paddingBottom: '8px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#ff4d4d', fontFamily: 'var(--font-mono)' }}>ENERGI NEGATIF</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#ff4d4d', fontFamily: 'var(--font-mono)' }}>{negPercentage}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {energi_negatif && Object.entries(energi_negatif).map(([key, val]) => {
                if (key === 'persentase') return null;
                const formattedKey = key.replace(/_/g, ' ').toUpperCase();
                return (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: 'var(--ash)' }}>{formattedKey}</span>
                    <span style={{ color: 'var(--white)', fontWeight: 700 }}>{String(val)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Notes list */}
        {catatan && catatan.length > 0 && (
          <div style={{ marginTop: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <span className="response-label" style={{ fontSize: '10px', color: 'var(--ash)', marginBottom: '8px', display: 'block' }}>CATATAN / PENJELASAN</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {catatan.map((note: string, idx: number) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'start', fontSize: '12px', color: 'var(--smoke)', lineHeight: '1.5' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--gold, #ffaa00)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="10" height="10" style={{ marginTop: '4px', flexShrink: 0 }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
