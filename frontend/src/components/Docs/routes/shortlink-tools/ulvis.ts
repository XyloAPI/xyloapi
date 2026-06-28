import type { DocTopic } from '../../types';

export const ulvisRoute: DocTopic = {
    id: 'ulvis',
    title: 'ulvis.net Shortener',
    category: 'Shortlink Tools',
    method: 'GET',
    path: '/api/shortlink/ulvis',
    pathTemplate: '/api/shortlink/:slug',
    description: 'Perpendek URL panjang secara instan menggunakan layanan ulvis.net.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'The long URL to be shortened.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
