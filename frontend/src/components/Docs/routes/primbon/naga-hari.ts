import type { DocTopic } from '../../types';

export const nagaHariRoute: DocTopic = {
  id: 'naga-hari',
  title: 'Naga Hari',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/naga-hari',
  pathTemplate: '/api/primbon/:slug',
  description: 'Menganalisis letak kedudukan naga hari dan arah mata angin yang baik.',
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
