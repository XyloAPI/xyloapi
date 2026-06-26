import type { DocTopic } from '../../types';

export const gempa_terbaruRoute: DocTopic = {
  id: 'gempa-terbaru',
  title: 'Gempa Terbaru',
  category: 'BMKG Indonesia',
  method: 'GET',
  path: '/api/bmkg/gempa-terbaru',
  pathTemplate: '/api/bmkg/:slug',
  description: 'Retrieve a list of the 15 most recent earthquakes recorded in Indonesia from BMKG (gempaterkini.json).',
  parameters: [],
  payloadTemplate: {}
};
