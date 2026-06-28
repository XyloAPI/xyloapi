import type { DocTopic } from '../../types';

export const cleanuriRoute: DocTopic = {
    id: 'cleanuri',
    title: 'CleanURI Shortener',
    category: 'Shortlink Tools',
    method: 'GET',
    path: '/api/shortlink/cleanuri',
    pathTemplate: '/api/shortlink/:slug',
    description: 'Perpendek URL panjang secara instan menggunakan layanan CleanURI.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'The long URL to be shortened.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
