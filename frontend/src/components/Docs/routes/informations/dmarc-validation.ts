import type { DocTopic } from '../../types';

export const dmarcvalidationRoute: DocTopic = {
  id: 'dmarc-validation',
  title: 'DMARC Validation',
  category: 'DNS Tools',
  method: 'GET',
  path: '/api/info/dmarc-validation',
  pathTemplate: '/api/info/:slug',
  description: 'Validasi kebijakan autentikasi email DMARC dan konfigurasi record keamanan untuk suatu domain.',
  parameters: [
    { name: 'host', type: 'text', required: true, desc: 'Nama domain untuk memvalidasi kebijakan DMARC (contoh: google.com).' }
  ],
  payloadTemplate: {
    host: 'google.com'
  }
};
