import type { DocTopic } from '../../types';

export const tinyurlRoute: DocTopic = {
    id: 'tinyurl',
    title: 'TinyURL Shortener',
    category: 'Shortlink Tools',
    method: 'GET',
    path: '/api/shortlink/tinyurl',
    pathTemplate: '/api/shortlink/:slug',
    description: 'Shorten long URLs instantly using the TinyURL shortening service.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'The long URL to be shortened.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
