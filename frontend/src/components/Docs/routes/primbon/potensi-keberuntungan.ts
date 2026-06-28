import type { DocTopic } from '../../types';

export const potensiKeberuntunganRoute: DocTopic = {
  id: 'potensi-keberuntungan',
  title: 'Potensi Keberuntungan',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/potensi-keberuntungan',
  pathTemplate: '/api/primbon/:slug',
  description: 'Menganalisis potensi keberuntungan seseorang berdasarkan tanggal lahir.',
  parameters: [
    { name: 'nama', type: 'text', required: true, desc: 'Nama Anda.' },
    { name: 'tanggal', type: 'text', required: true, desc: 'Tanggal lahir Anda (1-31).' },
    { name: 'bulan', type: 'text', required: true, desc: 'Bulan lahir Anda (1-12).' },
    { name: 'tahun', type: 'text', required: true, desc: 'Tahun lahir Anda (4 digit).' }
  ],
  payloadTemplate: {
    nama: 'Jarwo',
    tanggal: '4',
    bulan: '1',
    tahun: '2000'
  }
};
