import type { DocTopic } from '../../types';

export const vgdRoute: DocTopic = {
    id: 'vgd',
    title: 'v.gd Shortener',
    category: 'Shortlink Tools',
    method: 'GET',
    path: '/api/shortlink/vgd',
    pathTemplate: '/api/shortlink/:slug',
    description: 'Perpendek URL panjang secara instan menggunakan layanan v.gd.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'The long URL to be shortened.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
