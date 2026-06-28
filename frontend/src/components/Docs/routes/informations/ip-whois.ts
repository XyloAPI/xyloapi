import type { DocTopic } from '../../types';

export const ipWhoisRoute: DocTopic = {
  id: 'ip-whois',
  title: 'IP Whois Lookup',
  category: 'IP Tools',
  method: 'GET',
  path: '/api/info/ip-whois',
  pathTemplate: '/api/info/:slug',
  description: 'Cari record registri secara detail dan kredensial kepemilikan untuk alamat IPv4 atau IPv6 apa pun.',
  parameters: [
    { name: 'ip', type: 'text', required: true, desc: 'Alamat IP yang akan dicari (contoh: 8.8.8.8).' }
  ],
  payloadTemplate: {
    ip: '8.8.8.8'
  }
};
