import './Features.css';

export default function Features() {
  return (
    <section id="features" className="features-section">
      <div className="container">
        <div className="features-grid">

          <div className="feature-card">
            <span className="feature-card-title">100% Gratis</span>
            <p className="feature-card-desc">Tidak ada biaya tersembunyi. Gratis selamanya.</p>
          </div>

          <div className="feature-card">
            <span className="feature-card-title">Tanpa Login</span>
            <p className="feature-card-desc">Tanpa registrasi, tanpa API key.</p>
          </div>

          <div className="feature-card">
            <span className="feature-card-title">Selalu Aktif</span>
            <p className="feature-card-desc">Menggunakan server berkualitas tinggi.</p>
          </div>

          <div className="feature-card">
            <span className="feature-card-title">Data Bersih</span>
            <p className="feature-card-desc">Hasil rapi dan siap pakai.</p>
          </div>

        </div>
      </div>
    </section>
  );
}
