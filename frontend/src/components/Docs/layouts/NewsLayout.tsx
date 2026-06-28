interface NewsLayoutProps {
  resData: any;
}

export default function NewsLayout({ resData }: NewsLayoutProps) {
  return (
    <div className="response-layout">
      <div className="response-header">
        <h2 className="response-title">
          {resData.source || 'The Straits Times'}
        </h2>
        <span className="response-label" style={{ marginTop: '4px' }}>
          CATEGORY: <span style={{ color: 'var(--gold-text)' }}>{resData.category}</span> · {resData.total} ARTICLES
        </span>
      </div>
      
      <div className="response-list">
        {resData.articles && resData.articles.map((article: any, idx: number) => (
          <a
            key={idx}
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="response-item"
            style={{ textDecoration: 'none', transition: 'border-color 0.2s', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '14px' }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--gold)')}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
          >
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                referrerPolicy="no-referrer"
                style={{ width: '80px', height: '55px', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border-color)', borderRadius: '0px' }}
                onError={(e) => {
                  const currentSrc = e.currentTarget.src;
                  if (currentSrc && !currentSrc.includes('/api/image-proxy')) {
                    const host = (window.location.hostname === 'localhost' && window.location.port !== '3000') ? 'http://localhost:5000' : window.location.origin;
                    e.currentTarget.src = `${host}/api/image-proxy?url=${encodeURIComponent(article.image)}`;
                  } else {
                    e.currentTarget.style.display = 'none';
                  }
                }}
              />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <span className="response-value" style={{ display: 'block', fontSize: '13px', fontWeight: 700, lineHeight: 1.4 }}>{article.title}</span>
              {article.description && (
                <span className="response-value" style={{ display: 'block', fontSize: '11px', color: 'var(--ash)', marginTop: '4px', lineHeight: 1.5 }}>{article.description}</span>
              )}
              <span className="response-value-mono" style={{ display: 'block', fontSize: '10px', color: 'var(--ash)', marginTop: '6px', opacity: 0.7 }}>
                {article.published ? (() => {
                  const d = new Date(article.published);
                  return isNaN(d.getTime()) ? article.published : d.toLocaleString();
                })() : ''}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
