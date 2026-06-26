import type { DocTopic } from '../../types';

export const gempa_dirasakanRoute: DocTopic = {
  id: 'gempa-dirasakan',
  title: 'Gempa Dirasakan',
  category: 'BMKG Indonesia',
  method: 'GET',
  path: '/api/bmkg/gempa-dirasakan',
  pathTemplate: '/api/bmkg/:slug',
  description: 'Retrieve a list of the most recent earthquakes felt in Indonesia from BMKG (gempadirasakan.json), including MMI levels and impact details.',
  parameters: [],
  payloadTemplate: {}
};
