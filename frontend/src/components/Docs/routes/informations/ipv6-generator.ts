import type { DocTopic } from '../../types';

export const ipv6GeneratorRoute: DocTopic = {
  id: 'ipv6-generator',
  title: 'IPv6 Address Generator',
  category: 'IP Tools',
  method: 'GET',
  path: '/api/info/ipv6-generator',
  pathTemplate: '/api/info/:slug',
  description: 'Generate a unique IPv6 address using optional Global ID and Subnet ID values.',
  parameters: [
    { name: 'global_id', type: 'text', required: false, desc: 'Optional 10-character global ID hex string. Generated randomly if blank.' },
    { name: 'subnet_id', type: 'text', required: false, desc: 'Optional 4-character subnet ID hex string. Generated randomly if blank.' }
  ],
  payloadTemplate: {
    global_id: '3a5e94ff1e',
    subnet_id: 'a286'
  }
};
