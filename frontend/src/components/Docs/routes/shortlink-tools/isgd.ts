import type { DocTopic } from '../../types';

export const isgdRoute: DocTopic = {
    id: 'isgd',
    title: 'is.gd Shortener',
    category: 'Shortlink Tools',
    method: 'GET',
    path: '/api/shortlink/isgd',
    pathTemplate: '/api/shortlink/:slug',
    description: 'Shorten long URLs instantly using the is.gd shortening service.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'The long URL to be shortened.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
