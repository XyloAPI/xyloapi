import { useState, useRef, useEffect } from 'react';
import CustomVideoPlayer from '../CustomVideoPlayer';

interface SearchResultItem {
  pin_id?: string;
  id?: string;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'video' | 'playlist' | 'channel' | 'pin' | 'song';
  duration?: string;
  views?: string;
  published?: string;
  videoCount?: string;
  subscriberCount?: string;
  explicit?: string;
  genre?: string;
  preview?: string;
  play?: string;
  chord?: string;
  creator?: {
    username?: string;
    name?: string;
  };
}

interface SearchLayoutProps {
  resData: SearchResultItem[];
  copyToClipboard: (text: string) => void;
}

function CustomAudioPlayer({ src }: { src: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.log("Play interrupted:", err));
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration || 0);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 12px',
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '6px',
      marginTop: '8px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <style>{`
        .custom-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 4px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.1);
          outline: none;
          margin: 0;
          transition: background 0.2s;
        }
        .custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #c084fc;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 4px rgba(168, 85, 247, 0.5);
          transition: transform 0.1s;
        }
        .custom-slider::-webkit-slider-thumb:hover {
          transform: scale(1.3);
        }
        .custom-slider::-moz-range-thumb {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #c084fc;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 4px rgba(168, 85, 247, 0.5);
          transition: transform 0.1s;
        }
        .custom-slider::-moz-range-thumb:hover {
          transform: scale(1.3);
        }
      `}</style>

      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
        preload="metadata"
      />

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        style={{
          background: 'none',
          padding: 0,
          cursor: 'pointer',
          color: 'var(--white)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: isPlaying ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.04)',
          border: isPlaying ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.2s ease',
          outline: 'none',
          flexShrink: 0
        }}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '10px', height: '10px', color: '#c084fc' }}><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '10px', height: '10px', color: 'var(--white)', marginLeft: '1px' }}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        )}
      </button>

      {/* Current Time */}
      <span style={{
        fontSize: '10px',
        color: 'var(--ash)',
        fontFamily: 'var(--font-mono)',
        width: '32px',
        textAlign: 'right',
        flexShrink: 0,
        userSelect: 'none'
      }}>
        {formatTime(currentTime)}
      </span>

      {/* Progress Slider */}
      <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <input
          type="range"
          min={0}
          max={duration || 30}
          value={currentTime}
          onChange={handleSeek}
          className="custom-slider"
        />
      </div>

      {/* Duration */}
      <span style={{
        fontSize: '10px',
        color: 'var(--ash)',
        fontFamily: 'var(--font-mono)',
        width: '32px',
        textAlign: 'left',
        flexShrink: 0,
        userSelect: 'none'
      }}>
        {formatTime(duration || 30)}
      </span>

      {/* Mute Button */}
      <button
        onClick={toggleMute}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          color: 'var(--ash)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px',
          outline: 'none',
          flexShrink: 0
        }}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '12px', height: '12px', color: 'var(--steel)' }}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '12px', height: '12px', color: 'var(--ash)' }}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
        )}
      </button>
    </div>
  );
}

export default function SearchLayout({ resData, copyToClipboard }: SearchLayoutProps) {
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);

  if (!Array.isArray(resData) || resData.length === 0) {
    return (
      <div style={{ padding: '20px', color: 'var(--ash)', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
        No search results found.
      </div>
    );
  }

  return (
    <div className="response-layout" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="response-header">
        <h2 className="response-title" style={{ fontSize: '14px', letterSpacing: '0.05em', color: 'var(--white)' }}>
          SEARCH RESULTS ({resData.length})
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '20px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {resData.map((item, idx) => {
          const creatorName = item.creator?.name || item.creator?.username || 'Unknown';
          const creatorUsername = item.creator?.username ? `@${item.creator.username}` : '';

          return (
            <div key={item.pin_id || idx} style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'var(--black)',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--gold)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              {/* Image / Video Preview */}
              {item.image ? (
                <div style={{
                  width: '100%',
                  height: playingVideoUrl === item.play ? 'auto' : '200px',
                  backgroundColor: 'transparent',
                  borderBottom: '1px solid var(--border-color)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {playingVideoUrl === item.play ? (
                    <>
                      <CustomVideoPlayer
                        src={item.play!}
                        poster={item.image}
                        style={{
                          maxWidth: '100%',
                          border: 'none',
                          boxShadow: 'none'
                        }}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayingVideoUrl(null);
                        }}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          zIndex: 15,
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '12px', height: '12px' }}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </>
                  ) : (
                    <>
                      <img
                        src={item.image}
                        alt={item.title || 'Preview'}
                        className="search-card-img"
                        referrerPolicy="no-referrer"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          display: 'block',
                          position: 'relative',
                          zIndex: 2
                        }}
                      />
                      {item.play && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlayingVideoUrl(item.play || null);
                          }}
                          style={{
                            position: 'absolute',
                            zIndex: 10,
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(168, 85, 247, 0.8)',
                            border: '2px solid #c084fc',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 0 12px rgba(168, 85, 247, 0.6)',
                            transition: 'transform 0.2s ease, background-color 0.2s',
                            outline: 'none'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.backgroundColor = '#a855f7';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.8)';
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '14px', height: '14px', marginLeft: '2px' }}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </button>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div style={{
                  width: '100%',
                  height: '180px',
                  backgroundColor: 'var(--dark-iron)',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--ash)'
                }}>
                  NO IMAGE
                </div>
              )}

              {/* Card Body */}
              <div style={{
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                flexGrow: 1
              }}>
                {/* Title */}
                <h3 style={{
                  margin: 0,
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'var(--white)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: '1.4'
                }}>
                  {item.title || 'Untitled Pin'}
                </h3>

                {/* Metadata badges for Videos/Playlists/Channels/Songs */}
                {(item.type || item.duration || item.views || item.published || item.videoCount || item.subscriberCount || item.genre || item.explicit) && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    rowGap: '6px',
                    alignItems: 'center',
                    marginTop: '2px',
                    marginBottom: '2px'
                  }}>
                    {item.type && (
                      <span style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '1px 5px',
                        backgroundColor: item.type === 'video' ? 'rgba(255,0,0,0.1)' : item.type === 'playlist' ? 'rgba(212,175,55,0.1)' : item.type === 'song' ? 'rgba(168,85,247,0.1)' : 'rgba(0,180,216,0.1)',
                        border: `1px solid ${item.type === 'video' ? '#ff0000' : item.type === 'playlist' ? 'var(--gold)' : item.type === 'song' ? '#a855f7' : '#00b4d8'}`,
                        color: item.type === 'video' ? '#ff4d4d' : item.type === 'playlist' ? 'var(--gold)' : item.type === 'song' ? '#c084fc' : '#00b4d8',
                        fontFamily: 'var(--font-mono)',
                        borderRadius: '2px'
                      }}>
                        {item.type}
                      </span>
                    )}
                    {item.explicit === 'Yes' && (
                      <span style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '1px 5px',
                        backgroundColor: 'rgba(239,68,68,0.1)',
                        border: '1px solid #ef4444',
                        color: '#f87171',
                        fontFamily: 'var(--font-mono)',
                        borderRadius: '2px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        EXPLICIT
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '10px', height: '10px', color: '#f87171' }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                      </span>
                    )}
                    {item.duration && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--ash)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '11px', height: '11px', color: 'var(--steel)' }}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        <span>{item.duration}</span>
                      </div>
                    )}
                    {item.views && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--ash)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '11px', height: '11px', color: 'var(--steel)' }}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <span>{item.views}</span>
                      </div>
                    )}
                    {item.published && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--ash)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '11px', height: '11px', color: 'var(--steel)' }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <span>{item.published}</span>
                      </div>
                    )}
                    {item.videoCount && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--ash)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '11px', height: '11px', color: 'var(--steel)' }}><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                        <span>{item.videoCount} videos</span>
                      </div>
                    )}
                    {item.subscriberCount && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--ash)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '11px', height: '11px', color: 'var(--steel)' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        <span>{item.subscriberCount}</span>
                      </div>
                    )}
                    {item.genre && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--ash)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '11px', height: '11px', color: 'var(--steel)' }}><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                        <span>{item.genre}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Description */}
                {item.description && (
                  <p style={{
                    margin: 0,
                    fontSize: '10px',
                    color: 'var(--ash)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.4',
                    fontFamily: 'var(--font-display)'
                  }}>
                    {item.description}
                  </p>
                )}

                {/* Chord Sheet Monospace Scrollable Box */}
                {item.chord && (
                  <pre style={{
                    margin: 0,
                    marginTop: '8px',
                    padding: '10px',
                    fontSize: '9.5px',
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px dashed var(--border-color)',
                    maxHeight: '120px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    color: 'var(--gold-text)',
                    lineHeight: '1.45',
                    textAlign: 'left'
                  }}>
                    {item.chord}
                  </pre>
                )}

                {/* Audio Preview for songs */}
                {item.preview && (
                  <CustomAudioPlayer src={item.preview} />
                )}

                {/* Creator */}
                <div style={{
                  marginTop: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  paddingTop: '8px',
                  borderTop: '1px dashed var(--border-color)'
                }}>
                  <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--steel)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>CREATOR</span>
                  <span style={{ fontSize: '11px', color: 'var(--white)', fontWeight: 600 }}>
                    {creatorName} <span style={{ fontSize: '9px', color: 'var(--ash)', fontWeight: 400 }}>{creatorUsername}</span>
                  </span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div style={{
                display: 'flex',
                borderTop: '1px solid var(--border-color)',
                backgroundColor: 'var(--dark-iron)',
                gap: '1px'
              }}>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-gold"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      fontSize: '10px',
                      fontWeight: 700,
                      textAlign: 'center',
                      textDecoration: 'none',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRadius: '0px'
                    }}
                  >
                    {item.type === 'video' ? 'Open Video' : item.type === 'song' ? 'Open Song' : 'Open Link'}
                  </a>
                )}
                {item.chord ? (
                  <button
                    onClick={() => copyToClipboard(item.chord!)}
                    className="btn btn-ghost"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      fontSize: '10px',
                      fontWeight: 700,
                      borderRadius: '0px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'var(--gold)'
                    }}
                  >
                    Copy Chord
                  </button>
                ) : item.image ? (
                  <button
                    onClick={() => copyToClipboard(item.image!)}
                    className="btn btn-ghost"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      fontSize: '10px',
                      fontWeight: 700,
                      borderRadius: '0px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'var(--ash)'
                    }}
                  >
                    Copy URL
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
