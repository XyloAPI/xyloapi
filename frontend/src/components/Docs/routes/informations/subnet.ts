import type { DocTopic } from '../../types';

export const subnetRoute: DocTopic = {
  id: 'subnet',
  title: 'Subnet Calculator',
  category: 'IP Tools',
  method: 'GET',
  path: '/api/info/subnet-calculator',
  pathTemplate: '/api/info/:slug',
  description: 'Calculate subnet details, network addresses, broadcasts, usable IP ranges, and CIDR lists from an IP with optional slash prefix.',
  parameters: [
    { name: 'ip', type: 'text', required: true, desc: 'IPv4 address with or without CIDR prefix (e.g. 39.42.164.235/24 or 39.42.164.235).' }
  ],
  payloadTemplate: {
    ip: '39.42.164.235/24'
  }
};
