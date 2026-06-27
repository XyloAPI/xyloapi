import type { DocTopic } from '../../types';

export const hostingProviderRoute: DocTopic = {
  id: 'hosting-provider',
  title: 'Website Hosting Provider Check',
  category: 'Dev Tools',
  method: 'GET',
  path: '/api/info/hosting-provider',
  pathTemplate: '/api/info/:slug',
  description: 'Identify the hosting provider, ISP, organization, ASN, and geographic location details of a website domain.',
  parameters: [
    { name: 'host', type: 'text', required: true, desc: 'Domain or URL of the website to check (e.g. google.com).' },
    { name: 'service', type: 'select', required: false, desc: 'API geolocation/IP provider database (default: ip2location).', options: ['ip2location'] }
  ],
  payloadTemplate: {
    host: 'google.com',
    service: 'ip2location'
  }
};
