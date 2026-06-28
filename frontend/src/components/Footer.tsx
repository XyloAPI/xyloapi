import { Terminal } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="container">
        
        {/* Brand */}
        <div className="footer-col-brand">
          <a href="/" className="footer-brand-logo">
            <Terminal size={18} style={{ color: 'var(--gold)' }} />
            <span className="footer-brand-text">XYLO<span>API</span></span>
          </a>
          <p className="footer-brand-desc">
            Platform scraping web yang dirancang untuk developer. Cepat, andal, dan siap menangani kebutuhan mulai dari proyek kecil hingga skala besar.
          </p>
        </div>

        {/* Lower footer */}
        <div className="footer-bottom-row">
          
          <span className="footer-copy">
            &copy; {new Date().getFullYear()} XYLOAPI. ALL RIGHTS RESERVED.
          </span>


        </div>

      </div>
    </footer>
  );
}
