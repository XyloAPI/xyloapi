import type { DocTopic } from '../../types';

export const ramalanIChingRoute: DocTopic = {
  id: 'ramalan-i-ching',
  title: 'Ramalan I Ching',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/ramalan-i-ching',
  pathTemplate: '/api/primbon/:slug',
  description: 'Membaca ramalan I Ching.',
  parameters: [],
  payloadTemplate: {}
};
