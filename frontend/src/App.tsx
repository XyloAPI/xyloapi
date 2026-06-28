import { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

const Monitor = lazy(() => import('./components/Monitor'));
const Docs = lazy(() => import('./components/Docs'));
import TadpoleIcon from '@iconify-react/svg-spinners/tadpole';

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect legacy hash-based URLs and clean up redundant hashes
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      let cleanPath = '';
      let searchPart = '';
      
      const qIndex = hash.indexOf('?');
      if (qIndex !== -1) {
        searchPart = hash.substring(qIndex);
      }
      
      const routePart = qIndex !== -1 ? hash.substring(0, qIndex) : hash;
      const normalizedRoute = routePart.replace('#', '').replace(/^\//, '');
      
      if (normalizedRoute === 'monitor') {
        cleanPath = '/monitor';
      } else if (normalizedRoute === 'docs') {
        cleanPath = '/docs';
      } else if (normalizedRoute === 'landing' || normalizedRoute === '') {
        cleanPath = '/';
      } else if (normalizedRoute === 'features') {
        cleanPath = '/';
        setTimeout(() => {
          const el = document.getElementById('features');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
      
      if (cleanPath) {
        window.history.replaceState(null, '', `${cleanPath}${searchPart}`);
        navigate(`${cleanPath}${searchPart}`, { replace: true });
      } else {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  }, [navigate]);

  // Dynamic Title & Meta Description SEO updates
  useEffect(() => {
    let title = 'XyloAPI - Platform API Scraping & Developer Tools Terlengkap';
    let description = 'Akses ratusan API gratis, scraper web, downloader, dan alat bantu developer berkecepatan tinggi dengan respons JSON terstruktur.';

    if (location.pathname === '/monitor') {
      title = 'Monitor Sistem & Status Latensi API | XyloAPI';
      description = 'Pemantauan real-time status server XyloAPI, latensi endpoint, rasio sukses, dan log performa sistem secara instan.';
    } else if (location.pathname.startsWith('/docs')) {
      title = 'Dokumentasi API Interaktif & Sandbox Developer | XyloAPI';
      description = 'Jelajahi dan uji coba ratusan API scraper, downloader, dan banyak lagi secara interaktif dengan preview JSON instan.';
    }

    document.title = title;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
  }, [location.pathname]);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('xyloapi-theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
    localStorage.setItem('xyloapi-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    if (!document.startViewTransition) {
      setTheme(prev => prev === 'dark' ? 'light' : 'dark');
      return;
    }
    document.startViewTransition(() => {
      setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    });
  };

  const currentView = location.pathname === '/monitor'
    ? 'monitor'
    : location.pathname.startsWith('/docs')
      ? 'docs'
      : 'landing';

  const setView = (view: 'landing' | 'monitor' | 'docs') => {
    if (view === 'monitor') {
      navigate('/monitor');
    } else if (view === 'docs') {
      navigate('/docs');
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--black)' }}>
      <Toaster 
        theme={theme} 
        position="bottom-right" 
        toastOptions={{
          className: 'sonner-toast-custom'
        }}
      />
      <Navbar 
        currentView={currentView} 
        onViewChange={setView} 
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <main style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={currentView}>
            <Route path="/" element={
              <motion.div
                key="landing"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <Hero onViewChange={setView} />
                <Features />
              </motion.div>
            } />
            <Route path="/monitor" element={
              <motion.div
                key="monitor"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <Suspense fallback={
                  <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-4">
                    <TadpoleIcon className="text-gold" width="32" height="32" />
                    <div className="font-mono text-xs text-ash tracking-[0.2em] uppercase">Loading Monitor...</div>
                  </div>
                }>
                  <Monitor />
                </Suspense>
              </motion.div>
            } />
            <Route path="/docs" element={
              <motion.div
                key="docs"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <Suspense fallback={
                  <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-4">
                    <TadpoleIcon className="text-gold" width="32" height="32" />
                    <div className="font-mono text-xs text-ash tracking-[0.2em] uppercase">Loading Documentation...</div>
                  </div>
                }>
                  <Docs />
                </Suspense>
              </motion.div>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

