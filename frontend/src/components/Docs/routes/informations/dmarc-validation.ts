import type { DocTopic } from '../../types';

export const dmarcvalidationRoute: DocTopic = {
  id: 'dmarc-validation',
  title: 'DMARC Validation',
  category: 'DNS Tools',
  method: 'GET',
  path: '/api/info/dmarc-validation',
  pathTemplate: '/api/info/:slug',
  description: 'Validate DMARC email authentication policy and security record configuration for a domain.',
  parameters: [
    { name: 'host', type: 'text', required: true, desc: 'Domain name to validate DMARC policy (e.g. google.com).' }
  ],
  payloadTemplate: {
    host: 'google.com'
  }
};
