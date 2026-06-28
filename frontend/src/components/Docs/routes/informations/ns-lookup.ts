import type { DocTopic } from '../../types';

export const nslookupRoute: DocTopic = {
  id: 'ns-lookup',
  title: 'NS lookup',
  category: 'DNS Tools',
  method: 'GET',
  path: '/api/info/ns-lookup',
  pathTemplate: '/api/info/:slug',
  description: 'Kueri record DNS NS (Name Server) untuk suatu domain guna menentukan nameserver otoritatif dan TTL-nya.',
  parameters: [
    { name: 'host', type: 'text', required: true, desc: 'Nama domain yang akan di-kueri (contoh: google.com).' }
  ],
  payloadTemplate: {
    host: 'google.com'
  }
};
