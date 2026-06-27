import type { DocTopic } from '../../types';

export const dnsrecordsRoute: DocTopic = {
  id: 'dns-records',
  title: 'DNS Records',
  category: 'DNS Tools',
  method: 'GET',
  path: '/api/info/dns-records',
  pathTemplate: '/api/info/:slug',
  description: 'Lookup all DNS records (A, AAAA, MX, NS, TXT, SOA, CAA, CNAME) for a given domain.',
  parameters: [
    { name: 'host', type: 'text', required: true, desc: 'Domain name to lookup DNS records (e.g. google.com).' },
    {
      name: 'type',
      type: 'select',
      required: false,
      desc: 'Record category filter (default: COMMON).',
      options: ['COMMON', 'A', 'AAAA', 'MX', 'NS', 'TXT', 'SOA', 'CAA', 'CNAME']
    }
  ],
  payloadTemplate: {
    host: 'google.com',
    type: 'COMMON'
  }
};
