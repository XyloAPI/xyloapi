import './EndpointsPreview.css';
import { docTopics } from './Docs/topicsData';

export default function EndpointsPreview() {
  return (
    <section id="endpoints" className="endpoints-section">
      <div className="container">
        <div className="endpoints-intro">
          <span className="endpoints-pretitle">DIREKTORI ENDPOINT</span>
          <h2 className="endpoints-title">DAFTAR ENDPOINT AKTIF</h2>
          <p className="endpoints-desc">
            XyloAPI memiliki lebih dari {docTopics.length} endpoint yang bisa langsung dicoba. Buka dokumentasi untuk melihat contoh request dan respons JSON dari setiap endpoint.
          </p>
        </div>
      </div>
    </section>
  );
}
