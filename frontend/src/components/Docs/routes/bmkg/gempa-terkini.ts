import type { DocTopic } from '../../types';

export const gempa_terkiniRoute: DocTopic = {
  id: 'gempa-terkini',
  title: 'Gempa Terkini',
  category: 'BMKG Indonesia',
  method: 'GET',
  path: '/api/bmkg/gempa-terkini',
  pathTemplate: '/api/bmkg/:slug',
  description: 'Ambil data gempa bumi terbaru secara real-time di Indonesia dari BMKG, mencakup koordinat, magnitudo, kedalaman, dan URL shakemap.',
  parameters: [],
  payloadTemplate: {}
};
