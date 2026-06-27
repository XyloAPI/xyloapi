import type { DocTopic } from '../../types';

export const dnsvalidationRoute: DocTopic = {
  id: 'dns-validation',
  title: 'DNS Health Checker',
  category: 'DNS Tools',
  method: 'GET',
  path: '/api/info/dns-validation',
  pathTemplate: '/api/info/:slug',
  description: 'Validate DNS records, test name servers, open recursive queries, and SOA settings for a domain.',
  parameters: [
    { name: 'host', type: 'text', required: true, desc: 'Domain name to validate (e.g. google.com).' }
  ],
  payloadTemplate: {
    host: 'google.com'
  }
};
