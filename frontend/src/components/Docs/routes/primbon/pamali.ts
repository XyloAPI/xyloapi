import type { DocTopic } from '../../types';

export const pamaliRoute: DocTopic = {
  id: 'pamali',
  title: 'Pamali / Pantangan',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/pamali',
  pathTemplate: '/api/primbon/:slug',
  description: 'Mendapatkan penjelasan pamali atau pantangan Jawa yang tidak boleh dilakukan beserta akibatnya.',
  parameters: [
    {
      name: 'keyword',
      type: 'text',
      required: false,
      desc: 'Kata kunci pantangan yang ingin dicari (contoh: makan, tidur, bersiul).'
    },
    {
      name: 'nomor',
      type: 'text',
      required: false,
      desc: 'Nomor urut pantangan (1–68). Salah satu dari keyword atau nomor harus diisi.'
    }
  ],
  payloadTemplate: {
    keyword: 'makan'
  }
};
