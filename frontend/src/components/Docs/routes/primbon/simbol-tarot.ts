import type { DocTopic } from '../../types';

export const simbolTarotRoute: DocTopic = {
  id: 'simbol-tarot',
  title: 'Simbol Tarot',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/simbol-tarot',
  pathTemplate: '/api/primbon/:slug',
  description: 'Menganalisis simbol kartu tarot berdasarkan tanggal lahir.',
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
