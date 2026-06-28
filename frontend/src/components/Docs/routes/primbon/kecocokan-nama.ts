import type { DocTopic } from '../../types';

export const kecocokanNamaRoute: DocTopic = {
  id: 'kecocokan-nama',
  title: 'Kecocokan Nama',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/kecocokan-nama',
  pathTemplate: '/api/primbon/:slug',
  description: 'Menganalisis persentase kecocokan nama Anda dengan tanggal lahir berdasarkan perhitungan numerologi.',
  parameters: [
    { name: 'nama', type: 'text', required: true, desc: 'Nama lengkap Anda.' },
    { name: 'tgl', type: 'text', required: true, desc: 'Tanggal lahir Anda (1-31).' },
    { name: 'bln', type: 'text', required: true, desc: 'Bulan lahir Anda (1-12).' },
    { name: 'thn', type: 'text', required: true, desc: 'Tahun lahir Anda (4 digit).' }
  ],
  payloadTemplate: {
    nama: 'agus',
    tgl: '1',
    bln: '1',
    thn: '1999'
  }
};
