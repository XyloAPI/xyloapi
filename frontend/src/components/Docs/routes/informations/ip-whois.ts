import type { DocTopic } from '../../types';

export const ipWhoisRoute: DocTopic = {
  id: 'ip-whois',
  title: 'IP Whois Lookup',
  category: 'IP Tools',
  method: 'GET',
  path: '/api/info/ip-whois',
  pathTemplate: '/api/info/:slug',
  description: 'Lookup detailed registry records and ownership credentials for any IPv4 or IPv6 address.',
  parameters: [
    { name: 'ip', type: 'text', required: true, desc: 'IP address to query (e.g. 8.8.8.8).' }
  ],
  payloadTemplate: {
    ip: '8.8.8.8'
  }
};
