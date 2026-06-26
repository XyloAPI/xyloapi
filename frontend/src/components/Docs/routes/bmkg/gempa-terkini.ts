import type { DocTopic } from '../../types';

export const gempa_terkiniRoute: DocTopic = {
  id: 'gempa-terkini',
  title: 'Gempa Terkini',
  category: 'BMKG Indonesia',
  method: 'GET',
  path: '/api/bmkg/gempa-terkini',
  pathTemplate: '/api/bmkg/:slug',
  description: 'Retrieve real-time data about the most recent earthquake in Indonesia from BMKG (autogempa.json), including coordinates, magnitude, depth, and shakemap URL.',
  parameters: [],
  payloadTemplate: {}
};
