import type { DocTopic } from '../../types';

export const ipv6CompatibilityRoute: DocTopic = {
  id: 'ipv6-compatibility',
  title: 'IPv6 Compatibility Checker',
  category: 'IP Tools',
  method: 'GET',
  path: '/api/info/ipv6-compatibility',
  pathTemplate: '/api/info/:slug',
  description: 'Validate if a domain has IPv6 records configured for its web servers and name servers.',
  parameters: [
    { name: 'host', type: 'text', required: true, desc: 'Domain name to check (e.g. google.com).' }
  ],
  payloadTemplate: {
    host: 'google.com'
  }
};
