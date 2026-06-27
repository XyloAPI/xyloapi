import type { DocTopic } from '../../types';

export const pingRoute: DocTopic = {
  id: 'ping',
  title: 'Ping Domain',
  category: 'IP Tools',
  method: 'GET',
  path: '/api/info/ping',
  pathTemplate: '/api/info/:slug',
  description: 'Ping a domain or IP address and return RTT latency, resolved IP, packet loss, and min/avg/max statistics.',
  parameters: [
    { name: 'domain', type: 'text', required: true, desc: 'Domain or IP address to ping (e.g. google.com or 8.8.8.8).' }
  ],
  payloadTemplate: {
    domain: 'google.com'
  }
};
