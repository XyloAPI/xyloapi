import { Button } from './ui/button';

interface HeroProps {
  onViewChange: (view: 'landing' | 'monitor' | 'docs') => void;
}

export default function Hero({ onViewChange }: HeroProps) {
  return (
    <section className="relative bg-black min-h-screen md:min-h-0 pt-[160px] pb-[100px] md:pt-[180px] md:pb-[100px] flex flex-col items-center justify-center overflow-hidden">
      {/* Background radial glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[650px] h-[350px] md:h-[650px] rounded-full pointer-events-none z-0 opacity-40 select-none" 
        style={{
          background: 'radial-gradient(circle, rgba(255, 192, 0, 0.12) 0%, rgba(255, 192, 0, 0) 70%)',
          filter: 'blur(50px)'
        }}
      />
      <div className="relative z-10 max-w-[800px] mx-auto px-4 md:px-8 w-full flex flex-col items-center text-center">

        {/* Main Header */}
        <div className="max-w-[680px] sm:max-w-full w-full mb-6 flex flex-col items-center">
          <h1 className="font-brand text-[clamp(24px,5.5vw,32px)] md:text-[clamp(32px,4.8vw,52px)] leading-[1.2] font-black tracking-tight text-white mb-10 md:mb-6 uppercase">
            Ratusan <span className="bg-gradient-to-r from-gold-text via-gold to-yellow-500 bg-clip-text text-transparent">API Gratis</span><br className="hidden sm:block" /> Tanpa Batas Tanpa Limit
          </h1>
          <p className="font-display text-base md:text-[17.5px] leading-relaxed md:leading-[1.65] text-ash mb-[52px] md:mb-9">
            Akses data dari berbagai platform dengan mudah dan cepat. Dapatkan payload JSON terstruktur tanpa batas.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-4 justify-center flex-wrap w-full sm:w-auto">
            <Button 
              onClick={() => onViewChange('docs')} 
              variant="gold"
              className="h-12 px-8 text-[13.5px]"
            >
              Buka Dokumentasi
            </Button>
            <Button 
              onClick={() => onViewChange('monitor')} 
              variant="outline"
              className="h-12 px-8 text-[13.5px]"
            >
              Monitoring
            </Button>
          </div>
        </div>

      </div>

    </section>
  );
}
