import type { DocTopic } from '../types';

interface ImageToolsLayoutProps {
  activeTopic: DocTopic;
  resData: any;
  copyToClipboard: (text: string) => void;
}

export default function ImageToolsLayout({ activeTopic, resData, copyToClipboard }: ImageToolsLayoutProps) {
  const isSplit = activeTopic.id === 'split';
  if (isSplit && resData.slices) {
    const gridCols = resData.cols || 2;
    const gridRows = resData.rows || 2;
    return (
      <div className="response-layout">
        <div className="response-header">
          <span className="response-status-badge">
            ✓ IMAGE SPLIT SUCCESSFUL
          </span>
          <h2 className="response-title">
            Split Image Grid ({gridCols}x{gridRows})
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'start' }}>
          {/* Grid representation */}
          <div style={{ flexShrink: 0 }}>
            <span className="response-label" style={{ marginBottom: '8px' }}>
              SPLIT PIECES PREVIEW (CLICK TO ENLARGE)
            </span>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
              gap: '4px',
              border: '1px solid var(--border-color)',
              padding: '8px',
              backgroundColor: 'var(--black)',
              backgroundImage: 'linear-gradient(45deg, #151515 25%, transparent 25%), linear-gradient(-45deg, #151515 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #151515 75%), linear-gradient(-45deg, transparent 75%, #151515 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              maxWidth: '340px'
            }}>
              {resData.slices.map((slice: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    border: '1px dashed var(--gold)',
                    overflow: 'hidden',
                    aspectRatio: `${slice.width} / ${slice.height}`,
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open(slice.url, '_blank')}
                  title={`Slice ${slice.row + 1}, ${slice.col + 1} (${slice.width}x${slice.height}px)`}
                >
                  <img
                    src={slice.url}
                    referrerPolicy="no-referrer"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    color: 'var(--gold-text)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '8px',
                    padding: '1px 3px'
                  }}>
                    R{slice.row + 1} C{slice.col + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slices list with links */}
          <div className="response-list" style={{ flex: 1, minWidth: '280px' }}>
            <span className="response-label">
              DOWNLOAD INDIVIDUAL PARTS
            </span>
            <div className="response-scroll-container" style={{ maxHeight: '320px' }}>
              {resData.slices.map((slice: any, idx: number) => (
                <div key={idx} className="response-item" style={{ justifyContent: 'space-between', padding: '8px 12px' }}>
                  <span className="response-value-mono" style={{ fontSize: '11px' }}>
                    Part {idx + 1} (R{slice.row + 1}, C{slice.col + 1}) - {slice.width}x{slice.height}px
                  </span>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <a
                      href={slice.url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-gold"
                      style={{ textDecoration: 'none', padding: '4px 8px', fontSize: '9px', fontWeight: 700 }}
                    >
                      DOWNLOAD
                    </a>
                    <button
                      onClick={() => copyToClipboard(slice.url)}
                      className="btn btn-ghost"
                      style={{ padding: '4px 8px', fontSize: '9px', fontWeight: 700 }}
                    >
                      COPY
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = resData.url || resData.image;

  const isUpscale = activeTopic.id === 'upscale';
  const isSepia = activeTopic.id === 'sepia';
  const isInvert = activeTopic.id === 'invert';
  const isFlip = activeTopic.id === 'flip';
  const isPixelate = activeTopic.id === 'pixelate';
  const isRound = activeTopic.id === 'round-corners';
  const isNoise = activeTopic.id === 'add-noise';
  const isBlur = activeTopic.id === 'blur';
  const isSharpen = activeTopic.id === 'sharpen';
  const isSolarize = activeTopic.id === 'solarize';
  const isGlow = activeTopic.id === 'glow';
  const isPosterize = activeTopic.id === 'posterize';
  const isBlurFace = activeTopic.id === 'blurface';
  const isEnhance = activeTopic.id === 'enhance';
  const isQR = activeTopic.category === 'QR Tools';
  const isAIImage = activeTopic.category === 'AI Image';

  let badgeText = '✓ BACKGROUND REMOVED';
  if (isUpscale) badgeText = '✓ IMAGE UPSCALED';
  if (isSepia) badgeText = '✓ SEPIA FILTER APPLIED';
  if (isInvert) badgeText = '✓ COLORS INVERTED';
  if (isFlip) badgeText = '✓ IMAGE FLIPPED';
  if (isPixelate) badgeText = '✓ RETRO PIXELATION APPLIED';
  if (isRound) badgeText = '✓ CORNERS ROUNDED';
  if (isNoise) badgeText = '✓ NOISE FILTER APPLIED';
  if (isBlur) badgeText = '✓ IMAGE BLURRED';
  if (isSharpen) badgeText = '✓ IMAGE SHARPENED';
  if (isSolarize) badgeText = '✓ SOLARIZE EFFECT APPLIED';
  if (isGlow) badgeText = '✓ GLOW EFFECT APPLIED';
  if (isPosterize) badgeText = '✓ POSTERIZE EFFECT APPLIED';
  if (isBlurFace) badgeText = '✓ FACES BLURRED';
  if (isEnhance) badgeText = '✓ IMAGE ENHANCED';
  if (isQR) badgeText = '✓ QR CODE GENERATED';
  if (isAIImage) badgeText = '✓ AI IMAGE GENERATED';

  let downloadText = 'DOWNLOAD TRANSPARENT IMAGE';
  if (isUpscale) downloadText = 'DOWNLOAD UPSCALED IMAGE';
  if (isSepia) downloadText = 'DOWNLOAD SEPIA IMAGE';
  if (isInvert) downloadText = 'DOWNLOAD INVERTED IMAGE';
  if (isFlip) downloadText = 'DOWNLOAD FLIPPED IMAGE';
  if (isPixelate) downloadText = 'DOWNLOAD PIXELATED IMAGE';
  if (isRound) downloadText = 'DOWNLOAD ROUNDED IMAGE';
  if (isNoise) downloadText = 'DOWNLOAD NOISED IMAGE';
  if (isBlur) downloadText = 'DOWNLOAD BLURRED IMAGE';
  if (isSharpen) downloadText = 'DOWNLOAD SHARPENED IMAGE';
  if (isSolarize) downloadText = 'DOWNLOAD SOLARIZED IMAGE';
  if (isGlow) downloadText = 'DOWNLOAD GLOW IMAGE';
  if (isPosterize) downloadText = 'DOWNLOAD POSTERIZED IMAGE';
  if (isBlurFace) downloadText = 'DOWNLOAD FACE BLURRED IMAGE';
  if (isEnhance) downloadText = 'DOWNLOAD ENHANCED IMAGE';
  if (isQR) downloadText = 'DOWNLOAD QR CODE';
  if (isAIImage) downloadText = 'DOWNLOAD GENERATED IMAGE';

  const showGridBg = !isUpscale && !isSepia && !isInvert && !isFlip && !isPixelate && !isRound && !isNoise && !isBlur && !isSharpen && !isSolarize && !isGlow && !isPosterize && !isBlurFace && !isEnhance && !isQR && !isAIImage;
  const previewAlt = isUpscale ? 'Upscaled Preview' : isSepia ? 'Sepia Filter Preview' : isInvert ? 'Inverted Colors Preview' : isFlip ? 'Flipped Image Preview' : isPixelate ? 'Pixelated Preview' : isRound ? 'Rounded Corners Preview' : isNoise ? 'Noise Applied Preview' : isBlur ? 'Blurred Image Preview' : isSharpen ? 'Sharpened Image Preview' : isSolarize ? 'Solarized Preview' : isGlow ? 'Glow Preview' : isPosterize ? 'Posterized Preview' : isBlurFace ? 'Face Blurred Preview' : isEnhance ? 'Enhanced Image Preview' : isQR ? 'QR Code Preview' : isAIImage ? 'AI Generated Image' : 'Transparent Background Preview';

  return (
    <div className="response-layout">
      <div className="response-header">
        <span className="response-status-badge">
          {badgeText}
        </span>
        <h2 className="response-title">
          {activeTopic.title} Result
        </h2>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'start' }}>
        {imageUrl && (
          <div style={{
            border: '1px solid var(--border-color)',
            padding: '8px',
            backgroundColor: showGridBg ? 'var(--black)' : '#111',
            backgroundImage: showGridBg ? 'linear-gradient(45deg, #151515 25%, transparent 25%), linear-gradient(-45deg, #151515 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #151515 75%), linear-gradient(-45deg, transparent 75%, #151515 75%)' : 'none',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          }}>
            <img src={imageUrl} referrerPolicy="no-referrer" alt={previewAlt} style={{ maxWidth: '320px', maxHeight: '320px', display: 'block', objectFit: 'contain' }} />
          </div>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="response-grid-2">
            {resData.width && resData.height && (
              <div className="response-subcard" style={{ gridColumn: 'span 2' }}>
                <span className="response-label">DIMENSIONS</span>
                <span className="response-value-mono" style={{ fontSize: '13px', fontWeight: 700 }}>{resData.width} x {resData.height} px</span>
              </div>
            )}
            {resData.aspect_ratio && (
              <div className="response-subcard">
                <span className="response-label">ASPECT RATIO</span>
                <span className="response-value-mono" style={{ fontSize: '13px', fontWeight: 700 }}>{resData.aspect_ratio}</span>
              </div>
            )}
            {resData.seed !== undefined && (
              <div className="response-subcard">
                <span className="response-label">SEED</span>
                <span className="response-value-mono" style={{ fontSize: '13px', fontWeight: 700 }}>{resData.seed}</span>
              </div>
            )}
          </div>

          {imageUrl && (
            <div className="response-list" style={{ marginTop: '10px' }}>
              <span className="response-label">OUTPUT LINK</span>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <a href={imageUrl} target="_blank" rel="noreferrer" className="btn btn-gold" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', padding: '8px 16px', fontSize: '11px', fontWeight: 700, flex: 1 }}>
                  {downloadText}
                </a>
                <button onClick={() => copyToClipboard(imageUrl)} className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '11px', fontWeight: 700 }}>
                  COPY LINK
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
