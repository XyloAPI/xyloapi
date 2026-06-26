import { Terminal } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="container">
        
        {/* Upper footer */}
        <div className="footer-upper-row">
          
          {/* Brand Col */}
          <div className="footer-col-brand">
            <a href="/" className="footer-brand-logo">
              <Terminal size={18} style={{ color: 'var(--gold)' }} />
              <span className="footer-brand-text">XYLO<span>API</span></span>
            </a>
            <p className="footer-brand-desc">
              Developer-first data extraction infrastructure. High-resilience scraping engines optimized for performance.
            </p>
          </div>

          {/* Links Groups */}
          <div className="footer-links-group">
            
            {/* Columns */}
            <div className="footer-col-links">
              <span className="footer-col-title">Core Services</span>
              <a href="#endpoints" className="footer-link">Data Routes</a>
              <a href="#endpoints" className="footer-link">AI Parsers</a>
              <a href="#endpoints" className="footer-link">Session Proxies</a>
            </div>

            <div className="footer-col-links">
              <span className="footer-col-title">API Specs</span>
              <a href="#" className="footer-link">Swagger JSON</a>
              <a href="#" className="footer-link">Gateway Status</a>
              <a href="#" className="footer-link">Subprocess Logs</a>
            </div>

          </div>

        </div>

        {/* Lower footer */}
        <div className="footer-bottom-row">
          
          <span className="footer-copy">
            &copy; {new Date().getFullYear()} XYLOAPI. ALL RIGHTS RESERVED.
          </span>

          <div className="footer-specs-badge">
            <span>SLA: 99.9%</span>
            <span className="footer-specs-divider">|</span>
            <span>SECURE HTTPS</span>
            <span className="footer-specs-divider">|</span>
            <span>V1.0 LIVE</span>
          </div>

        </div>

      </div>
    </footer>
  );
}
