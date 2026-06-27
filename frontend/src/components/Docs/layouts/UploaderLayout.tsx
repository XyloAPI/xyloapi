import { Upload } from 'lucide-react';
import type { DocTopic } from '../types';

interface UploaderLayoutProps {
  activeTopic: DocTopic;
  resData: any;
  copyToClipboard: (text: string) => void;
}

export default function UploaderLayout({ activeTopic, resData, copyToClipboard }: UploaderLayoutProps) {
  const isImage = resData.type && resData.type.startsWith('image/');
  return (
    <div className="response-layout">
      <div className="response-header">
        <span className="response-status-badge">✓ CDN UPLOAD SUCCESSFUL</span>
        <h2 className="response-title">
          {activeTopic.title.replace(' Uploader', ' Hosted Asset')}
        </h2>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'start' }}>
        <div style={{ maxWidth: '100%', boxSizing: 'border-box', border: '1px solid var(--border-color)', padding: '8px', backgroundColor: 'var(--black)' }}>
          {isImage ? (
            <img src={resData.link} alt="Uploaded Asset" style={{ maxWidth: '100%', width: '240px', maxHeight: '240px', display: 'block', objectFit: 'contain' }} />
          ) : (
            <div style={{ maxWidth: '100%', width: '240px', height: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--ash)', fontFamily: 'var(--font-mono)', fontSize: '11px', gap: '12px', boxSizing: 'border-box' }}>
              <Upload size={40} style={{ color: 'var(--gold)' }} />
              <span>NON-IMAGE FILE HOSTED</span>
            </div>
          )}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <span className="response-label" style={{ marginBottom: '4px' }}>DIRECT URL</span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                readOnly
                value={resData.link}
                style={{ flex: 1, padding: '8px 12px', backgroundColor: 'var(--black)', color: 'var(--white)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-mono)', fontSize: '12px', outline: 'none', borderRadius: '0px' }}
              />
              <button
                onClick={() => copyToClipboard(resData.link)}
                className="btn btn-gold"
                style={{ padding: '8px 16px', fontSize: '11px', fontWeight: 700 }}
              >
                COPY
              </button>
            </div>
          </div>

          <div className="response-grid-2">
            {resData.view_url && (
              <div className="response-subcard" style={{ gridColumn: 'span 2' }}>
                <span className="response-label">VIEWER PAGE</span>
                <a href={resData.view_url} target="_blank" rel="noreferrer" className="response-value-mono" style={{ fontSize: '11px', color: 'var(--gold-text)', fontWeight: 700, textDecoration: 'none' }}>{resData.view_url}</a>
              </div>
            )}
            {resData.delete_url && (
              <div className="response-subcard" style={{ gridColumn: 'span 2' }}>
                <span className="response-label">DELETE LINK</span>
                <a href={resData.delete_url} target="_blank" rel="noreferrer" className="response-value-mono" style={{ fontSize: '11px', color: 'var(--red-pulse)', fontWeight: 700, textDecoration: 'none' }}>{resData.delete_url}</a>
              </div>
            )}
            {resData.width && resData.height && (
              <div className="response-subcard">
                <span className="response-label">DIMENSIONS</span>
                <span className="response-value-mono" style={{ fontSize: '13px', fontWeight: 700 }}>{resData.width} x {resData.height} px</span>
              </div>
            )}
            {resData.size && (
              <div className="response-subcard">
                <span className="response-label">FILE SIZE</span>
                <span className="response-value-mono" style={{ fontSize: '13px', fontWeight: 700 }}>{(resData.size / 1024).toFixed(1)} KB</span>
              </div>
            )}
            {resData.type && (
              <div className="response-subcard">
                <span className="response-label">MIME TYPE</span>
                <span className="response-value-mono" style={{ fontSize: '13px', fontWeight: 700 }}>{resData.type}</span>
              </div>
            )}
            {resData.deletehash && (
              <div className="response-subcard">
                <span className="response-label">DELETE HASH</span>
                <span className="response-value-mono" style={{ fontSize: '13px', color: 'var(--gold-text)', fontWeight: 700 }}>{resData.deletehash}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
