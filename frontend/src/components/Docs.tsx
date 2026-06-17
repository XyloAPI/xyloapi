import { useState, useEffect, useRef } from 'react';
import { Globe, RefreshCw, Send, Check, Upload, Download, Newspaper } from 'lucide-react';

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
}

export function CustomVideoPlayer({ src, poster }: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(err => {
        console.log("Play failed:", err);
        setHasError(true);
      });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;
    setCurrentTime(cur);
    setProgress(dur > 0 ? (cur / dur) * 100 : 0);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 0);
    setHasError(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current || !duration) return;
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(parseFloat(e.target.value));
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setHasError(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [src]);

  return (
    <div
      style={{
        position: 'relative',
        width: '240px',
        backgroundColor: '#000',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
      }}
    >
      <style>{`
        .custom-player-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 4px;
          outline: none;
          border-radius: 2px;
          cursor: pointer;
          margin: 0;
          padding: 0;
        }
        .custom-player-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #27C93F;
          border: 1.5px solid #ffffff;
          cursor: pointer;
          transition: transform 0.1s;
        }
        .custom-player-slider::-webkit-slider-thumb:hover {
          transform: scale(1.3);
        }
        .custom-player-slider::-moz-range-thumb {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #27C93F;
          border: 1.5px solid #ffffff;
          cursor: pointer;
          transition: transform 0.1s;
        }
        .custom-player-slider::-moz-range-thumb:hover {
          transform: scale(1.3);
        }
      `}</style>

      {/* Video Canvas Area */}
      <div
        onClick={togglePlay}
        style={{
          position: 'relative',
          width: '100%',
          height: '240px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#050505'
        }}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          playsInline
          {...{ referrerPolicy: "no-referrer" } as any}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={() => setHasError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none'
          }}
        />

        {/* Big play button in the middle */}
        {!isPlaying && !hasError && (
          <div style={{
            position: 'absolute',
            backgroundColor: 'rgba(39, 201, 63, 0.95)',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(39, 201, 63, 0.3)',
            transition: 'all 0.2s ease',
            border: '1.5px solid #ffffff'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#fff', marginLeft: '2px' }}>
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}

        {/* Error message */}
        {hasError && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            textAlign: 'center',
            color: 'var(--ash)'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--red-pulse)" strokeWidth="2" style={{ marginBottom: '6px' }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)' }}>Playback restricted. Please use download button.</span>
          </div>
        )}
      </div>

      {/* Control panel under the video */}
      <div style={{
        padding: '10px 12px',
        backgroundColor: '#09090b',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {/* Progress scrub bar */}
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="custom-player-slider"
          style={{
            background: `linear-gradient(to right, #27C93F 0%, #27C93F ${progress}%, #27272a ${progress}%, #27272a 100%)`,
          }}
        />

        {/* Buttons and Time */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--ash)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Play/Pause */}
            <button
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--white)',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#27C93F'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--white)'}
            >
              {isPlaying ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Mute/Unmute */}
            <button
              onClick={(e) => { e.stopPropagation(); toggleMute(); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--white)',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#27C93F'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--white)'}
            >
              {isMuted ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--red-pulse)' }}>
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.03c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>
          </div>

          {/* Time display */}
          <div style={{ fontSize: '10px' }}>
            <span>{formatTime(currentTime)}</span>
            <span style={{ margin: '0 2px' }}>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Custom Dropdown ───────────────────────────────────────────────────────────
interface DropdownOption { value: string; label: string; }
interface CustomDropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (val: string) => void;
}
function CustomDropdown({ value, options, onChange }: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find(o => o.value === value)?.label ?? value;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', userSelect: 'none' }}>
      {/* Trigger */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px',
          backgroundColor: 'var(--black)',
          border: open ? '1px solid var(--gold)' : '1px solid #2B2B2B',
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--white)',
          transition: 'border-color 0.2s',
        }}
        onMouseOver={(e) => { if (!open) e.currentTarget.style.borderColor = '#555'; }}
        onMouseOut={(e) => { if (!open) e.currentTarget.style.borderColor = '#2B2B2B'; }}
      >
        <span>{selectedLabel}</span>
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}
        >
          <path d="M1 3L5 7L9 3" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="square"/>
        </svg>
      </div>

      {/* Dropdown list */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 2px)',
          left: 0,
          right: 0,
          backgroundColor: '#0e0e0e',
          border: '1px solid var(--gold)',
          zIndex: 9999,
          maxHeight: '260px',
          overflowY: 'auto',
        }}>
          {options.map(opt => {
            const isActive = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                style={{
                  padding: '10px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  color: isActive ? 'var(--gold-text)' : 'var(--white)',
                  backgroundColor: isActive ? 'rgba(255,192,0,0.07)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--gold)' : '2px solid transparent',
                  transition: 'background 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onMouseOver={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
                onMouseOut={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <span>{opt.label}</span>
                {isActive && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="square"/>
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  desc: string;
}

interface DocTopic {
  id: string;
  title: string;
  category: string;
  method?: 'GET' | 'POST';
  path?: string;
  pathTemplate?: string;
  description: string;
  parameters?: Parameter[];
  payloadTemplate?: any;
}

const docTopics: DocTopic[] = [
  {
    id: 'imgur',
    title: 'Imgur Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/imgur',
    pathTemplate: '/api/uploader/:slug',
    description: 'Upload local image files or remote URLs directly to the Imgur CDN.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Select local image file to upload or enter image URL' }
    ],
    payloadTemplate: {
      image: ''
    }
  },
  {
    id: '8uploads',
    title: '8uploads Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/8uploads',
    pathTemplate: '/api/uploader/:slug',
    description: 'Upload local image files or remote URLs directly to the 8upload.com hosting platform.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Select local image file to upload or enter image URL' }
    ],
    payloadTemplate: {
      image: ''
    }
  },
  {
    id: 'freeimage',
    title: 'FreeImage Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/freeimage',
    pathTemplate: '/api/uploader/:slug',
    description: 'Upload local image files or remote URLs directly to the FreeImage.host hosting platform.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Select local image file to upload or enter image URL' }
    ],
    payloadTemplate: {
      image: ''
    }
  },
  {
    id: 'imghippo',
    title: 'ImgHippo Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/imghippo',
    pathTemplate: '/api/uploader/:slug',
    description: 'Upload local image files or remote URLs directly to the ImgHippo hosting platform.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Select local image file to upload or enter image URL' }
    ],
    payloadTemplate: {
      image: ''
    }
  },
  {
    id: 'catbox',
    title: 'Catbox Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/catbox',
    pathTemplate: '/api/uploader/:slug',
    description: 'Upload local image files or remote URLs directly to the Catbox.moe hosting platform.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Select local image file to upload or enter image URL' }
    ],
    payloadTemplate: {
      image: ''
    }
  },
  {
    id: 'litterbox',
    title: 'Litterbox Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/litterbox',
    pathTemplate: '/api/uploader/:slug',
    description: 'Upload temporary files up to 1GB directly to the Litterbox.catbox.moe platform (expires in 24h).',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Select local image file to upload or enter image URL' }
    ],
    payloadTemplate: {
      image: ''
    }
  },
  {
    id: 'uguu',
    title: 'Uguu Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/uguu',
    pathTemplate: '/api/uploader/:slug',
    description: 'Upload temporary files up to 100MB directly to the Uguu.se platform (expires in 24h).',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Select local image file to upload or enter image URL' }
    ],
    payloadTemplate: {
      image: ''
    }
  },
  {
    id: 'imgbb',
    title: 'ImgBB Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/imgbb',
    pathTemplate: '/api/uploader/:slug',
    description: 'Upload local image files or remote URLs directly to the ImgBB hosting platform.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Select local image file to upload or enter image URL' }
    ],
    payloadTemplate: {
      image: ''
    }
  },
  {
    id: 'yourimageshare',
    title: 'YourImageShare Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/yourimageshare',
    pathTemplate: '/api/uploader/:slug',
    description: 'Upload local image files or remote URLs directly to YourImageShare platform.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Select local image file to upload or enter image URL' }
    ],
    payloadTemplate: {
      image: ''
    }
  },
  {
    id: 'gofile',
    title: 'GoFile Uploader',
    category: 'File Uploaders',
    method: 'POST',
    path: '/api/uploader/gofile',
    pathTemplate: '/api/uploader/:slug',
    description: 'Upload any local file, image, video, or document directly to the GoFile file sharing platform.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Select local file to upload or enter file URL' }
    ],
    payloadTemplate: {
      image: ''
    }
  },
  {
    id: 'tiktok',
    title: 'TikTok Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/tiktok',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download TikTok videos without watermark, with watermark, or as high-quality MP3 audio files.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the public TikTok video URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'instagram',
    title: 'Instagram Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/instagram',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download Instagram videos, reels, photos, and carousel slides.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the public Instagram post/reel URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'youtube',
    title: 'YouTube Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/youtube',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download YouTube videos in high resuolution and MP3 audios.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the public YouTube video URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'spotify',
    title: 'Spotify Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/spotify',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download Spotify tracks in high-quality 320kbps MP3 audio.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the public Spotify track URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'soundcloud',
    title: 'SoundCloud Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/soundcloud',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download SoundCloud tracks in high-quality MP3 audio.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the public SoundCloud track URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'x',
    title: 'Twitter / X Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/x',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download videos, images, and GIFs from Twitter / X posts.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the public Twitter/X post URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'threads',
    title: 'Threads Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/threads',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download videos, images, and carousels from Threads posts.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the public Threads post URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'facebook',
    title: 'Facebook Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/facebook',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download videos from Facebook posts in HD or SD quality.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the public Facebook video URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'bilibili',
    title: 'Bilibili Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/bilibili',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download videos from Bilibili posts and anime episodes.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the Bilibili video URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'snackvideo',
    title: 'SnackVideo Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/snackvideo',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download SnackVideo videos without watermark, with cover thumbnail and audio stream.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the SnackVideo URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'capcut',
    title: 'CapCut Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/capcut',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download CapCut video templates without watermark in high quality.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the CapCut video URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'cocofun',
    title: 'CocoFun Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/cocofun',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download CocoFun videos in high quality.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the CocoFun share video URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'douyin',
    title: 'Douyin Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/douyin',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download Douyin videos and photos in high quality without watermark.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the Douyin video/post URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'youtube-community',
    title: 'YouTube Community Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/youtube-community',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download images from YouTube community posts in high quality.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the YouTube Community Post URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'github',
    title: 'GitHub Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/github',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download repositories, releases, release assets, specific branches, single files, or folders from GitHub.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the GitHub Repository, Release, File, or Folder URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'gdrive',
    title: 'Google Drive Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/gdrive',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download files and export Google Docs, Sheets, and Slides directly from Google Drive sharing URLs.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the Google Drive / Docs share URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'mediafire',
    title: 'MediaFire Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/mediafire',
    pathTemplate: '/api/downloader/:slug',
    description: 'Generate direct high-speed download links from MediaFire file sharing URLs.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the MediaFire file URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'mega',
    title: 'MEGA Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/mega',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download and decrypt public files hosted on MEGA.nz directly to stream and save.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the MEGA.nz file share URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'npm',
    title: 'NPM Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/npm',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download tarball packages of Node modules directly from NPM Registry.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the NPM package name or URL (e.g. react or https://www.npmjs.com/package/react)' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'pinterest',
    title: 'Pinterest Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/pinterest',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download high-quality images and video streams directly from Pinterest boards and pins.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the Pinterest pin share URL (e.g. https://www.pinterest.com/pin/123456/ or short URL https://pin.it/xxxxx)' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'rednote',
    title: 'RedNote Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/rednote',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download high-quality images and videos directly from Xiaohongshu (RedNote) posts.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the Xiaohongshu/RedNote share URL (e.g. https://www.xiaohongshu.com/discovery/item/...)' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'scribd',
    title: 'Scribd Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/scribd',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download high-quality original document page images directly from Scribd.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the Scribd document URL or embed URL (e.g. https://www.scribd.com/document/...)' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'sfile',
    title: 'Sfile.co Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/sfile',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download files directly from sfile.co (and sfile.mobi) bypassing ad countdowns.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the sfile.co file URL (e.g. https://sfile.co/agNixA1YkHq)' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'terabox',
    title: 'Terabox Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/terabox',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download videos and files directly from Terabox links bypassing app lock limitations.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the Terabox file URL (e.g. https://1024terabox.com/s/1etUwLqCoOeuWejxFNJF5xA)' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'dailymotion',
    title: 'Dailymotion Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/dailymotion',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download Dailymotion videos in multiple resolutions (360p up to 1080p).',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the Dailymotion video URL (e.g. https://www.dailymotion.com/video/xael6ni)' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'ph',
    title: 'Pornhub Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/ph',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download Pornhub videos in multiple resolutions (240p up to 1080p). Supports both direct MP4 downloads and HLS stream formats.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the Pornhub video URL (e.g. https://www.pornhub.com/view_video.php?viewkey=6a281627061fa)' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'pornhd',
    title: 'PornHD / Faphouse Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/pornhd',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download PornHD and Faphouse videos in high quality MP4 format.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the PornHD or Faphouse URL (e.g. https://faphouse.com/videos/shinji-x-asuka-eva-dGEu0b)' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'xnxx',
    title: 'XNXX Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/xnxx',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download XNXX videos directly in high/low quality MP4 formats or HLS streams.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the XNXX video URL (e.g. https://www.xnxx.com/video-1d8ujt96/asian_babe_has_some_fun)' }
    ],
    payloadTemplate: {
      url: ''
    }
  },
  {
    id: 'straitstimes',
    title: 'The Straits Times',
    category: 'News',
    method: 'POST',
    path: '/api/news/straitstimes',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest news headlines and articles from The Straits Times (straitstimes.com) by category. Returns up to 25 articles with title, link, excerpt, and publish date.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a news category to fetch articles from.',
        options: [
          { value: 'singapore', label: 'Singapore' },
          { value: 'asia', label: 'Asia' },
          { value: 'world', label: 'World' },
          { value: 'business', label: 'Business' },
          { value: 'sport', label: 'Sport' },
          { value: 'life', label: 'Life & Style' },
          { value: 'opinion', label: 'Opinion' },
          { value: 'multimedia', label: 'Multimedia' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'singapore'
    }
  },
  {
    id: 'cna',
    title: 'Channel NewsAsia (CNA)',
    category: 'News',
    method: 'POST',
    path: '/api/news/cna',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest news headlines and articles from Channel NewsAsia (channelnewsasia.com) by category. Returns up to 20 articles with title, image, description, and publish date.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a news category to fetch articles from.',
        options: [
          { value: 'singapore', label: 'Singapore' },
          { value: 'asia', label: 'Asia' },
          { value: 'world', label: 'World' },
          { value: 'business', label: 'Business' },
          { value: 'sport', label: 'Sport' },
          { value: 'technology', label: 'Technology' },
          { value: 'lifestyle', label: 'Lifestyle' },
          { value: 'entertainment', label: 'Entertainment' },
          { value: 'commentary', label: 'Commentary' },
          { value: 'cna-insider', label: 'CNA Insider' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'singapore'
    }
  }
];

export default function Docs() {
  const [activeTopic, setActiveTopic] = useState<DocTopic>(docTopics[0]);
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
    if (activeTopic.payloadTemplate) {
      Object.entries(activeTopic.payloadTemplate).forEach(([key, val]) => {
        initial[key] = val;
      });
    }
    setFormValues(initial);
    setResponseJson(null);
    setResponseTab('visual');
  }, [activeTopic]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Construct JSON request payload programmatically from formState values
  const getPayloadJson = () => {
    if (!activeTopic.payloadTemplate) return '';
    const bodyObj: any = {};
    Object.entries(formValues).forEach(([key, val]) => {
      bodyObj[key] = val;
    });
    return JSON.stringify(bodyObj, null, 2);
  };

  const getActiveMethod = () => {
    if (activeTopic.id === 'imgur') {
      return uploadMode === 'file' ? 'POST' : 'GET';
    }
    return activeTopic.method || 'GET';
  };

  const getEvaluatedUrl = () => {
    let path = activeTopic.path || '';

    // Replace route parameters if any (e.g. :id or :slug)
    if (activeTopic.parameters) {
      activeTopic.parameters.forEach(param => {
        const placeholder = `:${param.name}`;
        if (path.includes(placeholder)) {
          const val = formValues[param.name] || `:${param.name}`;
          path = path.replace(placeholder, encodeURIComponent(String(val)));
        }
      });
    }

    const host = (window.location.hostname === 'localhost' && window.location.port !== '3000') ? 'http://localhost:5000' : window.location.origin;
    let url = `${host}${path}`;

    // Append remaining parameters as query string for GET
    const method = getActiveMethod();
    if (method === 'GET') {
      const params = new URLSearchParams();
      if (activeTopic.category === 'Media Uploaders' || activeTopic.category === 'File Uploaders') {
        const val = formValues['url'] !== undefined ? formValues['url'] : '';
        if (val) {
          params.append('url', String(val));
        } else {
          params.append('url', '');
        }
      } else if (activeTopic.parameters) {
        activeTopic.parameters.forEach(param => {
          const isPathSnippet = path.includes(`:${param.name}`) || (activeTopic.path && activeTopic.path.includes(`:${param.name}`));
          if (!isPathSnippet) {
            const val = formValues[param.name] !== undefined ? formValues[param.name] : '';
            params.append(param.name, String(val));
          }
        });
      }
      const qs = params.toString();
      if (qs) {
        url += `?${qs}`;
      }
    } else if (activeTopic.parameters) {
      // For POST: still show select-type params in URL for visual clarity
      const selectParams = activeTopic.parameters.filter((p: any) => p.type === 'select');
      if (selectParams.length > 0) {
        const params = new URLSearchParams();
        selectParams.forEach((param: any) => {
          const val = formValues[param.name] !== undefined ? formValues[param.name] : '';
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
        console.error("Gateway HTTP Error Response:", res.status, errText);
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
      console.error("Gateway Fetch Network Error:", err);
      setResponseJson({
        success: false,
        message: err instanceof Error ? err.message : 'Request execution failed.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Group topics by category
  const categories = docTopics.reduce((acc: { [key: string]: DocTopic[] }, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Sort topics alphabetically (A-Z) by title on the frontend
  Object.keys(categories).forEach(category => {
    categories[category].sort((a, b) => a.title.localeCompare(b.title));
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Media Uploaders': return <Upload size={14} />;
      case 'File Uploaders': return <Upload size={14} />;
      case 'Downloader': return <Download size={14} />;
      case 'News': return <Newspaper size={14} />;
      default: return <Globe size={14} />;
    }
  };

  // Generate copyable curl code string
  const getCurlCode = () => {
    const method = getActiveMethod();
    const evalUrl = getEvaluatedUrl();
    if (method === 'GET') {
      return `curl "${evalUrl}"`;
    }
    if (activeTopic.category === 'Media Uploaders' || activeTopic.category === 'File Uploaders') {
      return `curl -X POST "${evalUrl}" \\\n  -F "image=@path_to_file.zip"`;
    }
    return `curl -X POST "${evalUrl}" \\\n  -H "Content-Type: application/json" \\\n  -d '${getPayloadJson().replace(/\n/g, '\n    ')}'`;
  };

  // Renders the beautifully formatted "visual" (Hasil Jadi) tab output
  const renderVisualResult = () => {
    if (!responseJson) return null;

    if (!responseJson.success) {
      console.error("Gateway response error data detail:", responseJson);
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



    // 6. Downloader Layout
    if (activeTopic.category === 'Downloader' && resData) {
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#27C93F', fontWeight: 700, textTransform: 'uppercase' }}>✓ DOWNLOAD LINKS EXTRACTED</span>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--white)', marginTop: '4px' }}>
              {resData.title || 'TikTok Downloader'}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'start' }}>
            {videoSource ? (
              <CustomVideoPlayer src={videoSource} poster={resData.cover} />
            ) : (
              resData.cover && (
                <div style={{ border: '1px solid var(--border-color)', padding: '8px', backgroundColor: 'var(--black)' }}>
                  <img src={resData.cover} referrerPolicy="no-referrer" alt="Video Thumbnail" style={{ maxWidth: '240px', maxHeight: '240px', display: 'block', objectFit: 'contain' }} />
                </div>
              )
            )}

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {resData.creator && (
                  <div style={{ border: '1px solid var(--border-color)', padding: '10px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                    <span style={{ display: 'block', fontSize: '9px', color: 'var(--ash)', fontFamily: 'var(--font-mono)' }}>CREATOR</span>
                    <span style={{ fontSize: '13px', color: 'var(--white)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{resData.creator}</span>
                  </div>
                )}
                {resData.duration && (
                  <div style={{ border: '1px solid var(--border-color)', padding: '10px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                    <span style={{ display: 'block', fontSize: '9px', color: 'var(--ash)', fontFamily: 'var(--font-mono)' }}>DURATION</span>
                    <span style={{ fontSize: '13px', color: 'var(--white)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{resData.duration}</span>
                  </div>
                )}
                {resData.description && (
                  <div style={{ border: '1px solid var(--border-color)', padding: '10px', backgroundColor: 'rgba(255,255,255,0.01)', gridColumn: 'span 2' }}>
                    <span style={{ display: 'block', fontSize: '9px', color: 'var(--ash)', fontFamily: 'var(--font-mono)' }}>DESCRIPTION</span>
                    <span style={{ fontSize: '12px', color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>{resData.description}</span>
                  </div>
                )}
              </div>

              {resData.links && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--ash)', display: 'block' }}>DOWNLOAD FORMATS</span>

                  {!Array.isArray(resData.links) && resData.links.nowatermark && (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <a href={resData.links.nowatermark} target="_blank" rel="noreferrer" className="btn btn-gold" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', padding: '8px 16px', fontSize: '11px', fontWeight: 700, flex: 1 }}>
                        DOWNLOAD VIDEO (NO WATERMARK)
                      </a>
                      <button onClick={() => copyToClipboard(resData.links.nowatermark)} className="btn btn-black" style={{ padding: '8px 16px', fontSize: '11px', fontWeight: 700, border: '1px solid var(--border-color)' }}>
                        COPY
                      </button>
                    </div>
                  )}

                  {!Array.isArray(resData.links) && resData.links.watermark && (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <a href={resData.links.watermark} target="_blank" rel="noreferrer" className="btn btn-gold" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', padding: '8px 16px', fontSize: '11px', fontWeight: 700, flex: 1, filter: 'grayscale(0.6)' }}>
                        DOWNLOAD VIDEO (WITH WATERMARK)
                      </a>
                      <button onClick={() => copyToClipboard(resData.links.watermark)} className="btn btn-black" style={{ padding: '8px 16px', fontSize: '11px', fontWeight: 700, border: '1px solid var(--border-color)' }}>
                        COPY
                      </button>
                    </div>
                  )}

                  {!Array.isArray(resData.links) && resData.links.audio && (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <a href={resData.links.audio} target="_blank" rel="noreferrer" className="btn btn-gold" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', padding: '8px 16px', fontSize: '11px', fontWeight: 700, flex: 1, backgroundColor: '#28A745', borderColor: '#28A745' }}>
                        DOWNLOAD AUDIO (MP3)
                      </a>
                      <button onClick={() => copyToClipboard(resData.links.audio)} className="btn btn-black" style={{ padding: '8px 16px', fontSize: '11px', fontWeight: 700, border: '1px solid var(--border-color)' }}>
                        COPY
                      </button>
                    </div>
                  )}

                  {Array.isArray(resData.links) && resData.links.map((link: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <a href={link.url} target="_blank" rel="noreferrer" className="btn btn-gold" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', padding: '8px 16px', fontSize: '11px', fontWeight: 700, flex: 1 }}>
                        {link.label || `DOWNLOAD MEDIA ${idx + 1}`}
                      </a>
                      <button onClick={() => copyToClipboard(link.url)} className="btn btn-black" style={{ padding: '8px 16px', fontSize: '11px', fontWeight: 700, border: '1px solid var(--border-color)' }}>
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

    // 7. News Layout
    if (activeTopic.category === 'News' && resData && resData.articles) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#27C93F', fontWeight: 700, textTransform: 'uppercase' }}>✓ NEWS FETCHED</span>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--white)', marginTop: '4px' }}>
              {resData.source || 'The Straits Times'}
            </h2>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--ash)', marginTop: '4px', display: 'block' }}>
              CATEGORY: <span style={{ color: 'var(--gold-text)' }}>{resData.category}</span> · {resData.total} ARTICLES
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {resData.articles.map((article: any, idx: number) => (
              <a
                key={idx}
                href={article.url}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'flex', gap: '14px', alignItems: 'start', padding: '14px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.01)', textDecoration: 'none', transition: 'border-color 0.2s', cursor: 'pointer' }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--gold)')}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
              >
                {article.image && (
                  <img
                    src={article.image}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    style={{ width: '80px', height: '55px', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border-color)' }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--white)', display: 'block', lineHeight: 1.4 }}>{article.title}</span>
                  {article.description && (
                    <span style={{ fontSize: '11px', color: 'var(--ash)', display: 'block', marginTop: '4px', lineHeight: 1.5 }}>{article.description}</span>
                  )}
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--ash)', display: 'block', marginTop: '6px', opacity: 0.7 }}>
                    {article.published ? new Date(article.published).toLocaleString() : ''}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      );
    }

    // 5. CDN Uploader Layout
    if ((activeTopic.category === 'Media Uploaders' || activeTopic.category === 'File Uploaders') && resData && resData.link) {
      const isImage = resData.type && resData.type.startsWith('image/');
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#27C93F', fontWeight: 700, textTransform: 'uppercase' }}>✓ CDN UPLOAD SUCCESSFUL</span>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--white)', marginTop: '4px' }}>
              {activeTopic.title.replace(' Uploader', ' Hosted Asset')}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'start' }}>
            <div style={{ border: '1px solid var(--border-color)', padding: '8px', backgroundColor: 'var(--black)' }}>
              {isImage ? (
                <img src={resData.link} alt="Uploaded Asset" style={{ maxWidth: '240px', maxHeight: '240px', display: 'block', objectFit: 'contain' }} />
              ) : (
                <div style={{ width: '240px', height: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--ash)', fontFamily: 'var(--font-mono)', fontSize: '11px', gap: '12px' }}>
                  <Upload size={40} style={{ color: 'var(--gold)' }} />
                  <span>NON-IMAGE FILE HOSTED</span>
                </div>
              )}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--ash)', display: 'block', marginBottom: '4px' }}>DIRECT URL</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    readOnly
                    value={resData.link}
                    style={{ flex: 1, padding: '8px 12px', backgroundColor: 'var(--black)', color: 'var(--white)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-mono)', fontSize: '12px', outline: 'none' }}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {resData.view_url && (
                  <div style={{ border: '1px solid var(--border-color)', padding: '10px', backgroundColor: 'rgba(255,255,255,0.01)', gridColumn: 'span 2' }}>
                    <span style={{ display: 'block', fontSize: '9px', color: 'var(--ash)', fontFamily: 'var(--font-mono)' }}>VIEWER PAGE</span>
                    <a href={resData.view_url} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: 'var(--gold-text)', fontWeight: 700, fontFamily: 'var(--font-mono)', textDecoration: 'none' }}>{resData.view_url}</a>
                  </div>
                )}
                {resData.delete_url && (
                  <div style={{ border: '1px solid var(--border-color)', padding: '10px', backgroundColor: 'rgba(255,255,255,0.01)', gridColumn: 'span 2' }}>
                    <span style={{ display: 'block', fontSize: '9px', color: 'var(--ash)', fontFamily: 'var(--font-mono)' }}>DELETE LINK</span>
                    <a href={resData.delete_url} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: 'var(--red-pulse)', fontWeight: 700, fontFamily: 'var(--font-mono)', textDecoration: 'none' }}>{resData.delete_url}</a>
                  </div>
                )}
                {resData.width && resData.height && (
                  <div style={{ border: '1px solid var(--border-color)', padding: '10px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                    <span style={{ display: 'block', fontSize: '9px', color: 'var(--ash)', fontFamily: 'var(--font-mono)' }}>DIMENSIONS</span>
                    <span style={{ fontSize: '13px', color: 'var(--white)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{resData.width} x {resData.height} px</span>
                  </div>
                )}
                {resData.size && (
                  <div style={{ border: '1px solid var(--border-color)', padding: '10px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                    <span style={{ display: 'block', fontSize: '9px', color: 'var(--ash)', fontFamily: 'var(--font-mono)' }}>FILE SIZE</span>
                    <span style={{ fontSize: '13px', color: 'var(--white)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{(resData.size / 1024).toFixed(1)} KB</span>
                  </div>
                )}
                {resData.type && (
                  <div style={{ border: '1px solid var(--border-color)', padding: '10px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                    <span style={{ display: 'block', fontSize: '9px', color: 'var(--ash)', fontFamily: 'var(--font-mono)' }}>MIME TYPE</span>
                    <span style={{ fontSize: '13px', color: 'var(--white)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{resData.type}</span>
                  </div>
                )}
                {resData.deletehash && (
                  <div style={{ border: '1px solid var(--border-color)', padding: '10px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                    <span style={{ display: 'block', fontSize: '9px', color: 'var(--ash)', fontFamily: 'var(--font-mono)' }}>DELETE HASH</span>
                    <span style={{ fontSize: '13px', color: 'var(--gold-text)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{resData.deletehash}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <pre className="response-pre">
        <code>{JSON.stringify(responseJson, null, 2)}</code>
      </pre>
    );
  };

  return (
    <div className="docs-container container">
      {/* Sidebar Navigation */}
      <aside className="docs-sidebar">
        {Object.entries(categories)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([categoryName, topics]) => (
            <div key={categoryName} className="docs-sidebar-group">
              <div className="docs-sidebar-category">
                {getCategoryIcon(categoryName)}
                <span>{categoryName}</span>
              </div>
              <div className="docs-sidebar-links">
                {topics.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => setActiveTopic(topic)}
                    className={`docs-sidebar-link ${activeTopic.id === topic.id ? 'active' : ''}`}
                  >
                    {topic.title}
                    {topic.method && (
                      <span className={`method-badge ${topic.method.toLowerCase()}`}>
                        {topic.method}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
      </aside>

      {/* Main Content Area */}
      <main className="docs-content">
        <div className="docs-content-header">
          <span className="docs-pretitle">{activeTopic.category.toUpperCase()}</span>
          <h1 className="docs-title">{activeTopic.title}</h1>
        </div>

        <p className="docs-description-text">{activeTopic.description}</p>

        {/* Subtle Endpoint Row with Copy Utilities */}
        {activeTopic.path && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid var(--border-color)',
            padding: '12px 16px',
            backgroundColor: 'var(--black)',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className={`method-badge ${getActiveMethod().toLowerCase()}`} style={{
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)'
              }}>
                {getActiveMethod()}
              </span>
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--white)', fontWeight: 700 }}>
                {getEvaluatedUrl()}
              </code>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getCurlCode());
                  setCopiedText('curl');
                  setTimeout(() => setCopiedText(''), 2000);
                }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: 'var(--dark-iron)',
                  color: 'var(--white)',
                  border: '1px solid var(--border-color)',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  borderRadius: '0px',
                  transition: 'border-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--gold)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
              >
                {copiedText === 'curl' ? '✓ COPIED' : 'COPY'}
              </button>
            </div>
          </div>
        )}



        {/* Dynamic Interactive Parameters Form */}
        {activeTopic.method && (
          <div className="docs-section">
            <h3 className="section-title">Endpoint Parameters Form</h3>
            <div style={{ border: '1px solid var(--border-color)', padding: '24px', backgroundColor: 'var(--dark-iron)', marginTop: '16px' }}>
              {activeTopic.parameters && activeTopic.parameters.length > 0 ? (
                <div>
                  {activeTopic.parameters.map(param => {
                    const isRequired = param.required;
                    const isUploaderUrl = (activeTopic.category === 'Media Uploaders' || activeTopic.category === 'File Uploaders') && uploadMode === 'url';
                    const val = isUploaderUrl ? (formValues['url'] ?? '') : (formValues[param.name] ?? '');
                    const label = isUploaderUrl ? 'url' : param.name;

                    return (
                      <div key={param.name} className="docs-form-field" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--white)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {label} {isRequired && <span style={{ color: 'var(--gold-text)' }}>*</span>}
                        </label>
                        {param.type === 'file' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {/* Tab toggles */}
                            <div style={{ display: 'flex', gap: '1px', backgroundColor: 'var(--border-color)', width: 'fit-content', marginBottom: '8px' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setUploadMode('file');
                                  setFormValues({ image: '' });
                                }}
                                style={{
                                  padding: '6px 12px',
                                  fontSize: '10px',
                                  fontFamily: 'var(--font-mono)',
                                  fontWeight: 700,
                                  backgroundColor: uploadMode === 'file' ? 'var(--dark-iron)' : 'var(--black)',
                                  color: uploadMode === 'file' ? 'var(--white)' : 'var(--ash)',
                                  border: 'none',
                                  cursor: 'pointer',
                                  borderRadius: '0px'
                                }}
                              >
                                FILE UPLOAD
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setUploadMode('url');
                                  setFormValues({ url: '' });
                                }}
                                style={{
                                  padding: '6px 12px',
                                  fontSize: '10px',
                                  fontFamily: 'var(--font-mono)',
                                  fontWeight: 700,
                                  backgroundColor: uploadMode === 'url' ? 'var(--dark-iron)' : 'var(--black)',
                                  color: uploadMode === 'url' ? 'var(--white)' : 'var(--ash)',
                                  border: 'none',
                                  cursor: 'pointer',
                                  borderRadius: '0px'
                                }}
                              >
                                FILE URL
                              </button>
                            </div>

                            {uploadMode === 'file' ? (
                              <>
                                <input
                                  type="file"
                                  accept={activeTopic.category === 'File Uploaders' ? '*/*' : 'image/*'}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        setFormValues(prev => ({ ...prev, [param.name]: reader.result }));
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  style={{ display: 'none' }}
                                  id="docs-file-input"
                                />
                                <label
                                  htmlFor="docs-file-input"
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragging(true);
                                  }}
                                  onDragLeave={() => setIsDragging(false)}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    setIsDragging(false);
                                    const file = e.dataTransfer.files?.[0];
                                    if (file && (activeTopic.category === 'File Uploaders' || file.type.startsWith('image/'))) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        setFormValues(prev => ({ ...prev, [param.name]: reader.result }));
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: isDragging ? '1px dashed var(--gold)' : '1px dashed var(--border-color)',
                                    padding: '32px 20px',
                                    minHeight: '160px',
                                    cursor: 'pointer',
                                    backgroundColor: isDragging ? 'rgba(255,192,0,0.03)' : 'var(--black)',
                                    color: 'var(--ash)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '11px',
                                    textAlign: 'center',
                                    transition: 'all 0.2s',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                  }}
                                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--gold)'}
                                  onMouseOut={(e) => e.currentTarget.style.borderColor = isDragging ? 'var(--gold)' : 'var(--border-color)'}
                                >
                                  {val && String(val).startsWith('data:') ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                      <span style={{ color: '#27C93F', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', letterSpacing: '0.05em' }}>
                                        <Check size={14} strokeWidth={3} /> {String(val).startsWith('data:image/') ? 'IMAGE' : 'FILE'} READY FOR GATEWAY
                                      </span>
                                      <div style={{ border: '1px solid var(--border-color)', padding: '6px', backgroundColor: 'var(--black)', display: 'inline-block' }}>
                                        {String(val).startsWith('data:image/') ? (
                                          <img src={String(val)} alt="Upload preview" style={{ maxWidth: '120px', maxHeight: '120px', display: 'block', objectFit: 'contain' }} />
                                        ) : (
                                          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--ash)', fontFamily: 'var(--font-mono)', fontSize: '10px', gap: '8px' }}>
                                            <Upload size={24} style={{ color: 'var(--gold)' }} />
                                            <span>{String(val).split(';')[0].split(':')[1] || 'BINARY FILE'}</span>
                                          </div>
                                        )}
                                      </div>
                                      <span style={{ fontSize: '9px', color: 'var(--ash)', textTransform: 'uppercase', opacity: 0.8 }}>
                                        CLICK OR DROP ANOTHER {activeTopic.category === 'File Uploaders' ? 'FILE' : 'IMAGE'} TO REPLACE
                                      </span>
                                    </div>
                                  ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                      <Upload size={20} style={{ color: 'var(--ash)' }} />
                                      <span style={{ fontWeight: 700, letterSpacing: '0.05em' }}>
                                        CLICK OR DRAG {activeTopic.category === 'File Uploaders' ? 'FILE' : 'IMAGE FILE'} HERE
                                      </span>
                                    </div>
                                  )}
                                </label>
                              </>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <input
                                  type="text"
                                  placeholder={activeTopic.category === 'File Uploaders' ? "Enter or paste file URL (e.g. https://example.com/document.zip)" : "Enter or paste image URL (e.g. https://example.com/photo.jpg)"}
                                  value={val && !String(val).startsWith('data:') ? String(val) : ''}
                                  onChange={(e) => setFormValues(prev => ({ ...prev, [isUploaderUrl ? 'url' : param.name]: e.target.value }))}
                                  className="docs-input"
                                  style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: 'var(--black)',
                                    color: 'var(--white)',
                                    border: focusedField === param.name ? '1px solid var(--gold)' : '1px solid #2B2B2B',
                                    borderRadius: '0px',
                                    outline: 'none',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '12px',
                                    transition: 'border-color 0.2s'
                                  }}
                                  onFocus={() => setFocusedField(param.name)}
                                  onBlur={() => setFocusedField(null)}
                                />
                                {val && !String(val).startsWith('data:') && (
                                  <div style={{ border: '1px solid var(--border-color)', padding: '8px', backgroundColor: 'var(--black)', display: 'inline-block', width: 'fit-content' }}>
                                    <img
                                      src={String(val)}
                                      alt="URL preview"
                                      style={{ maxWidth: '80px', maxHeight: '80px', objectFit: 'contain', display: 'block' }}
                                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ) : param.type === 'number' ? (
                          <input
                            type="number"
                            placeholder={`Enter ${param.name}...`}
                            value={val}
                            onChange={(e) => setFormValues(prev => ({ ...prev, [param.name]: Number(e.target.value) }))}
                            className="docs-input"
                            style={{
                              width: '100%',
                              padding: '12px',
                              backgroundColor: 'var(--black)',
                              color: 'var(--white)',
                              border: focusedField === param.name ? '1px solid var(--gold)' : '1px solid #2B2B2B',
                              borderRadius: '0px',
                              outline: 'none',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '12px',
                              transition: 'border-color 0.2s'
                            }}
                            onFocus={() => setFocusedField(param.name)}
                            onBlur={() => setFocusedField(null)}
                          />
                        ) : label === 'text' ? (
                          <textarea
                            value={val}
                            placeholder={`Enter ${param.name}...`}
                            onChange={(e) => setFormValues(prev => ({ ...prev, [param.name]: e.target.value }))}
                            className="docs-input"
                            rows={3}
                            style={{
                              width: '100%',
                              padding: '12px',
                              backgroundColor: 'var(--black)',
                              color: 'var(--white)',
                              border: focusedField === param.name ? '1px solid var(--gold)' : '1px solid #2B2B2B',
                              borderRadius: '0px',
                              outline: 'none',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '12px',
                              resize: 'vertical',
                              transition: 'border-color 0.2s'
                            }}
                            onFocus={() => setFocusedField(param.name)}
                            onBlur={() => setFocusedField(null)}
                          />
                        ) : param.type === 'select' ? (
                          <CustomDropdown
                            value={String(val)}
                            options={(param as any).options ?? []}
                            onChange={(v) => setFormValues(prev => ({ ...prev, [param.name]: v }))}
                          />
                        ) : (
                          <input
                            type="text"
                            placeholder={`Enter ${param.name}...`}
                            value={val}
                            onChange={(e) => setFormValues(prev => ({ ...prev, [param.name]: e.target.value }))}
                            className="docs-input"
                            style={{
                              width: '100%',
                              padding: '12px',
                              backgroundColor: 'var(--black)',
                              color: 'var(--white)',
                              border: focusedField === param.name ? '1px solid var(--gold)' : '1px solid #2B2B2B',
                              borderRadius: '0px',
                              outline: 'none',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '12px',
                              transition: 'border-color 0.2s'
                            }}
                            onFocus={() => setFocusedField(param.name)}
                            onBlur={() => setFocusedField(null)}
                          />
                        )}
                        <span style={{ fontSize: '11px', color: 'var(--ash)', marginTop: '6px', display: 'block', fontFamily: 'var(--font-display)' }}>{param.desc}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <span style={{ fontSize: '13px', color: 'var(--ash)' }}>No additional request configuration payload required.</span>
              )}

              <button
                onClick={handleSendRequest}
                className="btn btn-gold"
                style={{ width: '100%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', marginTop: '24px' }}
                disabled={loading}
              >
                {loading ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                {loading ? 'RUNNING DATA...' : 'SEND REQUEST'}
              </button>
            </div>
          </div>
        )}

        {/* Sandbox Response Viewer */}
        {activeTopic.method && (
          <div className="docs-section">
            <h3 className="section-title">Execution Response</h3>

            <div className="sandbox-panel" style={{ marginTop: '16px' }}>
              <div className="sandbox-panel-header" style={{ padding: '0px' }}>
                <div style={{ display: 'flex' }}>
                  <button
                    onClick={() => setResponseTab('visual')}
                    className={`nav-link`}
                    style={{
                      padding: '16px 24px',
                      background: responseTab === 'visual' ? 'var(--dark-iron)' : 'transparent',
                      color: responseTab === 'visual' ? 'var(--white)' : 'var(--ash)',
                      border: 'none',
                      borderRight: '1px solid var(--border-color)',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      borderRadius: '0px'
                    }}
                  >
                    PREVIEW
                  </button>
                  <button
                    onClick={() => setResponseTab('json')}
                    className={`nav-link`}
                    style={{
                      padding: '16px 24px',
                      background: responseTab === 'json' ? 'var(--dark-iron)' : 'transparent',
                      color: responseTab === 'json' ? 'var(--white)' : 'var(--ash)',
                      border: 'none',
                      borderRight: '1px solid var(--border-color)',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      borderRadius: '0px'
                    }}
                  >
                    RAW JSON
                  </button>
                </div>

                <button
                  onClick={() => copyToClipboard(responseJson ? JSON.stringify(responseJson, null, 2) : getCurlCode())}
                  className="btn-text-copy"
                  style={{ marginRight: '16px' }}
                >
                  {copied ? <Check size={12} style={{ color: '#27C93F' }} /> : responseJson ? 'COPY JSON' : 'COPY CURL'}
                </button>
              </div>

              <div className="sandbox-response-container" style={{ backgroundColor: 'var(--dark-iron)', padding: '24px', minHeight: '280px' }}>
                {responseJson ? (
                  responseTab === 'visual' ? (
                    renderVisualResult()
                  ) : (
                    <pre className="response-pre">
                      <code style={{ color: 'var(--smoke)' }}>{JSON.stringify(responseJson, null, 2)}</code>
                    </pre>
                  )
                ) : (
                  <div className="sandbox-empty-message">
                    <span>Click "SEND REQUEST" above to trigger a live scraper request execution and preview results.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
