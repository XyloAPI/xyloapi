import { Icon } from '@iconify/react';

export default function Footer() {
  return (
    <footer className="bg-dark-iron border-t border-border-color py-12 md:pt-20 md:pb-10 text-ash text-[14.5px]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        
        {/* Brand */}
        <div className="max-w-[400px] md:max-w-full mx-auto flex flex-col gap-4 items-center text-center">
          <a href="/" className="flex items-center gap-2 text-white no-underline justify-center">
            <Icon icon="tabler:alien" width="20" height="20" className="text-gold" />
            <span className="font-brand text-lg font-black tracking-[0.05em] uppercase">XYLO<span className="text-gold">API</span></span>
          </a>
          <p className="text-[13.5px] leading-relaxed">
            Platform scraping web yang dirancang untuk developer. Cepat, andal, dan siap menangani kebutuhan mulai dari proyek kecil hingga skala besar.
          </p>
        </div>

        {/* Lower footer */}
        <div className="border-t border-border-color mt-10 pt-[30px] flex flex-col md:flex-row justify-center items-center flex-wrap gap-3 md:gap-5">
          <span className="text-[11px] font-mono uppercase tracking-[0.05em]">
            &copy; {new Date().getFullYear()} XYLOAPI. ALL RIGHTS RESERVED.
          </span>
        </div>

      </div>
    </footer>
  );
}
