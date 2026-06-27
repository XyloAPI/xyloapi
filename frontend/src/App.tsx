import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Monitor from './components/Monitor';
import Docs from './components/Docs';
import Footer from './components/Footer';

// Dynamically adjust viewport scale on small mobile screens
function applyMobileViewportScale() {
  const vw = window.innerWidth;
  let scale = 1.0;
  if (vw <= 480) scale = 0.85;
  else if (vw <= 768) scale = 0.92;

  const meta = document.querySelector('meta[name="viewport"]');
  if (meta) {
    meta.setAttribute('content', `width=device-width, initial-scale=${scale}, maximum-scale=${scale}, minimum-scale=${scale}`);
  }
}

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'monitor' | 'docs'>(() => {
    const hash = window.location.hash;
    if (hash === '#monitor') return 'monitor';
    if (hash === '#docs') return 'docs';
    return 'landing';
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('xyloapi-theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    applyMobileViewportScale();
    window.addEventListener('resize', applyMobileViewportScale);
    return () => window.removeEventListener('resize', applyMobileViewportScale);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#monitor') {
        setCurrentView('monitor');
      } else if (hash === '#docs') {
        setCurrentView('docs');
      } else {
        setCurrentView('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
    localStorage.setItem('xyloapi-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--black)' }}>
      <Navbar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <main style={{ flex: 1 }}>
        {currentView === 'monitor' ? (
          <Monitor />
        ) : currentView === 'docs' ? (
          <Docs />
        ) : (
          <>
            <Hero onViewChange={setCurrentView} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;

