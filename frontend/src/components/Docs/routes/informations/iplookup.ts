import type { DocTopic } from '../../types';

export const iplookupRoute: DocTopic = {
  id: 'iplookup',
  title: 'IP Lookup',
  category: 'IP Tools',
  method: 'GET',
  path: '/api/info/ip',
  pathTemplate: '/api/info/:slug',
  description: 'Lookup detailed geolocation and network information for a specified IP address or domain.',
  parameters: [
    { name: 'ip', type: 'text', required: false, desc: 'IP address or domain name (e.g. 8.8.8.8 or xyloapi.qzz.io).' }
  ],
  payloadTemplate: {
    ip: '8.8.8.8'
  }
};
