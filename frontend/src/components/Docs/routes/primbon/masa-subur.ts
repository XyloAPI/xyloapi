import type { DocTopic } from '../../types';

export const masaSuburRoute: DocTopic = {
  id: 'masa-subur',
  title: 'Masa Subur',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/masa-subur',
  pathTemplate: '/api/primbon/:slug',
  description: 'Kalkulator untuk memperkirakan masa subur dan hari ovulasi wanita.',
  parameters: [
    { name: 'dateday', type: 'text', required: true, desc: 'Tanggal hari pertama menstruasi terakhir (1-31).' },
    { name: 'datemonth', type: 'text', required: true, desc: 'Bulan menstruasi terakhir (1-12).' },
    { name: 'dateyear', type: 'text', required: true, desc: 'Tahun menstruasi terakhir (4 digit).' },
    { name: 'days', type: 'text', required: false, desc: 'Lama siklus menstruasi rata-rata (default 28).' }
  ],
  payloadTemplate: {
    dateday: '1',
    datemonth: '6',
    dateyear: '2025',
    days: '28'
  }
};
