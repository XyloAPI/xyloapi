import './Hero.css';

interface HeroProps {
  onViewChange: (view: 'landing' | 'monitor' | 'docs') => void;
}

export default function Hero({ onViewChange }: HeroProps) {
  return (
    <section className="hero-section">
      <div className="container hero-container">
        
        {/* Main Header */}
        <div className="hero-text-block">
          <h1 className="hero-main-title">
            The web scraping API for developers.
          </h1>
          <p className="hero-sub-title">
            Retrieve structured JSON payloads from any target website instantly. 
            XyloAPI transparently manages headless browser pools, geolocated residential proxy rotation, 
            and TLS fingerprint challenge bypass.
          </p>
          <div className="hero-cta-buttons">
            <button onClick={() => onViewChange('docs')} className="btn btn-gold">
              Get Started
            </button>
            <button onClick={() => onViewChange('monitor')} className="btn btn-ghost">
              System Telemetry
            </button>
          </div>
        </div>

      </div>

      {/* Structured Minimal Features Grid */}
      <div className="container features-section-clean">
        <div className="features-layout-grid">
          <div className="features-item">
            <h3>Headless Rendering</h3>
            <p>Executes JavaScript and AJAX elements dynamically using containerized Chromium clusters.</p>
          </div>
          <div className="features-item">
            <h3>IP Rotation</h3>
            <p>Routes requests through residential proxy nodes to prevent geoblocks and rate limiting.</p>
          </div>
          <div className="features-item">
            <h3>Challenge Evasion</h3>
            <p>Mimics modern desktop browser headers and TLS fingerprints to avoid detection.</p>
          </div>
          <div className="features-item">
            <h3>Standardized JSON</h3>
            <p>Converts unformatted target outputs into clean, structured, and predictable payloads.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
