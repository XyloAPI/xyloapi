import type { DocTopic } from '../../types';

export const dagdRoute: DocTopic = {
    id: 'dagd',
    title: 'da.gd Shortener',
    category: 'Shortlink Tools',
    method: 'GET',
    path: '/api/shortlink/dagd',
    pathTemplate: '/api/shortlink/:slug',
    description: 'Shorten long URLs instantly using the da.gd shortening service. Optionally, specify a custom short URL suffix.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'The long URL to be shortened.' },
      { name: 'shorturl', type: 'text', required: false, desc: 'Custom short URL suffix (optional).' }
    ],
    payloadTemplate: {
      url: '',
      shorturl: ''
    }
  };
