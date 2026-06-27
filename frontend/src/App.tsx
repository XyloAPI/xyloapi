import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Monitor from './components/Monitor';
import Docs from './components/Docs';
import Footer from './components/Footer';

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

