import type { DocTopic } from '../../types';

export const sifatKarakterRoute: DocTopic = {
  id: 'sifat-karakter',
  title: 'Sifat Karakter',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/sifat-karakter',
  pathTemplate: '/api/primbon/:slug',
  description: 'Membaca sifat dan karakter berdasarkan tanggal lahir.',
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
