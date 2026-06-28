import './Hero.css';

interface HeroProps {
  onViewChange: (view: 'landing' | 'monitor' | 'docs') => void;
}

export default function Hero({ onViewChange }: HeroProps) {
  return (
    <section className="hero-section">
      <div className="container hero-container">

        {/* Main Header */}
        <div className="hero-text-block">
          <h1 className="hero-main-title">
            RATUSAN API GRATIS TANPA BATAS TANPA LIMIT
          </h1>
          <p className="hero-sub-title">
            Akses data dari berbagai platform dengan mudah dan cepat. Dapatkan payload JSON terstruktur tanpa batas.
          </p>
          <div className="hero-cta-buttons">
            <button onClick={() => onViewChange('docs')} className="btn btn-gold">
              Buka Dokumentasi
            </button>
            <button onClick={() => onViewChange('monitor')} className="btn btn-ghost">
              Monitoring
            </button>
          </div>
        </div>

      </div>

    </section>
  );
}
