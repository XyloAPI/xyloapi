import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';
import TadpoleIcon from '@iconify-react/svg-spinners/tadpole';
import { motion, AnimatePresence } from 'motion/react';
import { ErrorBoundary } from 'react-error-boundary';
import { JsonView, allExpanded } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
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

const xyloStyles = {
  container: 'xylo-json-container',
  basicChildStyle: 'xylo-json-child',
  label: 'xylo-json-label',
  nullValue: 'xylo-json-null',
  undefinedValue: 'xylo-json-undefined',
  stringValue: 'xylo-json-string',
  booleanValue: 'xylo-json-boolean',
  numberValue: 'xylo-json-number',
  otherValue: 'xylo-json-other',
  punctuation: 'xylo-json-punctuation',
  expandIcon: 'xylo-json-expand',
  collapseIcon: 'xylo-json-collapse',
  list: 'xylo-json-list',
  clickableLabel: 'xylo-json-clickable-label'
};

function PlaygroundErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div style={{ 
      padding: '24px', 
      border: '1px solid #FF3B30', 
      backgroundColor: 'rgba(255, 59, 48, 0.03)', 
      fontFamily: 'var(--font-mono)', 
      fontSize: '11px',
      color: '#FF8888',
      textAlign: 'left'
    }}>
      <h4 style={{ margin: '0 0 8px 0', textTransform: 'uppercase', color: '#FF4A4A', letterSpacing: '0.05em' }}>
        Playground Render Error
      </h4>
      <p style={{ margin: '0 0 16px 0', color: 'var(--ash)', lineHeight: 1.5 }}>
        Failed to render the response data. The API payload structure might have changed.
      </p>
      <pre style={{ 
        backgroundColor: 'var(--black)', 
        border: '1px solid var(--border-color)', 
        padding: '12px', 
        overflowX: 'auto',
        color: 'var(--smoke)',
        margin: '0 0 16px 0'
      }}>
        <code>{error.message}</code>
      </pre>
      <Button 
        onClick={resetErrorBoundary} 
        variant="destructive" 
        size="sm"
      >
        Reset Playground
      </Button>
    </div>
  );
}

export default function Docs() {
  const [activeTopic, setActiveTopic] = useState<DocTopic | null>(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const apiId = searchParams.get('api');
    if (apiId) {
      const found = docTopics.find(t => t.id === apiId);
      if (found) return found;
    }
    return null;
  });

  // Sync activeTopic with URL query param for deep-linking support
  useEffect(() => {
    const pathPart = window.location.pathname;
    if (activeTopic) {
      const newSearch = `?api=${activeTopic.id}`;
      if (window.location.search !== newSearch) {
        window.history.replaceState(null, '', `${pathPart}${newSearch}`);
      }
    } else {
      if (window.location.search.includes('?api=')) {
        window.history.replaceState(null, '', pathPart);
      }
    }
  }, [activeTopic]);
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
    toast.success('Copied to clipboard!');
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
    NProgress.start();
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
        if (json.success) {
          toast.success('Request executed successfully!');
        } else {
          toast.error(json.message || 'Request returned an error.');
        }
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
        toast.error(parsedError);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Request execution failed.';
      setResponseJson({
        success: false,
        message: errMsg
      });
      toast.error(errMsg);
    } finally {
      setLoading(false);
      NProgress.done();
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
                  onClick={() => { 
                    navigator.clipboard.writeText(getCurlCode()); 
                    setCopiedText('curl'); 
                    setTimeout(() => setCopiedText(''), 2000);
                    toast.success('cURL code copied!');
                  }}
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
                                          <span style={{ color: 'var(--gold)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px' }}><Icon icon="lucide:check" width="12" height="12" style={{ strokeWidth: 3 }} /> READY</span>
                                          <div style={{ border: '1px solid var(--border-color)', padding: '4px', backgroundColor: 'var(--black)' }}>
                                            {String(val).startsWith('data:image/') ? (<img src={String(val)} alt="Upload preview" style={{ maxWidth: '80px', maxHeight: '80px', display: 'block', objectFit: 'contain' }} />) : (<div style={{ padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--ash)', fontFamily: 'var(--font-mono)', fontSize: '9px', gap: '4px' }}><Icon icon="lucide:upload" width="16" height="16" style={{ color: 'var(--gold)' }} /><span>FILE READY</span></div>)}
                                          </div>
                                        </div>
                                      ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                          <Icon icon="lucide:upload" width="16" height="16" style={{ color: 'var(--ash)' }} />
                                          <span style={{ fontWeight: 700 }}>CLICK OR DRAG FILE HERE</span>
                                        </div>
                                      )}
                                    </label>
                                  </>
                                ) : (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <Input
                                      type="text"
                                      placeholder="Enter file URL..."
                                      value={val && !String(val).startsWith('data:') ? String(val) : ''}
                                      onChange={(e) => setFormValues(prev => ({ ...prev, [isUploaderUrl ? 'url' : param.name]: e.target.value }))}
                                    />
                                  </div>
                                )}
                              </div>
                            ) : param.type === 'number' ? (
                              <Input
                                type="number"
                                placeholder={`Enter ${param.name}...`}
                                value={val}
                                onChange={(e) => setFormValues(prev => ({ ...prev, [param.name]: Number(e.target.value) }))}
                              />
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
                                <Input 
                                  type="text" 
                                  placeholder="Hex/RGB color code..." 
                                  value={val} 
                                  onChange={(e) => setFormValues(prev => ({ ...prev, [param.name]: e.target.value }))} 
                                  className="flex-grow"
                                />
                              </div>
                            ) : param.type === 'textarea' || label === 'text' || label === 'code' ? (
                              <Textarea
                                key={`${activeTopic?.id || ''}-${param.name}`}
                                defaultValue={val || ''}
                                placeholder={`Enter ${param.name}...`}
                                onChange={(e) => {
                                  setFormValues(prev => ({ ...prev, [param.name]: e.target.value }));
                                }}
                                rows={8}
                              />
                            ) : param.type === 'select' ? (
                              <Select
                                value={String(val)}
                                onValueChange={(v: string) => setFormValues(prev => ({ ...prev, [param.name]: v }))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select option..." />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                  {((param as any).options ?? []).map((o: any) => {
                                    const opt = typeof o === 'string' ? { value: o, label: o } : o;
                                    return (
                                      <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            ) : param.type === 'boolean' ? (
                              <Select
                                value={String(val ?? 'false')}
                                onValueChange={(v: string) => setFormValues(prev => ({ ...prev, [param.name]: v === 'true' }))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                  <SelectItem value="true">true</SelectItem>
                                  <SelectItem value="false">false</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input type="text" placeholder={`Enter ${param.name}...`} value={val} onChange={(e) => setFormValues(prev => ({ ...prev, [param.name]: e.target.value }))} />
                            )}
                            <span style={{ fontSize: '10px', color: 'var(--ash)', marginTop: '4px', display: 'block', fontFamily: 'var(--font-display)' }}>{param.desc}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--ash)' }}>No configuration payload required.</span>
                  )}
                  <Button onClick={handleSendRequest} variant="gold" className="w-full mt-4" disabled={loading}>
                    {loading ? <TadpoleIcon className="mr-2 text-black" width="12" height="12" /> : <Icon icon="lucide:send" width="12" height="12" className="mr-2" />}
                    {loading ? 'RUNNING...' : 'SEND REQUEST'}
                  </Button>
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
                  <Tabs value={responseTab} onValueChange={(v: string) => setResponseTab(v as 'visual' | 'json')}>
                    <div className="sandbox-panel-header" style={{ padding: '0px' }}>
                      <TabsList className="border-b-0 w-auto">
                        <TabsTrigger value="visual">PREVIEW</TabsTrigger>
                        <TabsTrigger value="json">RAW JSON</TabsTrigger>
                      </TabsList>
                      <button onClick={() => copyToClipboard(responseJson ? JSON.stringify(responseJson, null, 2) : getCurlCode())} className="btn-text-copy" style={{ marginRight: '12px', fontSize: '9px' }}>
                        {copied ? <Icon icon="lucide:check" width="10" height="10" style={{ color: 'var(--gold)' }} /> : responseJson ? 'COPY JSON' : 'COPY CURL'}
                      </button>
                    </div>
                    <div className="sandbox-response-container" style={{ backgroundColor: 'var(--dark-iron)', padding: '16px', minHeight: '320px', border: '1px solid var(--border-color)', borderTop: 'none', overflowY: 'auto' }}>
                      {responseJson ? (
                        <>
                          <TabsContent value="visual" className="m-0 p-0">
                            <ErrorBoundary 
                              FallbackComponent={PlaygroundErrorFallback} 
                              onReset={() => setResponseJson(null)}
                            >
                              {renderVisualResult()}
                            </ErrorBoundary>
                          </TabsContent>
                          <TabsContent value="json" className="m-0 p-0">
                            <div className="response-json-viewer" style={{ textAlign: 'left' }}>
                              <JsonView data={responseJson} shouldExpandNode={allExpanded} style={xyloStyles} />
                            </div>
                          </TabsContent>
                        </>
                      ) : (
                        <div className="sandbox-empty-message" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '280px', color: 'var(--ash)', fontSize: '11px', textAlign: 'center', padding: '0 20px' }}>
                          <span>Send request to preview results.</span>
                        </div>
                      )}
                    </div>
                  </Tabs>
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
      <div className="relative flex items-center w-full mb-12">
        <Icon icon="lucide:search" width="14" height="14" className="absolute left-4 text-gold/80 z-10" />
        <Input
          className="pl-11 h-12 w-full text-xs uppercase tracking-wider bg-dark-iron border-b-2 border-b-gold"
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
                          <Badge variant={method === 'get' ? 'info' : method === 'post' ? 'default' : 'warning'} className="mr-3 font-bold text-[10px] w-14 justify-center py-1">
                            {topic.method || 'GET'}
                          </Badge>
                          <span className="docs-endpoint-row-title">{topic.title}</span>
                        </div>
                        <span className="docs-endpoint-row-path">{topic.path}</span>
                      </div>
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            style={{ overflow: 'hidden' }}
                          >
                            {renderPlayground(topic)}
                          </motion.div>
                        )}
                      </AnimatePresence>
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
            <motion.div 
              key={currentCategory}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="active-category-panel"
            >
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
                          <Badge variant={method === 'get' ? 'info' : method === 'post' ? 'default' : 'warning'} className="mr-3 font-bold text-[10px] w-14 justify-center py-1">
                            {topic.method || 'GET'}
                          </Badge>
                          <span className="docs-endpoint-row-title">{topic.title}</span>
                        </div>
                        <span className="docs-endpoint-row-path">{topic.path}</span>
                      </div>
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            style={{ overflow: 'hidden' }}
                          >
                            {renderPlayground(topic)}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
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
