import type { DocTopic } from '../../types';

export const sifatUsahaRoute: DocTopic = {
  id: 'sifat-usaha',
  title: 'Sifat Usaha',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/sifat-usaha',
  pathTemplate: '/api/primbon/:slug',
  description: 'Menganalisis sifat usaha atau karakter bisnis yang cocok untuk Anda jalankan berdasarkan weton Jawa dan hari kelahiran Anda.',
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
