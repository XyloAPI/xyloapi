import type { DocTopic } from '../../types';

export const ipv6CompatibilityRoute: DocTopic = {
  id: 'ipv6-compatibility',
  title: 'IPv6 Compatibility Checker',
  category: 'IP Tools',
  method: 'GET',
  path: '/api/info/ipv6-compatibility',
  pathTemplate: '/api/info/:slug',
  description: 'Validasi apakah suatu domain memiliki record IPv6 yang dikonfigurasi untuk web server dan nameserver-nya.',
  parameters: [
    { name: 'host', type: 'text', required: true, desc: 'Nama domain untuk dicek (contoh: google.com).' }
  ],
  payloadTemplate: {
    host: 'google.com'
  }
};
