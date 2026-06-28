import type { DocTopic } from '../../types';

export const mxlookupRoute: DocTopic = {
  id: 'mx-lookup',
  title: 'MX Lookup',
  category: 'DNS Tools',
  method: 'GET',
  path: '/api/info/mx-lookup',
  pathTemplate: '/api/info/:slug',
  description: 'Kueri record DNS MX (Mail Exchange) untuk suatu domain guna mengidentifikasi konfigurasi server email, prioritas, dan TTL-nya.',
  parameters: [
    { name: 'host', type: 'text', required: true, desc: 'Nama domain yang akan di-kueri (contoh: google.com).' }
  ],
  payloadTemplate: {
    host: 'google.com'
  }
};
