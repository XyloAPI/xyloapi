import type { DocTopic } from '../../types';

export const ipv6CidrRoute: DocTopic = {
  id: 'ipv6-cidr',
  title: 'IPv6 CIDR to Range Converter',
  category: 'IP Tools',
  method: 'GET',
  path: '/api/info/ipv6-cidr-to-range',
  pathTemplate: '/api/info/:slug',
  description: 'Convert an IPv6 CIDR block into a start and end IP address range, along with network statistics.',
  parameters: [
    { name: 'cidr', type: 'text', required: true, desc: 'IPv6 CIDR block (e.g. 2001:4860:4860::8888/32).' }
  ],
  payloadTemplate: {
    cidr: '2001:4860:4860::8888/32'
  }
};
