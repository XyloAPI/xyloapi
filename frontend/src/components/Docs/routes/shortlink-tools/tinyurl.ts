import type { DocTopic } from '../../types';

export const tinyurlRoute: DocTopic = {
    id: 'tinyurl',
    title: 'TinyURL Shortener',
    category: 'Shortlink Tools',
    method: 'GET',
    path: '/api/shortlink/tinyurl',
    pathTemplate: '/api/shortlink/:slug',
    description: 'Perpendek URL panjang secara instan menggunakan layanan TinyURL.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'The long URL to be shortened.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
