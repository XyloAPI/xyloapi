import type { DocTopic } from '../../types';

export const ipblacklistRoute: DocTopic = {
  id: 'ip-blacklist',
  title: 'IP Blacklist Checker',
  category: 'IP Tools',
  method: 'GET',
  path: '/api/info/ip-blacklist',
  pathTemplate: '/api/info/:slug',
  description: 'Periksa apakah alamat IP atau domain masuk dalam daftar hitam di lebih dari 50 database DNSBL (Spamhaus, Sorbs, Barracuda, dll).',
  parameters: [
    { name: 'ip', type: 'text', required: true, desc: 'Alamat IP atau nama domain yang akan dicek (contoh: 1.1.1.1 atau google.com).' }
  ],
  payloadTemplate: {
    ip: 'google.com'
  }
};
