import type { DocTopic } from '../../types';

export const ramalanPitagorasRoute: DocTopic = {
  id: 'ramalan-pitagoras',
  title: 'Ramalan Pitagoras',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/ramalan-pitagoras',
  pathTemplate: '/api/primbon/:slug',
  description: 'Menganalisis nasib, karakter, elemen, rekomendasi karir, dan kombinasi numerologi kehidupan Anda menggunakan metode matematika kuno Pitagoras.',
  parameters: [
    { name: 'tgl', type: 'text', required: true, desc: 'Tanggal lahir Anda (1-31).' },
    { name: 'bln', type: 'text', required: true, desc: 'Bulan lahir Anda (1-12).' },
    { name: 'thn', type: 'text', required: true, desc: 'Tahun lahir Anda (4 digit).' }
  ],
  payloadTemplate: {
    tgl: '1',
    bln: '1',
    thn: '2000'
  }
};
