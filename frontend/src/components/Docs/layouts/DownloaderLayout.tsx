import CustomVideoPlayer from '../CustomVideoPlayer';

interface DownloaderLayoutProps {
  resData: any;
  copyToClipboard: (text: string) => void;
}

export default function DownloaderLayout({ resData, copyToClipboard }: DownloaderLayoutProps) {
  // Helper function to check if a link is a video
  const isVideoLink = (link: any) => {
    if (!link || !link.url) return false;
    const url = link.url;
    const label = (link.label || '').toLowerCase();
    if (label.includes('video') || label.includes('mp4') || label.includes('unduh video')) {
      return true;
    }
    const cleanUrl = url.split('?')[0].toLowerCase();
    return (
      cleanUrl.endsWith('.mp4') ||
      cleanUrl.endsWith('.webm') ||
      cleanUrl.endsWith('.mov') ||
      cleanUrl.endsWith('.m4v') ||
      url.includes('video') ||
      url.includes('.mp4') ||
      url.includes('tiktokcdn') ||
      url.includes('snapsave') ||
      url.includes('rapidcdn.app')
    );
  };

  // Extract the first video URL if available
  let videoSource = '';
  if (resData.links) {
    if (Array.isArray(resData.links)) {
      const foundVideo = resData.links.find((l: any) => isVideoLink(l));
      if (foundVideo) {
        videoSource = foundVideo.url;
      }
    } else {
      videoSource = resData.links.nowatermark || resData.links.watermark || resData.links.video || '';
    }
  }

  return (
    <div className="response-layout">
      <div className="response-header">
        <span className="response-status-badge">✓ DOWNLOAD LINKS EXTRACTED</span>
        <h2 className="response-title">
          {resData.title || 'TikTok Downloader'}
        </h2>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'start' }}>
        {videoSource ? (
          <CustomVideoPlayer src={videoSource} poster={resData.cover} />
        ) : (
          resData.cover && (
            <div style={{ maxWidth: '100%', boxSizing: 'border-box', border: '1px solid var(--border-color)', padding: '8px', backgroundColor: 'var(--black)' }}>
              <img src={resData.cover} referrerPolicy="no-referrer" alt="Video Thumbnail" style={{ maxWidth: '100%', width: '240px', maxHeight: '240px', display: 'block', objectFit: 'contain' }} />
            </div>
          )
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="response-grid-2">
            {resData.creator && (
              <div className="response-subcard">
                <span className="response-label">CREATOR</span>
                <span className="response-value-mono" style={{ fontSize: '13px', fontWeight: 700 }}>{resData.creator}</span>
              </div>
            )}
            {resData.duration && (
              <div className="response-subcard">
                <span className="response-label">DURATION</span>
                <span className="response-value-mono" style={{ fontSize: '13px', fontWeight: 700 }}>{resData.duration}</span>
              </div>
            )}
            {resData.description && (
              <div className="response-subcard" style={{ gridColumn: 'span 2' }}>
                <span className="response-label">DESCRIPTION</span>
                <span className="response-value-mono" style={{ fontSize: '12px' }}>{resData.description}</span>
              </div>
            )}
          </div>

          {resData.links && (
            <div className="response-list" style={{ marginTop: '10px' }}>
              <span className="response-label">DOWNLOAD FORMATS</span>

              {!Array.isArray(resData.links) && resData.links.nowatermark && (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <a href={resData.links.nowatermark} target="_blank" rel="noreferrer" className="btn btn-gold" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', padding: '8px 16px', fontSize: '11px', fontWeight: 700, flex: 1 }}>
                    DOWNLOAD VIDEO (NO WATERMARK)
                  </a>
                  <button onClick={() => copyToClipboard(resData.links.nowatermark)} className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '11px', fontWeight: 700 }}>
                    COPY
                  </button>
                </div>
              )}

              {!Array.isArray(resData.links) && resData.links.watermark && (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <a href={resData.links.watermark} target="_blank" rel="noreferrer" className="btn btn-gold" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', padding: '8px 16px', fontSize: '11px', fontWeight: 700, flex: 1, filter: 'grayscale(0.6)' }}>
                    DOWNLOAD VIDEO (WITH WATERMARK)
                  </a>
                  <button onClick={() => copyToClipboard(resData.links.watermark)} className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '11px', fontWeight: 700 }}>
                    COPY
                  </button>
                </div>
              )}

              {!Array.isArray(resData.links) && resData.links.audio && (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <a href={resData.links.audio} target="_blank" rel="noreferrer" className="btn btn-gold" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', padding: '8px 16px', fontSize: '11px', fontWeight: 700, flex: 1 }}>
                    DOWNLOAD AUDIO (MP3)
                  </a>
                  <button onClick={() => copyToClipboard(resData.links.audio)} className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '11px', fontWeight: 700 }}>
                    COPY
                  </button>
                </div>
              )}

              {Array.isArray(resData.links) && resData.links.map((link: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <a href={link.url} target="_blank" rel="noreferrer" className="btn btn-gold" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', padding: '8px 16px', fontSize: '11px', fontWeight: 700, flex: 1 }}>
                    {link.label || `DOWNLOAD MEDIA ${idx + 1}`}
                  </a>
                  <button onClick={() => copyToClipboard(link.url)} className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '11px', fontWeight: 700 }}>
                    COPY
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
