import type { DocTopic } from '../../types';

export const ramalanPeruntunganRoute: DocTopic = {
  id: 'ramalan-peruntungan',
  title: 'Ramalan Peruntungan',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/ramalan-peruntungan',
  pathTemplate: '/api/primbon/:slug',
  description: 'Meramal nasib peruntungan berdasarkan tanggal lahir dan tahun target.',
  parameters: [
    { name: 'nama1', type: 'text', required: true, desc: 'Nama Anda.' },
    { name: 'tgl1', type: 'text', required: true, desc: 'Tanggal lahir Anda (1-31).' },
    { name: 'bln1', type: 'text', required: true, desc: 'Bulan lahir Anda (1-12).' },
    { name: 'thn1', type: 'text', required: true, desc: 'Tahun lahir Anda (4 digit).' },
    { name: 'thn2', type: 'text', required: true, desc: 'Tahun target ramalan peruntungan (4 digit).' }
  ],
  payloadTemplate: {
    nama1: 'Jarwo',
    tgl1: '10',
    bln1: '1',
    thn1: '2000',
    thn2: '2020'
  }
};
