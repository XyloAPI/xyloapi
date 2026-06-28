import type { DocTopic } from '../../types';

export const ipToDecimalRoute: DocTopic = {
  id: 'ip-to-decimal',
  title: 'IP to Decimal Converter',
  category: 'IP Tools',
  method: 'GET',
  path: '/api/info/ip-to-decimal',
  pathTemplate: '/api/info/:slug',
  description: 'Konversi alamat IP ke representasi desimalnya, beserta format ekspansi dan kompatibilitas IPv6.',
  parameters: [
    { name: 'ip', type: 'text', required: true, desc: 'Alamat IP untuk dikonversi (contoh: 8.8.8.8).' }
  ],
  payloadTemplate: {
    ip: '8.8.8.8'
  }
};
