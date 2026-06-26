import { Terminal, Sun, Moon } from 'lucide-react';
import './Navbar.css';

interface NavbarProps {
  currentView: 'landing' | 'monitor' | 'docs';
  onViewChange: (view: 'landing' | 'monitor' | 'docs') => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export default function Navbar({ currentView, onViewChange, theme, onToggleTheme }: NavbarProps) {
  return (
    <nav className="landing-header">
      <div className="container header-inner">
        
        {/* Brand identity */}
        <a 
          href="#landing" 
          className="brand-link"
          onClick={(e) => {
            e.preventDefault();
            onViewChange('landing');
            window.location.hash = '';
          }}
        >
          <Terminal size={20} style={{ color: 'var(--gold)' }} />
          <span className="brand-text">XYLO<span>API</span></span>
        </a>

        {/* Center menu links */}
        <div className="header-nav-links">
          <a 
            href="#landing" 
            className={`nav-link ${currentView === 'landing' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onViewChange('landing');
              window.location.hash = '';
            }}
          >
            Home
          </a>
          <a 
            href="#monitor" 
            className={`nav-link ${currentView === 'monitor' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onViewChange('monitor');
              window.location.hash = 'monitor';
            }}
          >
            Monitor
          </a>
          <a 
            href="#docs" 
            className={`nav-link ${currentView === 'docs' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onViewChange('docs');
              window.location.hash = 'docs';
            }}
          >
            Docs
          </a>
          <a href="#features" className="nav-link">Features</a>
        </div>

        {/* Right action status - Dark/Light Theme Toggle */}
        <div className="header-actions">
          <button 
            onClick={onToggleTheme} 
            className="theme-toggle-btn"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

      </div>
    </nav>
  );
}
