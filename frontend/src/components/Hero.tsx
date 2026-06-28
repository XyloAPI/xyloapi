import { Button } from './ui/button';

interface HeroProps {
  onViewChange: (view: 'landing' | 'monitor' | 'docs') => void;
}

export default function Hero({ onViewChange }: HeroProps) {
  return (
    <section className="relative bg-black min-h-screen md:min-h-0 pt-[160px] pb-[100px] md:pt-[180px] md:pb-[100px] flex flex-col items-center justify-center">
      <div className="max-w-[800px] mx-auto px-4 md:px-8 w-full flex flex-col items-center text-center">

        {/* Main Header */}
        <div className="max-w-[680px] sm:max-w-full w-full mb-6 flex flex-col items-center">
          <h1 className="font-display text-[clamp(26px,8vw,36px)] md:text-[clamp(34px,5.5vw,64px)] leading-[1.05] font-extrabold tracking-tight text-white mb-10 md:mb-6">
            RATUSAN API GRATIS TANPA BATAS TANPA LIMIT
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
