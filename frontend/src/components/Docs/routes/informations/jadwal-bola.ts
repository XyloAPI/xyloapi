import type { DocTopic } from '../../types';

export const jadwal_bolaRoute: DocTopic = {
  id: 'jadwal-bola',
  title: 'Jadwal Pertandingan Bola',
  category: 'Informations',
  method: 'GET',
  path: '/api/info/jadwal-bola',
  pathTemplate: '/api/info/:slug',
  description: 'Ambil jadwal pertandingan sepak bola secara real-time dan skor langsung dari berbagai liga besar di seluruh dunia yang didukung oleh OneFootball.',
  parameters: [],
  payloadTemplate: {}
};
