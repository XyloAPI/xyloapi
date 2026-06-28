import type { DocTopic } from '../../types';

export const gempa_terbaruRoute: DocTopic = {
  id: 'gempa-terbaru',
  title: 'Gempa Terbaru',
  category: 'BMKG Indonesia',
  method: 'GET',
  path: '/api/bmkg/gempa-terbaru',
  pathTemplate: '/api/bmkg/:slug',
  description: 'Ambil daftar 15 gempa bumi terbaru yang tercatat di Indonesia dari BMKG.',
  parameters: [],
  payloadTemplate: {}
};
