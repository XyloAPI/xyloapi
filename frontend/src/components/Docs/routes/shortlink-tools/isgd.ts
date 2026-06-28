import type { DocTopic } from '../../types';

export const isgdRoute: DocTopic = {
    id: 'isgd',
    title: 'is.gd Shortener',
    category: 'Shortlink Tools',
    method: 'GET',
    path: '/api/shortlink/isgd',
    pathTemplate: '/api/shortlink/:slug',
    description: 'Perpendek URL panjang secara instan menggunakan layanan is.gd.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'The long URL to be shortened.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
