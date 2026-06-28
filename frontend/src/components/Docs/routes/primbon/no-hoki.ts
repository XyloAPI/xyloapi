import type { DocTopic } from '../../types';

export const noHokiRoute: DocTopic = {
  id: 'no-hoki',
  title: 'Nomor HP Hoki',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/no-hoki',
  pathTemplate: '/api/primbon/:slug',
  description: 'Mengecek potensi keberuntungan (hoki) nomor handphone Anda berdasarkan metode kombinasi angka Bagua Shuzi (feng shui & numerologi).',
  parameters: [
    { name: 'nomer', type: 'text', required: true, desc: 'Nomor HP Anda (misal: 08975800981).' }
  ],
  payloadTemplate: {
    nomer: '081234567890'
  }
};
