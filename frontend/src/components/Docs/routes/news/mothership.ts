import type { DocTopic } from '../../types';

export const mothershipRoute: DocTopic = {
    id: 'mothership',
    title: 'Mothership SG',
    category: 'News',
    method: 'POST',
    path: '/api/news/mothership',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil artikel berita terbaru dari Mothership.sg di Singapura. Mengembalikan hingga 20 artikel.',
    parameters: [],
    payloadTemplate: {}
  };
