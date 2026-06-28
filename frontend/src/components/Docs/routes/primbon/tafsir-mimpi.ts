import type { DocTopic } from '../../types';

export const tafsirMimpiRoute: DocTopic = {
  id: 'tafsir-mimpi',
  title: 'Tafsir Mimpi',
  category: 'Primbon',
  method: 'GET', // Method is GET as requested by user's request details
  path: '/api/primbon/tafsir-mimpi',
  pathTemplate: '/api/primbon/:slug',
  description: 'Mencari arti atau tafsir dari mimpi Anda berdasarkan data primbon Jawa kuno.',
  parameters: [
    { name: 'mimpi', type: 'text', required: true, desc: 'Kata kunci mimpi (misal: dikejar anjing).' }
  ],
  payloadTemplate: {
    mimpi: 'dikejar anjing'
  }
};
