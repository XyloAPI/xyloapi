import type { DocTopic } from '../../types';

export const hariLaranganRoute: DocTopic = {
  id: 'hari-larangan',
  title: 'Hari Larangan',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/hari-larangan',
  pathTemplate: '/api/primbon/:slug',
  description: 'Menentukan hari larangan berdasarkan tanggal.',
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
