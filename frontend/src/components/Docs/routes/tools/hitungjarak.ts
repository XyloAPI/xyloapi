import type { DocTopic } from '../../types';

export const hitungjarakRoute: DocTopic = {
  id: 'hitung-jarak',
  title: 'Distance Calculator',
  category: 'Tools',
  method: 'GET',
  path: '/api/tools/hitung-jarak',
  pathTemplate: '/api/tools/:slug',
  description: 'Hitung jarak geografis, waktu tempuh berkendara, dan koordinat rute antara dua kota di Indonesia.',
  parameters: [
    { name: 'from', type: 'text', required: true, desc: 'Origin city name (e.g., Solo).' },
    { name: 'to', type: 'text', required: true, desc: 'Destination city name (e.g., Yogyakarta).' }
  ],
  payloadTemplate: {
    from: 'Solo',
    to: 'Yogyakarta'
  }
};
