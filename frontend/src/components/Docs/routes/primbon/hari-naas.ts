import type { DocTopic } from '../../types';

export const hariNaasRoute: DocTopic = {
  id: 'hari-naas',
  title: 'Hari Naas',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/hari-naas',
  pathTemplate: '/api/primbon/:slug',
  description: 'Menentukan hari naas berdasarkan tanggal lahir.',
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
