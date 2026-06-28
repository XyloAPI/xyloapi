import type { DocTopic } from '../../types';

export const ramalanJodohBaliRoute: DocTopic = {
  id: 'ramalan-jodoh-bali',
  title: 'Ramalan Jodoh (Bali)',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/ramalan-jodoh-bali',
  pathTemplate: '/api/primbon/:slug',
  description: 'Menganalisis kecocokan perjodohan pasangan berdasarkan Wewaran penanggalan Bali (Saptawara, Pancawara, Sadwara, dan Pal Sri Sedana).',
  parameters: [
    { name: 'nama1', type: 'text', required: true, desc: 'Nama Anda.' },
    { name: 'tgl1', type: 'text', required: true, desc: 'Tanggal lahir Anda (1-31).' },
    { name: 'bln1', type: 'text', required: true, desc: 'Bulan lahir Anda (1-12).' },
    { name: 'thn1', type: 'text', required: true, desc: 'Tahun lahir Anda (4 digit).' },
    { name: 'nama2', type: 'text', required: true, desc: 'Nama pasangan Anda.' },
    { name: 'tgl2', type: 'text', required: true, desc: 'Tanggal lahir pasangan (1-31).' },
    { name: 'bln2', type: 'text', required: true, desc: 'Bulan lahir pasangan (1-12).' },
    { name: 'thn2', type: 'text', required: true, desc: 'Tahun lahir pasangan (4 digit).' }
  ],
  payloadTemplate: {
    nama1: 'adit',
    tgl1: '10',
    bln1: '1',
    thn1: '2000',
    nama2: 'putri',
    tgl2: '21',
    bln2: '10',
    thn2: '2001'
  }
};
