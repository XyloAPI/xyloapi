import type { DocTopic } from '../../types';

export const vgdRoute: DocTopic = {
    id: 'vgd',
    title: 'v.gd Shortener',
    category: 'Shortlink Tools',
    method: 'GET',
    path: '/api/shortlink/vgd',
    pathTemplate: '/api/shortlink/:slug',
    description: 'Shorten long URLs instantly using the v.gd shortening service.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'The long URL to be shortened.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
