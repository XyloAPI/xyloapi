import type { DocTopic } from '../../types';

export const nslookupRoute: DocTopic = {
  id: 'ns-lookup',
  title: 'NS lookup',
  category: 'DNS Tools',
  method: 'GET',
  path: '/api/info/ns-lookup',
  pathTemplate: '/api/info/:slug',
  description: 'Query NS (Name Server) DNS records for a domain to determine authoritative name servers and TTL.',
  parameters: [
    { name: 'host', type: 'text', required: true, desc: 'Domain name to query (e.g. google.com).' }
  ],
  payloadTemplate: {
    host: 'google.com'
  }
};
