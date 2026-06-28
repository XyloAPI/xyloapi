import type { DocTopic } from '../../types';

export const artiNamaRoute: DocTopic = {
  id: 'arti-nama',
  title: 'Arti Nama',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/arti-nama',
  pathTemplate: '/api/primbon/:slug',
  description: 'Mencari makna dan karakter dibalik sebuah nama berdasarkan penafsiran primbon Jawa dan numerologi.',
  parameters: [
    { name: 'nama', type: 'text', required: true, desc: 'Nama yang ingin dicari artinya (misal: jarwo).' }
  ],
  payloadTemplate: {
    nama: 'jarwo'
  }
};
