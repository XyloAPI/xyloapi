import type { DocTopic } from '../../types';

export const myipRoute: DocTopic = {
  id: 'myip',
  title: 'My IP Location',
  category: 'IP Tools',
  method: 'GET',
  path: '/api/info/myip',
  pathTemplate: '/api/info/:slug',
  description: 'Automatically detect and look up geolocation information for the caller\'s own IP address. No parameters required.',
  parameters: [],
  payloadTemplate: {}
};
