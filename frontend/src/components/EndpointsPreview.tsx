import { docTopics } from './Docs/topicsData';

export default function EndpointsPreview() {
  return (
    <section id="endpoints" className="bg-black py-[60px] md:py-[120px] border-b border-border-color overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="max-w-[800px] mb-[60px]">
          <span className="font-mono text-xs text-gold tracking-[0.2em] uppercase block mb-4">DIREKTORI ENDPOINT</span>
          <h2 className="font-display text-[clamp(32px,5vw,48px)] font-bold text-white leading-[1.15]">DAFTAR ENDPOINT AKTIF</h2>
          <p className="text-ash text-[16.5px] mt-4 leading-relaxed">
            XyloAPI memiliki lebih dari {docTopics.length} endpoint yang bisa langsung dicoba. Buka dokumentasi untuk melihat contoh request dan respons JSON dari setiap endpoint.
          </p>
        </div>
      </div>
    </section>
  );
}
