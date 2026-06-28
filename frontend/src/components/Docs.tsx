import { useState, useEffect } from 'react';
import './Docs.css';
import { RefreshCw, Send, Check, Upload, Search } from 'lucide-react';
import CustomDropdown from './Docs/CustomDropdown';
import type { DocTopic } from './Docs/types';
import { docTopics } from './Docs/topicsData';

import ImageToolsLayout from './Docs/layouts/ImageToolsLayout';
import QRDecoderLayout from './Docs/layouts/QRDecoderLayout';
import ShortlinkLayout from './Docs/layouts/ShortlinkLayout';
import DownloaderLayout from './Docs/layouts/DownloaderLayout';
import NewsLayout from './Docs/layouts/NewsLayout';
import UploaderLayout from './Docs/layouts/UploaderLayout';
import AIChatLayout from './Docs/layouts/AIChatLayout';
import BMKGLayout from './Docs/layouts/BMKGLayout';
import InformationsLayout from './Docs/layouts/InformationsLayout';
import PrimbonLayout from './Docs/layouts/PrimbonLayout';
import SearchLayout from './Docs/layouts/SearchLayout';

export default function Docs() {
  const [activeTopic, setActiveTopic] = useState<DocTopic | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [responseJson, setResponseJson] = useState<any>(null);
  const [responseTab, setResponseTab] = useState<'json' | 'visual'>('visual');

  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string>('');
  const [focusedField, setFocusedField] = useState<string | null>(null);


  // Populate dynamic form variables on topic selection
  useEffect(() => {
    const initial: { [key: string]: any } = {};
    if (activeTopic && activeTopic.payloadTemplate) {
      Object.entries(activeTopic.payloadTemplate).forEach(([key, val]) => {
        initial[key] = val;
      });
    }
    setFormValues(initial);
    setResponseJson(null);
    setResponseTab('visual');
  }, [activeTopic]);

  useEffect(() => {
    if (activeTopic) {
      setSelectedCategory(activeTopic.category);
    }
  }, [activeTopic]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Construct JSON request payload programmatically from formState values
  const getPayloadJson = () => {
    if (!activeTopic) return '';
    const bodyObj: any = {};
    if (activeTopic.payloadTemplate) {
      Object.entries(activeTopic.payloadTemplate).forEach(([key, val]) => {
        bodyObj[key] = val;
      });
    }
    Object.entries(formValues).forEach(([key, val]) => {
      bodyObj[key] = val;
    });

    // Fallback for select parameters
    if (activeTopic.parameters) {
      activeTopic.parameters.forEach(param => {
        if (param.type === 'select' && (bodyObj[param.name] === undefined || bodyObj[param.name] === '')) {
          const firstOpt = param.options?.[0];
          if (firstOpt) {
            bodyObj[param.name] = typeof firstOpt === 'string' ? firstOpt : firstOpt.value;
          }
        }
      });
    }
    return JSON.stringify(bodyObj, null, 2);
  };

  const getActiveMethod = () => {
    if (!activeTopic) return 'GET';
    const hasFileParam = activeTopic.parameters?.some(p => p.type === 'file');
    if (hasFileParam) {
      return uploadMode === 'file' ? 'POST' : 'GET';
    }
    return activeTopic.method || 'GET';
  };

  const getEvaluatedUrl = () => {
    const topic = activeTopic;
    if (!topic) return '';
    let path = topic.path || '';

    // Replace route parameters if any (e.g. :id or :slug)
    if (topic.parameters) {
      topic.parameters.forEach(param => {
        const placeholder = `:${param.name}`;
        if (path.includes(placeholder)) {
          const val = formValues[param.name];
          const displayVal = val ? encodeURIComponent(String(val)) : `:${param.name}`;
          path = path.replace(placeholder, displayVal);
        }
      });
    }

    const host = (window.location.hostname === 'localhost' && window.location.port !== '3000') ? 'http://localhost:5000' : window.location.origin;
    let url = `${host}${path}`;

    // Append remaining parameters as query string for GET
    const method = getActiveMethod();
    if (method === 'GET') {
      const queryParts: string[] = [];
      const hasFileParam = topic.parameters?.some(p => p.type === 'file');
      if (hasFileParam) {
        const val = formValues['url'] !== undefined ? formValues['url'] : '';
        const displayVal = val ? encodeURIComponent(String(val)) : ':url';
        queryParts.push(`url=${displayVal}`);

        // For Image Tools: also append other query parameters (intensity, radius, etc.)
        if (topic.parameters) {
          topic.parameters.forEach(param => {
            if (param.name !== 'image' && param.name !== 'url') {
              let val = formValues[param.name] !== undefined ? formValues[param.name] : '';
              if (param.type === 'select' && (val === undefined || val === '')) {
                const firstOpt = param.options?.[0];
                if (firstOpt) val = typeof firstOpt === 'string' ? firstOpt : (firstOpt as any).value;
              }
              const displayVal = val !== '' ? encodeURIComponent(String(val)) : `:${param.name}`;
              queryParts.push(`${param.name}=${displayVal}`);
            }
          });
        }
      } else if (topic.parameters) {
        topic.parameters.forEach(param => {
          const isPathSnippet = path.includes(`:${param.name}`) || (topic.path && topic.path.includes(`:${param.name}`));
          if (!isPathSnippet) {
            let val = formValues[param.name] !== undefined ? formValues[param.name] : '';
            if (param.type === 'select' && (val === undefined || val === '')) {
              const firstOpt = param.options?.[0];
              if (firstOpt) val = typeof firstOpt === 'string' ? firstOpt : (firstOpt as any).value;
            }
            const displayVal = val !== '' ? encodeURIComponent(String(val)) : `:${param.name}`;
            queryParts.push(`${param.name}=${displayVal}`);
          }
        });
      }
      if (queryParts.length > 0) {
        url += `?${queryParts.join('&')}`;
      }
    } else if (topic.parameters) {
      // For POST: still show select-type params in URL for visual clarity
      const selectParams = topic.parameters.filter((p: any) => p.type === 'select');
      if (selectParams.length > 0) {
        const params = new URLSearchParams();
        selectParams.forEach((param: any) => {
          let val = formValues[param.name] !== undefined ? formValues[param.name] : '';
          if (param.type === 'select' && (val === undefined || val === '')) {
            const firstOpt = param.options?.[0];
            if (firstOpt) val = typeof firstOpt === 'string' ? firstOpt : (firstOpt as any).value;
          }
          if (val) params.append(param.name, String(val));
        });
        const qs = params.toString();
        if (qs) url += `?${qs}`;
      }
    }
    return url;
  };

  const handleSendRequest = async () => {
    setLoading(true);
    setResponseJson(null);

    const method = getActiveMethod();
    const requestUrl = getEvaluatedUrl();

    try {
      const options: RequestInit = {
        method,
        headers: {}
      };

      if (method === 'POST') {
        options.headers = {
          'Content-Type': 'application/json'
        };
        options.body = getPayloadJson();
      }

      const res = await fetch(requestUrl, options);
      if (res.ok) {
        const json = await res.json();
        setResponseJson(json);
      } else {
        const errText = await res.text().catch(() => 'No response body');
        let parsedError = 'Request execution failed.';
        try {
          const parsed = JSON.parse(errText);
          if (parsed && (parsed.error || parsed.message)) {
            parsedError = parsed.error || parsed.message;
          }
        } catch (e) { }
        setResponseJson({
          success: false,
          message: parsedError
        });
      }
    } catch (err) {
      setResponseJson({
        success: false,
        message: err instanceof Error ? err.message : 'Request execution failed.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Group topics by category & filter them by search query
  const filteredTopics = docTopics.filter(topic => {
    const query = searchQuery.toLowerCase();
    return (
      topic.title.toLowerCase().includes(query) ||
      (topic.path ?? '').toLowerCase().includes(query) ||
      topic.category.toLowerCase().includes(query) ||
      (topic.description && topic.description.toLowerCase().includes(query))
    );
  });

  const categories = filteredTopics.reduce((acc: { [key: string]: DocTopic[] }, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Sort topics alphabetically (A-Z) by title on the frontend
  Object.keys(categories).forEach(category => {
    categories[category].sort((a, b) => a.title.localeCompare(b.title));
  });



  // Generate copyable curl code string
  const getCurlCode = () => {
    if (!activeTopic) return '';
    const method = getActiveMethod();
    const evalUrl = getEvaluatedUrl();
    if (method === 'GET') {
      return `curl "${evalUrl}"`;
    }
    const hasFileParam = activeTopic.parameters?.some(p => p.type === 'file');
    if (hasFileParam) {
      const payload: any = {};
      if (activeTopic.payloadTemplate) {
        Object.entries(activeTopic.payloadTemplate).forEach(([k, v]) => {
          if (k === 'image' || k === 'url' || k === 'data') {
            payload[k] = uploadMode === 'file' ? 'data:image/jpeg;base64,...' : 'https://example.com/photo.jpg';
          } else {
            payload[k] = v;
          }
        });
      } else {
        payload[uploadMode === 'file' ? 'image' : 'url'] = uploadMode === 'file' ? 'data:image/jpeg;base64,...' : 'https://example.com/photo.jpg';
      }
      return `curl -X POST "${evalUrl}" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(payload, null, 2).replace(/\n/g, '\n    ')}'`;
    }
    return `curl -X POST "${evalUrl}" \\\n  -H "Content-Type: application/json" \\\n  -d '${getPayloadJson().replace(/\n/g, '\n    ')}'`;
  };

  // Renders the beautifully formatted "visual" (Hasil Jadi) tab output
  const renderVisualResult = () => {
    if (!activeTopic || !responseJson) return null;

    if (!responseJson.success) {
      return (
        <div style={{ color: 'var(--red-pulse)', padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
          <strong>Error executing gateway transaction:</strong>
          <p style={{ marginTop: '8px', color: 'var(--ash)' }}>
            {responseJson.message || 'Request execution failed.'}
          </p>
        </div>
      );
    }

    const resData = responseJson.data;
    if (!resData) {
      // General fallbacks if success: true but no specific payload format
      return (
        <div style={{ padding: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--cyan-pulse)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>✓ Core Request OK</span>
          <p style={{ fontSize: '13px', marginTop: '12px', color: 'var(--smoke)' }}>The API request completed successfully. Switch to JSON version tab to inspect the configuration array payload details.</p>
        </div>
      );
    }

    // 5. Image Tools / AI Image Layout
    if ((activeTopic.category === 'Image Tools' || activeTopic.category === 'QR Tools' || activeTopic.category === 'AI Image' || activeTopic.category === 'AI Image Edit' || activeTopic.category === 'Maker' || activeTopic.category === 'Tools' || activeTopic.id === 'base64-to-image') && resData) {
      return (
        <ImageToolsLayout
          activeTopic={activeTopic}
          resData={resData}
          copyToClipboard={copyToClipboard}
        />
      );
    }

    // 7. QR Decoder Layout
    if (activeTopic.id === 'qr-decoder' && resData) {
      return <QRDecoderLayout resData={resData} />;
    }

    // 8. Shortlink Layout
    if (activeTopic.category === 'Shortlink Tools' && resData) {
      return (
        <ShortlinkLayout
          resData={resData}
          copyToClipboard={copyToClipboard}
        />
      );
    }

    // 6. Downloader Layout
    if (activeTopic.category === 'Downloader' && resData) {
      return (
        <DownloaderLayout
          resData={resData}
          copyToClipboard={copyToClipboard}
        />
      );
    }

    // 7. News Layout
    if ((activeTopic.category === 'News' || activeTopic.category === 'Local News') && resData && resData.articles) {
      return <NewsLayout resData={resData} />;
    }

    // 5. CDN Uploader Layout
    if ((activeTopic.category === 'Media Uploaders' || activeTopic.category === 'File Uploaders') && resData && resData.link) {
      return (
        <UploaderLayout
          activeTopic={activeTopic}
          resData={resData}
          copyToClipboard={copyToClipboard}
        />
      );
    }

    // 9. AI Chat Layout
    if (activeTopic.category === 'AI Chat' && resData) {
      return <AIChatLayout activeTopic={activeTopic} resData={resData} />;
    }

    // 10. BMKG Indonesia Layout
    if (activeTopic.category === 'BMKG Indonesia' && resData) {
      return <BMKGLayout activeTopic={activeTopic} resData={resData} />;
    }

    if ((activeTopic.category === 'Informations' || activeTopic.category === 'DNS Tools' || activeTopic.category === 'Email Tools' || activeTopic.category === 'IP Tools' || activeTopic.category === 'Dev Tools' || activeTopic.category === 'Cyber Security Tools') && resData) {
      return <InformationsLayout activeTopic={activeTopic} resData={resData} />;
    }

    if (activeTopic.category === 'Primbon' && resData) {
      return <PrimbonLayout activeTopic={activeTopic} resData={resData} />;
    }

    if (activeTopic.category === 'Search' && resData) {
      return (
        <SearchLayout
          resData={resData}
          copyToClipboard={copyToClipboard}
        />
      );
    }


    return (
      <pre className="response-pre">
        <code>{JSON.stringify(responseJson, null, 2)}</code>
      </pre>
    );
  };
  // Helper: renders the full interactive playground for a topic
  const renderPlayground = (topic: DocTopic) => {
    const hasFileParam = topic.parameters?.some(p => p.type === 'file');
    const isUploaderUrl = hasFileParam && uploadMode === 'url';

    return (
      <div className="docs-endpoint-detail-expanded">
        {/* Title and Description */}
        <div className="docs-playground-header">
          <div className="docs-content-header" style={{ marginBottom: '12px', borderBottom: 'none', paddingBottom: '0' }}>
            <span className="docs-pretitle">{topic.category.toUpperCase()}</span>
            <h2 className="docs-title" style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', margin: '4px 0 8px 0' }}>{topic.title}</h2>
          </div>
          <p className="docs-description-text" style={{ margin: '0 0 20px 0', fontSize: '13px', color: 'var(--ash)' }}>{topic.description}</p>
        </div>

        {/* 2-column playground layout */}
        <div className="docs-playground-grid">
          {/* Left Column: Form Parameters */}
          <div className="docs-playground-left-col">
            {/* Endpoint URL bar */}
            {topic.path && (
              <div className="docs-playground-url-bar" style={{
                border: '1px solid var(--border-color)',
                padding: '10px 14px',
                backgroundColor: 'var(--black)',
                marginBottom: '20px',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1, flexWrap: 'wrap' }}>
                  <span className={`method-badge ${getActiveMethod().toLowerCase()}`}>
                    {getActiveMethod()}
                  </span>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--white)', fontWeight: 700, wordBreak: 'break-all' }}>
                    {getEvaluatedUrl()}
                  </code>
                </div>
                <button
                  onClick={() => { navigator.clipboard.writeText(getCurlCode()); setCopiedText('curl'); setTimeout(() => setCopiedText(''), 2000); }}
                  className="docs-playground-url-btn"
                  style={{ padding: '6px 10px', backgroundColor: 'var(--dark-iron)', color: 'var(--white)', border: '1px solid var(--border-color)', fontSize: '9px', fontFamily: 'var(--font-mono)', cursor: 'pointer', borderRadius: '0px', transition: 'border-color 0.2s', flexShrink: 0 }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--gold)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  {copiedText === 'curl' ? '✓' : 'COPY'}
                </button>
              </div>
            )}

            {/* Parameters Form */}
            {topic.method && (
              <div className="docs-section" style={{ marginTop: '0' }}>
                <h3 className="section-title" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px 0', borderBottom: '1px dashed var(--border-color)', paddingBottom: '6px' }}>Parameters</h3>
                <div style={{ border: '1px solid var(--border-color)', padding: '20px', backgroundColor: 'var(--black)' }}>
                  {topic.parameters && topic.parameters.length > 0 ? (
                    <div>
                      {topic.parameters.map(param => {
                        const isRequired = param.required;
                        const val = isUploaderUrl ? (formValues['url'] ?? '') : (formValues[param.name] ?? '');
                        const label = isUploaderUrl ? 'url' : param.name;
                        return (
                          <div key={param.name} className="docs-form-field" style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--white)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              {label} {isRequired && <span style={{ color: 'var(--gold-text)' }}>*</span>}
                            </label>
                            {param.type === 'file' ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', gap: '1px', backgroundColor: 'var(--border-color)', width: 'fit-content', marginBottom: '4px' }}>
                                  <button type="button" onClick={() => { setUploadMode('file'); setFormValues(prev => ({ ...prev, [param.name]: '', url: undefined })); }} style={{ padding: '4px 8px', fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700, backgroundColor: uploadMode === 'file' ? 'var(--dark-iron)' : 'var(--black)', color: uploadMode === 'file' ? 'var(--white)' : 'var(--ash)', border: 'none', cursor: 'pointer', borderRadius: '0px' }}>FILE</button>
                                  <button type="button" onClick={() => { setUploadMode('url'); setFormValues(prev => ({ ...prev, url: '', [param.name]: undefined })); }} style={{ padding: '4px 8px', fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700, backgroundColor: uploadMode === 'url' ? 'var(--dark-iron)' : 'var(--black)', color: uploadMode === 'url' ? 'var(--white)' : 'var(--ash)', border: 'none', cursor: 'pointer', borderRadius: '0px' }}>URL</button>
                                </div>
                                {uploadMode === 'file' ? (
                                  <>
                                    <input type="file" accept={topic.category === 'File Uploaders' ? '*/*' : 'image/*'} onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => { setFormValues(prev => ({ ...prev, [param.name]: reader.result })); }; reader.readAsDataURL(file); } }} style={{ display: 'none' }} id="docs-file-input" />
                                    <label htmlFor="docs-file-input" onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(e) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files?.[0]; if (file && (topic.category === 'File Uploaders' || file.type.startsWith('image/'))) { const reader = new FileReader(); reader.onloadend = () => { setFormValues(prev => ({ ...prev, [param.name]: reader.result })); }; reader.readAsDataURL(file); } }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: isDragging ? '1px dashed var(--gold)' : '1px dashed var(--border-color)', padding: '20px 10px', minHeight: '120px', cursor: 'pointer', backgroundColor: isDragging ? 'rgba(255,192,0,0.03)' : 'var(--black)', color: 'var(--ash)', fontFamily: 'var(--font-mono)', fontSize: '10px', textAlign: 'center', transition: 'all 0.2s', width: '100%', boxSizing: 'border-box' }} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--gold)'} onMouseOut={(e) => e.currentTarget.style.borderColor = isDragging ? 'var(--gold)' : 'var(--border-color)'}>
                                      {val && String(val).startsWith('data:') ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                          <span style={{ color: 'var(--gold)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px' }}><Check size={12} strokeWidth={3} /> READY</span>
                                          <div style={{ border: '1px solid var(--border-color)', padding: '4px', backgroundColor: 'var(--black)' }}>
                                            {String(val).startsWith('data:image/') ? (<img src={String(val)} alt="Upload preview" style={{ maxWidth: '80px', maxHeight: '80px', display: 'block', objectFit: 'contain' }} />) : (<div style={{ padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--ash)', fontFamily: 'var(--font-mono)', fontSize: '9px', gap: '4px' }}><Upload size={16} style={{ color: 'var(--gold)' }} /><span>FILE READY</span></div>)}
                                          </div>
                                        </div>
                                      ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                          <Upload size={16} style={{ color: 'var(--ash)' }} />
                                          <span style={{ fontWeight: 700 }}>CLICK OR DRAG FILE HERE</span>
                                        </div>
                                      )}
                                    </label>
                                  </>
                                ) : (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <input type="text" placeholder="Enter file URL..." value={val && !String(val).startsWith('data:') ? String(val) : ''} onChange={(e) => setFormValues(prev => ({ ...prev, [isUploaderUrl ? 'url' : param.name]: e.target.value }))} className="docs-input" style={{ width: '100%', padding: '10px', backgroundColor: 'var(--black)', color: 'var(--white)', border: focusedField === param.name ? '1px solid var(--gold)' : '1px solid #2B2B2B', borderRadius: '0px', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: '11px', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={() => setFocusedField(param.name)} onBlur={() => setFocusedField(null)} />
                                  </div>
                                )}
                              </div>
                            ) : param.type === 'number' ? (
                              <input type="number" placeholder={`Enter ${param.name}...`} value={val} onChange={(e) => setFormValues(prev => ({ ...prev, [param.name]: Number(e.target.value) }))} className="docs-input" style={{ width: '100%', padding: '10px', backgroundColor: 'var(--black)', color: 'var(--white)', border: focusedField === param.name ? '1px solid var(--gold)' : '1px solid #2B2B2B', borderRadius: '0px', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: '11px', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={() => setFocusedField(param.name)} onBlur={() => setFocusedField(null)} />
                            ) : param.type === 'color' ? (
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
                                <div style={{ 
                                  position: 'relative', 
                                  width: '40px', 
                                  height: '38px', 
                                  border: '1px solid #2B2B2B', 
                                  overflow: 'hidden',
                                  flexShrink: 0
                                }}>
                                  <input 
                                    type="color" 
                                    value={(() => {
                                      const c = String(val || '').trim();
                                      if (c.startsWith('#')) {
                                        if (c.length === 4) return '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
                                        if (c.length === 7) return c;
                                      }
                                      const match = c.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
                                      if (match) {
                                        const r = parseInt(match[1]).toString(16).padStart(2, '0');
                                        const g = parseInt(match[2]).toString(16).padStart(2, '0');
                                        const b = parseInt(match[3]).toString(16).padStart(2, '0');
                                        return `#${r}${g}${b}`;
                                      }
                                      return '#000000';
                                    })()} 
                                    onChange={(e) => setFormValues(prev => ({ ...prev, [param.name]: e.target.value }))} 
                                    style={{ 
                                      position: 'absolute',
                                      top: '-10px',
                                      left: '-10px',
                                      width: '60px',
                                      height: '60px',
                                      border: 'none',
                                      cursor: 'pointer',
                                      background: 'none'
                                    }} 
                                  />
                                </div>
                                <input 
                                  type="text" 
                                  placeholder="Hex/RGB color code..." 
                                  value={val} 
                                  onChange={(e) => setFormValues(prev => ({ ...prev, [param.name]: e.target.value }))} 
                                  className="docs-input" 
                                  style={{ 
                                    flexGrow: 1, 
                                    padding: '10px', 
                                    backgroundColor: 'var(--black)', 
                                    color: 'var(--white)', 
                                    border: focusedField === param.name ? '1px solid var(--gold)' : '1px solid #2B2B2B', 
                                    borderRadius: '0px', 
                                    outline: 'none', 
                                    fontFamily: 'var(--font-mono)', 
                                    fontSize: '11px', 
                                    transition: 'border-color 0.2s', 
                                    boxSizing: 'border-box' 
                                  }} 
                                  onFocus={() => setFocusedField(param.name)} 
                                  onBlur={() => setFocusedField(null)} 
                                />
                              </div>
                            ) : param.type === 'textarea' || label === 'text' || label === 'code' ? (
                              <textarea
                                key={`${activeTopic?.id || ''}-${param.name}`}
                                defaultValue={val || ''}
                                placeholder={`Enter ${param.name}...`}
                                onChange={(e) => {
                                  setFormValues(prev => ({ ...prev, [param.name]: e.target.value }));
                                }}
                                className="docs-input"
                                rows={8}
                                style={{
                                  width: '100%',
                                  padding: '10px',
                                  backgroundColor: 'var(--black)',
                                  color: 'var(--white)',
                                  border: focusedField === param.name ? '1px solid var(--gold)' : '1px solid #2B2B2B',
                                  borderRadius: '0px',
                                  outline: 'none',
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '11px',
                                  resize: 'vertical',
                                  transition: 'border-color 0.2s',
                                  boxSizing: 'border-box'
                                }}
                                onFocus={() => setFocusedField(param.name)}
                                onBlur={() => setFocusedField(null)}
                              />
                            ) : param.type === 'select' ? (
                              <CustomDropdown value={String(val)} options={(param as any).options ?? []} onChange={(v) => setFormValues(prev => ({ ...prev, [param.name]: v }))} />
                            ) : param.type === 'boolean' ? (
                              <CustomDropdown value={String(val ?? 'false')} options={['true', 'false']} onChange={(v) => setFormValues(prev => ({ ...prev, [param.name]: v === 'true' }))} />
                            ) : (
                              <input type="text" placeholder={`Enter ${param.name}...`} value={val} onChange={(e) => setFormValues(prev => ({ ...prev, [param.name]: e.target.value }))} className="docs-input" style={{ width: '100%', padding: '10px', backgroundColor: 'var(--black)', color: 'var(--white)', border: focusedField === param.name ? '1px solid var(--gold)' : '1px solid #2B2B2B', borderRadius: '0px', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: '11px', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={() => setFocusedField(param.name)} onBlur={() => setFocusedField(null)} />
                            )}
                            <span style={{ fontSize: '10px', color: 'var(--ash)', marginTop: '4px', display: 'block', fontFamily: 'var(--font-display)' }}>{param.desc}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--ash)' }}>No configuration payload required.</span>
                  )}
                  <button onClick={handleSendRequest} className="btn btn-gold" style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', marginTop: '16px' }} disabled={loading}>
                    {loading ? <RefreshCw size={12} className="animate-spin" /> : <Send size={12} />}
                    {loading ? 'RUNNING...' : 'SEND REQUEST'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Execution Response */}
          <div className="docs-playground-right-col">
            {topic.method && (
              <div className="docs-section" style={{ marginTop: '0' }}>
                <h3 className="section-title" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px 0', borderBottom: '1px dashed var(--border-color)', paddingBottom: '6px' }}>Response</h3>
                <div className="sandbox-panel" style={{ marginTop: '0px' }}>
                  <div className="sandbox-panel-header" style={{ padding: '0px' }}>
                    <div style={{ display: 'flex' }}>
                      <button onClick={() => setResponseTab('visual')} className="nav-link" style={{ whiteSpace: 'nowrap', padding: '10px 16px', background: responseTab === 'visual' ? 'var(--dark-iron)' : 'transparent', color: responseTab === 'visual' ? 'var(--white)' : 'var(--ash)', border: 'none', borderRight: '1px solid var(--border-color)', fontSize: '10px', fontWeight: 700, cursor: 'pointer', borderRadius: '0px' }}>PREVIEW</button>
                      <button onClick={() => setResponseTab('json')} className="nav-link" style={{ whiteSpace: 'nowrap', padding: '10px 16px', background: responseTab === 'json' ? 'var(--dark-iron)' : 'transparent', color: responseTab === 'json' ? 'var(--white)' : 'var(--ash)', border: 'none', borderRight: '1px solid var(--border-color)', fontSize: '10px', fontWeight: 700, cursor: 'pointer', borderRadius: '0px' }}>RAW JSON</button>
                    </div>
                    <button onClick={() => copyToClipboard(responseJson ? JSON.stringify(responseJson, null, 2) : getCurlCode())} className="btn-text-copy" style={{ marginRight: '12px', fontSize: '9px' }}>
                      {copied ? <Check size={10} style={{ color: 'var(--gold)' }} /> : responseJson ? 'COPY JSON' : 'COPY CURL'}
                    </button>
                  </div>
                  <div className="sandbox-response-container" style={{ backgroundColor: 'var(--dark-iron)', padding: '16px', minHeight: '320px', border: '1px solid var(--border-color)', borderTop: 'none' }}>
                    {responseJson ? (
                      responseTab === 'visual' ? renderVisualResult() : (
                        <pre className="response-pre"><code style={{ color: 'var(--smoke)', fontSize: '11px' }}>{JSON.stringify(responseJson, null, 2)}</code></pre>
                      )
                    ) : (
                      <div className="sandbox-empty-message" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '280px', color: 'var(--ash)', fontSize: '11px', textAlign: 'center', padding: '0 20px' }}>
                        <span>Send request to preview results.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Get sorted list of categories
  const sortedCategories = Object.entries(categories)
    .sort((a, b) => a[0].localeCompare(b[0]));

  const currentCategory = selectedCategory || (sortedCategories[0] ? sortedCategories[0][0] : null);

  return (
    <div className="docs-container container">

      {/* Search Bar */}
      <div className="docs-search-wrapper">
        <Search size={15} />
        <input
          className="docs-search-input"
          type="text"
          placeholder="FILTER ENDPOINTS..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {searchQuery.trim() !== '' ? (
        /* Search Mode: render all matching items grouped by category immediately */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {sortedCategories.map(([categoryName, topics]) => (
            <div key={categoryName} className="docs-category-card" style={{ marginBottom: '16px' }}>
              <div className="docs-category-header" style={{ marginBottom: '12px' }}>
                <span className="docs-category-title">{categoryName}</span>
                <div className="docs-category-rule" />
                <span className="docs-category-count">{topics.length} endpoints</span>
              </div>
              <div className="docs-endpoints-list">
                {topics.map(topic => {
                  const isActive = activeTopic?.id === topic.id;
                  const method = (topic.method || 'GET').toLowerCase();
                  return (
                    <div key={topic.id} className={`docs-endpoint-item-wrapper${isActive ? ' active' : ''}`}>
                      <div
                        className="docs-endpoint-row"
                        onClick={() => {
                          if (isActive) {
                            setActiveTopic(null);
                            setResponseJson(null);
                          } else {
                            setActiveTopic(topic);
                            setResponseJson(null);
                            setResponseTab('visual');
                          }
                        }}
                      >
                        <div className="docs-endpoint-left">
                          <span className={`method-badge ${method}`}>
                            {topic.method || 'GET'}
                          </span>
                          <span className="docs-endpoint-row-title">{topic.title}</span>
                        </div>
                        <span className="docs-endpoint-row-path">{topic.path}</span>
                      </div>
                      {isActive && renderPlayground(topic)}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Idle Mode: render grid cards selector + active category panel */
        <>
          {/* Categories Grid (1 row 2 boxes in mobile, multi-column in desktop) */}
          <div className="docs-categories-grid">
            {sortedCategories.map(([categoryName, topics]) => {
              const isActive = currentCategory === categoryName;
              return (
                <div
                  key={categoryName}
                  className={`docs-category-box${isActive ? ' active' : ''}`}
                  onClick={() => setSelectedCategory(categoryName)}
                >
                  <span className="docs-category-box-title">{categoryName}</span>
                  <div className="docs-category-box-meta">
                    <span className="docs-category-box-count">{topics.length} endpoints</span>
                    <span className="docs-category-box-arrow">➔</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Category Panel */}
          {currentCategory && (
            <div className="active-category-panel">
              <div className="active-category-panel-header">
                <span className="active-category-panel-title">
                  {currentCategory} List
                </span>
              </div>

              <div className="docs-endpoints-list">
                {(categories[currentCategory] || []).map(topic => {
                  const isActive = activeTopic?.id === topic.id;
                  const method = (topic.method || 'GET').toLowerCase();
                  return (
                    <div key={topic.id} className={`docs-endpoint-item-wrapper${isActive ? ' active' : ''}`}>
                      <div
                        className="docs-endpoint-row"
                        onClick={() => {
                          if (isActive) {
                            setActiveTopic(null);
                            setResponseJson(null);
                          } else {
                            setActiveTopic(topic);
                            setResponseJson(null);
                            setResponseTab('visual');
                          }
                        }}
                      >
                        <div className="docs-endpoint-left">
                          <span className={`method-badge ${method}`}>
                            {topic.method || 'GET'}
                          </span>
                          <span className="docs-endpoint-row-title">{topic.title}</span>
                        </div>
                        <span className="docs-endpoint-row-path">{topic.path}</span>
                      </div>
                      {isActive && renderPlayground(topic)}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {Object.keys(categories).length === 0 && (
        <div style={{ padding: '40px 0', color: 'var(--steel)', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em' }}>
          no results for "{searchQuery}"
        </div>
      )}
    </div>
  );
}
