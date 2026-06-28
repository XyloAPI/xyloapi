interface QRDecoderLayoutProps {
  resData: any;
}

export default function QRDecoderLayout({ resData }: QRDecoderLayoutProps) {
  return (
    <div className="response-layout">
      <div className="response-header">
        <h2 className="response-title">
          Decoded Content
        </h2>
      </div>

      <div className="response-list">
        <div className="response-card">
          <span className="response-label">
            DECODED TEXT / URL
          </span>
          <div className="response-value" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {resData.text}
          </div>
          {resData.text && (resData.text.startsWith('http://') || resData.text.startsWith('https://')) && (
            <a
              href={resData.text}
              target="_blank"
              rel="noreferrer"
              className="btn btn-gold"
              style={{ display: 'inline-flex', marginTop: '12px', textDecoration: 'none', padding: '6px 12px', fontSize: '10px', fontWeight: 700 }}
            >
              OPEN LINK
            </a>
          )}
        </div>

        <div className="response-grid-2">
          {resData.format && (
            <div className="response-subcard">
              <span className="response-label">BARCODE FORMAT</span>
              <span className="response-value-mono">{resData.format}</span>
            </div>
          )}
          {resData.type && (
            <div className="response-subcard">
              <span className="response-label">RESULT TYPE</span>
              <span className="response-value-mono">{resData.type}</span>
            </div>
          )}
          {resData.raw_bytes && (
            <div className="response-subcard" style={{ gridColumn: 'span 2' }}>
              <span className="response-label" style={{ marginBottom: '4px' }}>RAW BYTES</span>
              <span className="response-value-mono" style={{ color: 'var(--ash)', display: 'block', whiteSpace: 'pre-wrap', maxHeight: '100px', overflowY: 'auto' }}>
                {resData.raw_bytes}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
