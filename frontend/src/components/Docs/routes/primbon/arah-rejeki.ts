import type { DocTopic } from '../../types';

export const arahRejekiRoute: DocTopic = {
  id: 'arah-rejeki',
  title: 'Arah Rejeki',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/arah-rejeki',
  pathTemplate: '/api/primbon/:slug',
  description: 'Menganalisis arah rejeki berdasarkan tanggal.',
  parameters: [
    { name: 'tgl', type: 'text', required: true, desc: 'Tanggal lahir Anda (1-31).' },
    { name: 'bln', type: 'text', required: true, desc: 'Bulan lahir Anda (1-12).' },
    { name: 'thn', type: 'text', required: true, desc: 'Tahun lahir Anda (4 digit).' }
  ],
  payloadTemplate: {
    tgl: '1',
    bln: '1',
    thn: '2020'
  }
};
