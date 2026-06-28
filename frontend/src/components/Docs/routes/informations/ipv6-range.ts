import type { DocTopic } from '../../types';

export const ipv6RangeRoute: DocTopic = {
  id: 'ipv6-range',
  title: 'IPv6 Range to CIDR Converter',
  category: 'IP Tools',
  method: 'GET',
  path: '/api/info/ipv6-range-to-cidr',
  pathTemplate: '/api/info/:slug',
  description: 'Konversi rentang alamat IPv6 dari awal-akhir menjadi blok jaringan CIDR yang setara.',
  parameters: [
    { name: 'range', type: 'text', required: true, desc: 'Rentang alamat IPv6 (contoh: 2620:0:2d0:200::7-2620:0:2d0:2df::7).' }
  ],
  payloadTemplate: {
    range: '2620:0:2d0:200::7-2620:0:2d0:2df::7'
  }
};
