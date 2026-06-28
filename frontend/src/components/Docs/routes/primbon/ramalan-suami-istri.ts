import type { DocTopic } from '../../types';

export const ramalanSuamiIstriRoute: DocTopic = {
  id: 'ramalan-suami-istri',
  title: 'Ramalan Suami Istri',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/ramalan-suami-istri',
  pathTemplate: '/api/primbon/:slug',
  description: 'Menganalisis ramalan perjalanan kehidupan pasangan suami-istri berdasarkan kecocokan weton penanggalan Jawa kuno sepanjang rentang usia pernikahan.',
  parameters: [
    { name: 'nama1', type: 'text', required: true, desc: 'Nama Suami.' },
    { name: 'tgl1', type: 'text', required: true, desc: 'Tanggal lahir Suami (1-31).' },
    { name: 'bln1', type: 'text', required: true, desc: 'Bulan lahir Suami (1-12).' },
    { name: 'thn1', type: 'text', required: true, desc: 'Tahun lahir Suami (4 digit).' },
    { name: 'nama2', type: 'text', required: true, desc: 'Nama Istri.' },
    { name: 'tgl2', type: 'text', required: true, desc: 'Tanggal lahir Istri (1-31).' },
    { name: 'bln2', type: 'text', required: true, desc: 'Bulan lahir Istri (1-12).' },
    { name: 'thn2', type: 'text', required: true, desc: 'Tahun lahir Istri (4 digit).' }
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
