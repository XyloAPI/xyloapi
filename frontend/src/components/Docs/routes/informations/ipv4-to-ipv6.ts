import type { DocTopic } from '../../types';

export const ipv4ToIpv6Route: DocTopic = {
  id: 'ipv4-to-ipv6',
  title: 'IPv4 to IPv6 Converter',
  category: 'IP Tools',
  method: 'GET',
  path: '/api/info/ipv4-to-ipv6',
  pathTemplate: '/api/info/:slug',
  description: 'Konversi alamat IPv4 ke bentuk kompatibilitas IPv6, bentuk yang diekspansi, dan bentuk singkatnya.',
  parameters: [
    { name: 'ip', type: 'text', required: true, desc: 'Alamat IPv4 untuk dikonversi (contoh: 192.168.1.1).' }
  ],
  payloadTemplate: {
    ip: '192.168.1.1'
  }
};
