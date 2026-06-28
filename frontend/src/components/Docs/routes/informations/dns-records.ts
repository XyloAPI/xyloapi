import type { DocTopic } from '../../types';

export const dnsrecordsRoute: DocTopic = {
  id: 'dns-records',
  title: 'DNS Records',
  category: 'DNS Tools',
  method: 'GET',
  path: '/api/info/dns-records',
  pathTemplate: '/api/info/:slug',
  description: 'Cari semua record DNS (A, AAAA, MX, NS, TXT, SOA, CAA, CNAME) untuk domain tertentu.',
  parameters: [
    { name: 'host', type: 'text', required: true, desc: 'Nama domain untuk mencari record DNS (contoh: google.com).' },
    {
      name: 'type',
      type: 'select',
      required: false,
      desc: 'Nama domain untuk mencari record DNS (contoh: google.com).',
      options: ['COMMON', 'A', 'AAAA', 'MX', 'NS', 'TXT', 'SOA', 'CAA', 'CNAME']
    }
  ],
  payloadTemplate: {
    host: 'google.com',
    type: 'COMMON'
  }
};
