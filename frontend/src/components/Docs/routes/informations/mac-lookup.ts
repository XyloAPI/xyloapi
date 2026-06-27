import type { DocTopic } from '../../types';

export const macLookupRoute: DocTopic = {
  id: 'mac-lookup',
  title: 'MAC Address Lookup',
  category: 'Cyber Security Tools',
  method: 'GET',
  path: '/api/info/mac-lookup',
  pathTemplate: '/api/info/:slug',
  description: 'Lookup detailed organization, block registry, private status, and record history for any MAC address.',
  parameters: [
    { name: 'mac', type: 'text', required: true, desc: 'MAC Address to look up (e.g. 40-A8-F0-4F-50-9E or 40:A8:F0:4F:50:9E).' }
  ],
  payloadTemplate: {
    mac: '40-A8-F0-4F-50-9E'
  }
};
