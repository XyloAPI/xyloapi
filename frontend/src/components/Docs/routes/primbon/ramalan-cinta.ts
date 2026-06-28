import type { DocTopic } from '../../types';

export const ramalanCintaRoute: DocTopic = {
  id: 'ramalan-cinta',
  title: 'Ramalan Cinta',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/ramalan-cinta',
  pathTemplate: '/api/primbon/:slug',
  description: 'Menganalisis ramalan kecocokan percintaan pasangan berdasarkan numerologi tanggal lahir untuk mengungkap sisi positif, sisi negatif, serta dinamika hubungan.',
  parameters: [
    { name: 'nama1', type: 'text', required: true, desc: 'Nama Anda.' },
    { name: 'tanggal1', type: 'text', required: true, desc: 'Tanggal lahir Anda (1-31).' },
    { name: 'bulan1', type: 'text', required: true, desc: 'Bulan lahir Anda (1-12).' },
    { name: 'tahun1', type: 'text', required: true, desc: 'Tahun lahir Anda (4 digit).' },
    { name: 'nama2', type: 'text', required: true, desc: 'Nama pasangan Anda.' },
    { name: 'tanggal2', type: 'text', required: true, desc: 'Tanggal lahir pasangan (1-31).' },
    { name: 'bulan2', type: 'text', required: true, desc: 'Bulan lahir pasangan (1-12).' },
    { name: 'tahun2', type: 'text', required: true, desc: 'Tahun lahir pasangan (4 digit).' }
  ],
  payloadTemplate: {
    nama1: 'adit',
    tanggal1: '10',
    bulan1: '1',
    tahun1: '2000',
    nama2: 'putri',
    tanggal2: '11',
    bulan2: '8',
    tahun2: '2001'
  }
};
