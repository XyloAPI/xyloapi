import type { DocTopic } from '../../types';

export const mxlookupRoute: DocTopic = {
  id: 'mx-lookup',
  title: 'MX Lookup',
  category: 'DNS Tools',
  method: 'GET',
  path: '/api/info/mx-lookup',
  pathTemplate: '/api/info/:slug',
  description: 'Query MX (Mail Exchange) DNS records for a domain to identify its mail server configuration, priority, and TTL.',
  parameters: [
    { name: 'host', type: 'text', required: true, desc: 'Domain name to query (e.g. google.com).' }
  ],
  payloadTemplate: {
    host: 'google.com'
  }
};
