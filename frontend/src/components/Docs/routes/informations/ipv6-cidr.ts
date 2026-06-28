import type { DocTopic } from '../../types';

export const ipv6CidrRoute: DocTopic = {
  id: 'ipv6-cidr',
  title: 'IPv6 CIDR to Range Converter',
  category: 'IP Tools',
  method: 'GET',
  path: '/api/info/ipv6-cidr-to-range',
  pathTemplate: '/api/info/:slug',
  description: 'Konversi blok CIDR IPv6 menjadi rentang alamat IP awal dan akhir, beserta statistik jaringan.',
  parameters: [
    { name: 'cidr', type: 'text', required: true, desc: 'Blok CIDR IPv6 (contoh: 2001:4860:4860::8888/32).' }
  ],
  payloadTemplate: {
    cidr: '2001:4860:4860::8888/32'
  }
};
