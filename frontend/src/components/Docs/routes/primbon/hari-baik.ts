import type { DocTopic } from '../../types';

export const hariBaikRoute: DocTopic = {
  id: 'hari-baik',
  title: 'Hari Baik (Kamarokam)',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/hari-baik',
  pathTemplate: '/api/primbon/:slug',
  description: 'Menentukan watak hari baik atau buruk berdasarkan penanggalan Kamarokam.',
  parameters: [
    { name: 'tgl', type: 'text', required: true, desc: 'Tanggal lahir Anda (1-31).' },
    { name: 'bln', type: 'text', required: true, desc: 'Bulan lahir Anda (1-12).' },
    { name: 'thn', type: 'text', required: true, desc: 'Tahun lahir Anda (4 digit).' }
  ],
  payloadTemplate: {
    tgl: '1',
    bln: '1',
    thn: '1999'
  }
};
