import type { DocTopic } from '../../types';

export const ipToDecimalRoute: DocTopic = {
  id: 'ip-to-decimal',
  title: 'IP to Decimal Converter',
  category: 'IP Tools',
  method: 'GET',
  path: '/api/info/ip-to-decimal',
  pathTemplate: '/api/info/:slug',
  description: 'Convert an IP address to its decimal representation, along with expanded and compatibility IPv6 formats.',
  parameters: [
    { name: 'ip', type: 'text', required: true, desc: 'IP address to convert (e.g. 8.8.8.8).' }
  ],
  payloadTemplate: {
    ip: '8.8.8.8'
  }
};
