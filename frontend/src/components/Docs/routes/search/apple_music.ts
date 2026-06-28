import type { DocTopic } from '../../types';

export const appleMusicSearchRoute: DocTopic = {
    id: 'apple-music-search',
    title: 'Apple Music Search',
    category: 'Search',
    method: 'GET',
    path: '/api/search/apple-music',
    pathTemplate: '/api/search/:slug',
    description: 'Cari lagu di Apple Music / iTunes berdasarkan kata kunci dan dapatkan metadata detail termasuk judul, artis, album, sampul, genre, durasi, tanda eksplisit, dan tautan pratinjau audio.',
    parameters: [
      { name: 'query', type: 'text', required: true, desc: 'The search term/keyword.' },
      { name: 'limit', type: 'number', required: false, desc: 'Maximum number of results to fetch (default is 30).' }
    ],
    payloadTemplate: {
      query: '',
      limit: 30
    }
};
