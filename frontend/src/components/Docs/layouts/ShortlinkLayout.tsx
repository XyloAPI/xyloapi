interface ShortlinkLayoutProps {
  resData: any;
  copyToClipboard: (text: string) => void;
}

export default function ShortlinkLayout({ resData, copyToClipboard }: ShortlinkLayoutProps) {
  return (
    <div className="response-layout">
      <div className="response-header">
        <h2 className="response-title">
          Shortlink Result
        </h2>
      </div>

      <div className="response-list">
        <div className="response-card">
          <span className="response-label">
            SHORTENED URL
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              readOnly
              value={resData.short || ''}
              style={{ flex: 1, padding: '8px 12px', backgroundColor: '#111', color: 'var(--white)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-mono)', fontSize: '13px', outline: 'none', borderRadius: '0px' }}
            />
            <button
              onClick={() => copyToClipboard(resData.short || '')}
              className="btn btn-gold"
              style={{ padding: '8px 16px', fontSize: '11px', fontWeight: 700 }}
            >
              COPY
            </button>
          </div>
          {resData.short && (
            <a
              href={resData.short}
              target="_blank"
              rel="noreferrer"
              className="btn btn-gold"
              style={{ display: 'inline-flex', marginTop: '12px', textDecoration: 'none', padding: '6px 12px', fontSize: '10px', fontWeight: 700 }}
            >
              VISIT LINK
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
