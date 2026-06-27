import type { DocTopic } from '../../types';

export const hitungjarakRoute: DocTopic = {
  id: 'hitung-jarak',
  title: 'Distance Calculator',
  category: 'Tools',
  method: 'GET',
  path: '/api/tools/hitung-jarak',
  pathTemplate: '/api/tools/:slug',
  description: 'Calculate geographical distance, driving time, and route coordinates between two Indonesian cities.',
  parameters: [
    { name: 'from', type: 'text', required: true, desc: 'Origin city name (e.g., Solo).' },
    { name: 'to', type: 'text', required: true, desc: 'Destination city name (e.g., Yogyakarta).' }
  ],
  payloadTemplate: {
    from: 'Solo',
    to: 'Yogyakarta'
  }
};
