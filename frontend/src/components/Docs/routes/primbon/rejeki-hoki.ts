import type { DocTopic } from '../../types';

export const rejekiHokiRoute: DocTopic = {
  id: 'rejeki-hoki',
  title: 'Rejeki Hoki',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/rejeki-hoki',
  pathTemplate: '/api/primbon/:slug',
  description: 'Menganalisis ramalan siklus rejeki atau keberuntungan (hoki) Anda dan fluktuasinya berdasarkan weton Jawa menurut kitab Primbon Pal Srigati.',
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
