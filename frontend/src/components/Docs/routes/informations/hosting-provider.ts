import type { DocTopic } from '../../types';

export const hostingProviderRoute: DocTopic = {
  id: 'hosting-provider',
  title: 'Website Hosting Provider Check',
  category: 'Dev Tools',
  method: 'GET',
  path: '/api/info/hosting-provider',
  pathTemplate: '/api/info/:slug',
  description: 'Identifikasi penyedia hosting, ISP, organisasi, ASN, dan detail lokasi geografis dari domain situs web.',
  parameters: [
    { name: 'host', type: 'text', required: true, desc: 'Domain atau URL situs web yang akan dicek (contoh: google.com).' },
    { name: 'service', type: 'select', required: false, desc: 'Domain atau URL situs web yang akan dicek (contoh: google.com).', options: ['ip2location'] }
  ],
  payloadTemplate: {
    host: 'google.com',
    service: 'ip2location'
  }
};
