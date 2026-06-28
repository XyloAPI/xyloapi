import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

interface NavbarProps {
  currentView: 'landing' | 'monitor' | 'docs';
  onViewChange: (view: 'landing' | 'monitor' | 'docs') => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export default function Navbar({ currentView, onViewChange, theme, onToggleTheme }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full h-20 bg-header-bg backdrop-blur-md border-b border-border-color z-50">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex items-center justify-between h-full">
        
        {/* Brand identity */}
        <Link 
          to="/" 
          className="flex items-center gap-2 no-underline text-white"
          onClick={() => setMenuOpen(false)}
        >
          <Icon icon="lucide:terminal" width="20" height="20" className="text-gold" />
          <span className="font-display text-xl font-black tracking-[0.2em] uppercase">XYLO<span className="text-gold">API</span></span>
        </Link>

        {/* Center menu links (Desktop & Mobile Drawer) */}
        <div className={`md:flex items-center gap-10 ${menuOpen ? 'flex flex-col absolute top-20 left-0 w-full bg-dark-iron border-b border-border-color p-6 gap-5 z-40' : 'hidden md:flex'}`}>
          <Link 
            to="/" 
            className={`no-underline font-display text-[13.5px] font-medium uppercase tracking-[0.1em] transition-colors duration-150 ${currentView === 'landing' ? 'text-gold' : 'text-ash hover:text-white'}`}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/monitor" 
            className={`no-underline font-display text-[13.5px] font-medium uppercase tracking-[0.1em] transition-colors duration-150 ${currentView === 'monitor' ? 'text-gold' : 'text-ash hover:text-white'}`}
            onClick={() => setMenuOpen(false)}
          >
            Monitor
          </Link>
          <Link 
            to="/docs" 
            className={`no-underline font-display text-[13.5px] font-medium uppercase tracking-[0.1em] transition-colors duration-150 ${currentView === 'docs' ? 'text-gold' : 'text-ash hover:text-white'}`}
            onClick={() => setMenuOpen(false)}
          >
            Docs
          </Link>
          <a 
            href="/" 
            className="no-underline font-display text-[13.5px] font-medium uppercase tracking-[0.1em] transition-colors duration-150 text-ash hover:text-white"
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              if (currentView !== 'landing') {
                onViewChange('landing');
                setTimeout(() => {
                  const el = document.getElementById('features');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              } else {
                const el = document.getElementById('features');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Features
          </a>
        </div>

        {/* Right action status - Dark/Light Theme Toggle & Hamburger */}
        <div className="flex items-center gap-3">
          <Button 
            onClick={onToggleTheme} 
            variant="outline"
            size="icon"
            className="w-10 h-10"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Icon icon="lucide:sun" width="16" height="16" /> : <Icon icon="lucide:moon" width="16" height="16" />}
          </Button>

          <Button 
            onClick={() => setMenuOpen(!menuOpen)} 
            variant="outline"
            size="icon"
            className="md:hidden w-10 h-10"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <Icon icon="lucide:x" width="20" height="20" /> : <Icon icon="lucide:menu" width="20" height="20" />}
          </Button>
        </div>

      </div>
    </nav>
  );
}
