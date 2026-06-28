import type { DocTopic } from '../../types';

export const deezerSearchRoute: DocTopic = {
    id: 'deezer-search',
    title: 'Deezer Search',
    category: 'Search',
    method: 'GET',
    path: '/api/search/deezer',
    pathTemplate: '/api/search/:slug',
    description: 'Cari musik di Deezer berdasarkan kata kunci. Mendukung pencarian trek, album, atau artis, dan mengembalikan info detail.',
    parameters: [
      { name: 'query', type: 'text', required: true, desc: 'The search term/keyword.' },
      { name: 'type', type: 'select', required: false, desc: 'Search category filter (track, album, artist). Default is track.', options: ['track', 'album', 'artist'] },
      { name: 'limit', type: 'number', required: false, desc: 'Maximum number of results to fetch (default is 20).' }
    ],
    payloadTemplate: {
      query: '',
      type: 'track',
      limit: 20
    }
};
