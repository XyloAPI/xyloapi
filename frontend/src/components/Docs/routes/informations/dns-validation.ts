import type { DocTopic } from '../../types';

export const dnsvalidationRoute: DocTopic = {
  id: 'dns-validation',
  title: 'DNS Health Checker',
  category: 'DNS Tools',
  method: 'GET',
  path: '/api/info/dns-validation',
  pathTemplate: '/api/info/:slug',
  description: 'Validasi record DNS, uji server nama (nameserver), kueri rekursif terbuka, dan pengaturan SOA untuk suatu domain.',
  parameters: [
    { name: 'host', type: 'text', required: true, desc: 'Nama domain untuk divalidasi (contoh: google.com).' }
  ],
  payloadTemplate: {
    host: 'google.com'
  }
};
