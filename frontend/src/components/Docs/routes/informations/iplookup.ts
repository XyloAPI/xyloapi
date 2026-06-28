import type { DocTopic } from '../../types';

export const iplookupRoute: DocTopic = {
  id: 'iplookup',
  title: 'IP Lookup',
  category: 'IP Tools',
  method: 'GET',
  path: '/api/info/ip',
  pathTemplate: '/api/info/:slug',
  description: 'Cari geolokasi secara detail dan informasi jaringan untuk alamat IP atau domain yang ditentukan.',
  parameters: [
    { name: 'ip', type: 'text', required: false, desc: 'Alamat IP atau nama domain (contoh: 8.8.8.8 atau xyloapi.qzz.io).' }
  ],
  payloadTemplate: {
    ip: '8.8.8.8'
  }
};
