import type { DocTopic } from '../../types';

export const namaPasanganRoute: DocTopic = {
  id: 'nama-pasangan',
  title: 'Nama Pasangan',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/nama-pasangan',
  pathTemplate: '/api/primbon/:slug',
  description: 'Menganalisis kecocokan jodoh antara Anda dan pasangan berdasarkan perhitungan numerologi nama untuk mengungkap sisi positif, sisi negatif, serta ramalan kecocokan hubungan.',
  parameters: [
    { name: 'nama1', type: 'text', required: true, desc: 'Nama Anda.' },
    { name: 'nama2', type: 'text', required: true, desc: 'Nama pasangan Anda.' }
  ],
  payloadTemplate: {
    nama1: 'upin',
    nama2: 'ipin'
  }
};
