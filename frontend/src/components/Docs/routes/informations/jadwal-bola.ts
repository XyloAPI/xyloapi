import type { DocTopic } from '../../types';

export const jadwal_bolaRoute: DocTopic = {
  id: 'jadwal-bola',
  title: 'Jadwal Pertandingan Bola',
  category: 'Informations',
  method: 'GET',
  path: '/api/info/jadwal-bola',
  pathTemplate: '/api/info/:slug',
  description: 'Retrieve real-time football match schedules and live scores from various major leagues worldwide powered by OneFootball.',
  parameters: [],
  payloadTemplate: {}
};
