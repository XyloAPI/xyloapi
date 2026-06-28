import type { DocTopic } from '../../types';

export const memancingIkanRoute: DocTopic = {
  id: 'memancing-ikan',
  title: 'Memancing Ikan',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/memancing-ikan',
  pathTemplate: '/api/primbon/:slug',
  description: 'Menganalisis ramalan hari memancing ikan berdasarkan weton.',
  parameters: [
    { name: 'tgl', type: 'text', required: true, desc: 'Tanggal memancing (1-31).' },
    { name: 'bln', type: 'text', required: true, desc: 'Bulan memancing (1-12).' },
    { name: 'thn', type: 'text', required: true, desc: 'Tahun memancing (4 digit).' }
  ],
  payloadTemplate: {
    tgl: '1',
    bln: '1',
    thn: '2020'
  }
};
