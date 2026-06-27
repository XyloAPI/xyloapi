import { useState } from 'react';
import { Terminal, Sun, Moon, Menu, X } from 'lucide-react';
import './Navbar.css';

interface NavbarProps {
  currentView: 'landing' | 'monitor' | 'docs';
  onViewChange: (view: 'landing' | 'monitor' | 'docs') => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export default function Navbar({ currentView, onViewChange, theme, onToggleTheme }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (view: 'landing' | 'monitor' | 'docs', hash: string) => {
    onViewChange(view);
    window.location.hash = hash;
    setMenuOpen(false); // Close mobile menu on click
  };

  return (
    <nav className="landing-header">
      <div className="container header-inner">
        
        {/* Brand identity */}
        <a 
          href="#landing" 
          className="brand-link"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('landing', '');
          }}
        >
          <Terminal size={20} style={{ color: 'var(--gold)' }} />
          <span className="brand-text">XYLO<span>API</span></span>
        </a>

        {/* Center menu links (Desktop & Mobile Drawer) */}
        <div className={`header-nav-links ${menuOpen ? 'mobile-open' : ''}`}>
          <a 
            href="#landing" 
            className={`nav-link ${currentView === 'landing' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('landing', '');
            }}
          >
            Home
          </a>
          <a 
            href="#monitor" 
            className={`nav-link ${currentView === 'monitor' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('monitor', 'monitor');
            }}
          >
            Monitor
          </a>
          <a 
            href="#docs" 
            className={`nav-link ${currentView === 'docs' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('docs', 'docs');
            }}
          >
            Docs
          </a>
          <a 
            href="#features" 
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            Features
          </a>
        </div>

        {/* Right action status - Dark/Light Theme Toggle & Hamburger */}
        <div className="header-actions">
          <button 
            onClick={onToggleTheme} 
            className="theme-toggle-btn"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="hamburger-btn"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>
    </nav>
  );
}
