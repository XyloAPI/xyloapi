import type { DocTopic } from '../../types';

export const ipv4ToIpv6Route: DocTopic = {
  id: 'ipv4-to-ipv6',
  title: 'IPv4 to IPv6 Converter',
  category: 'IP Tools',
  method: 'GET',
  path: '/api/info/ipv4-to-ipv6',
  pathTemplate: '/api/info/:slug',
  description: 'Convert an IPv4 address to its IPv6 compatibility, expanded, and shorthand forms.',
  parameters: [
    { name: 'ip', type: 'text', required: true, desc: 'IPv4 address to convert (e.g. 192.168.1.1).' }
  ],
  payloadTemplate: {
    ip: '192.168.1.1'
  }
};
