

export default function Features() {
  return (
    <section id="features" className="features-section">
      <div className="container">
        <div className="features-grid">
          
          {/* Card 1: Anti-Bot */}
          <div className="feature-card">
            <span className="feature-tag">Evasion Engine</span>
            <h2 className="feature-title">
              AUTOMATED ANTI-BOT & CAPTCHA BYPASS
            </h2>
            <p className="feature-text">
              Dynamic Javascript websites require advanced orchestration. 
              Our gateway manages headless browser rotation, mimics TLS fingerprints, 
              solves captcha tokens, and intercepts payloads without you configuring a single browser.
            </p>
            <div className="feature-subpoints">
              <div>
                <h4 className="feature-subpoint-title">Zero Setups</h4>
                <p className="feature-subpoint-text">Query standard JSON. We handle browser instances.</p>
              </div>
              <div>
                <h4 className="feature-subpoint-title">Solve CAPTCHAs</h4>
                <p className="feature-subpoint-text">Automatic solver integration on target load.</p>
              </div>
            </div>
          </div>

          {/* Card 2: Proxy Rotation */}
          <div className="feature-card">
            <span className="feature-tag" style={{ color: 'var(--cyan-pulse)' }}>IP Routing</span>
            <h2 className="feature-title">
              RESIDENTIAL PROXY ROTATION
            </h2>
            <p className="feature-text">
              Avoid rate limits and geoblocks. Every request is automatically 
              routed through a pool of residential proxies, keeping your 
              data streams clean and uninterrupted.
            </p>
            <div className="feature-subpoints">
              <div>
                <h4 className="feature-subpoint-title">Global Pools</h4>
                <p className="feature-subpoint-text">Geolocated nodes from US, EU, and Asia.</p>
              </div>
              <div>
                <h4 className="feature-subpoint-title">Auto-Fallback</h4>
                <p className="feature-subpoint-text">Instant routing retries if proxy node drops.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
