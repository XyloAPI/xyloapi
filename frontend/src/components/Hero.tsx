export default function Hero() {
  return (
    <section className="hero-section">
      <div className="container hero-content-center">
        
        <h1 className="hero-title centered">
          THE DATA<br/>
          <span>GATEWAY</span>
        </h1>
        
        <p className="hero-description centered">
          Retrieve clean, structured JSON payloads from any web target instantly. 
          XyloAPI handles dynamic rendering, residential proxy rotation, and anti-bot evasion 
          transparently under a single unified REST gateway.
        </p>

        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginBottom: '72px', flexWrap: 'wrap' }}>
          <a href="#docs" className="btn btn-gold">
            Open Docs
          </a>
          <a href="#features" className="btn btn-ghost">
            View Features
          </a>
        </div>

      </div>
    </section>
  );
}
