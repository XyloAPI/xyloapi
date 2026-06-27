import type { DocTopic } from '../../types';

export const ipv6RangeRoute: DocTopic = {
  id: 'ipv6-range',
  title: 'IPv6 Range to CIDR Converter',
  category: 'IP Tools',
  method: 'GET',
  path: '/api/info/ipv6-range-to-cidr',
  pathTemplate: '/api/info/:slug',
  description: 'Convert an IPv6 start-end address range into equivalent CIDR network blocks.',
  parameters: [
    { name: 'range', type: 'text', required: true, desc: 'IPv6 address range (e.g. 2620:0:2d0:200::7-2620:0:2d0:2df::7).' }
  ],
  payloadTemplate: {
    range: '2620:0:2d0:200::7-2620:0:2d0:2df::7'
  }
};
