import type { DocTopic } from '../../types';

export const ramalanJodohRoute: DocTopic = {
  id: 'ramalan-jodoh',
  title: 'Ramalan Jodoh',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/ramalan-jodoh',
  pathTemplate: '/api/primbon/:slug',
  description: 'Menganalisis kecocokan dan potensi masa depan pernikahan pasangan berdasarkan weton penanggalan Jawa kuno (kitab Betaljemur Adammakna).',
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
    bln2: '8',
    thn2: '2001'
  }
};
