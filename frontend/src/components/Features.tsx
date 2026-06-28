import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function Features() {
  return (
    <section id="features" className="bg-black py-[60px] md:py-20 border-b border-border-color">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <Card className="hover:border-gold/30 hover:shadow-[0_0_15px_rgba(212,175,55,0.05)] transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-[10px] before:content-[''] before:inline-block before:w-2 before:h-2 before:bg-gold before:flex-shrink-0">
                100% Gratis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-ash text-[13.5px] leading-relaxed m-0">Tidak ada biaya tersembunyi. Gratis selamanya.</p>
            </CardContent>
          </Card>

          <Card className="hover:border-gold/30 hover:shadow-[0_0_15px_rgba(212,175,55,0.05)] transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-[10px] before:content-[''] before:inline-block before:w-2 before:h-2 before:bg-gold before:flex-shrink-0">
                Tanpa Login
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-ash text-[13.5px] leading-relaxed m-0">Tanpa registrasi, tanpa API key.</p>
            </CardContent>
          </Card>

          <Card className="hover:border-gold/30 hover:shadow-[0_0_15px_rgba(212,175,55,0.05)] transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-[10px] before:content-[''] before:inline-block before:w-2 before:h-2 before:bg-gold before:flex-shrink-0">
                Selalu Aktif
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-ash text-[13.5px] leading-relaxed m-0">Menggunakan server berkualitas tinggi.</p>
            </CardContent>
          </Card>

          <Card className="hover:border-gold/30 hover:shadow-[0_0_15px_rgba(212,175,55,0.05)] transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-[10px] before:content-[''] before:inline-block before:w-2 before:h-2 before:bg-gold before:flex-shrink-0">
                Data Bersih
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-ash text-[13.5px] leading-relaxed m-0">Hasil rapi dan siap pakai.</p>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  );
}
