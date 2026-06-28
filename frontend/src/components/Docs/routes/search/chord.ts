import type { DocTopic } from '../../types';

export const chordSearchRoute: DocTopic = {
    id: 'chord-search',
    title: 'Chord Search',
    category: 'Search',
    method: 'GET',
    path: '/api/search/chord',
    pathTemplate: '/api/search/:slug',
    description: 'Cari chord gitar dan lirik lagu.',
    parameters: [
      { name: 'query', type: 'text', required: true, desc: 'Song title or artist name.' }
    ],
    payloadTemplate: {
      query: ''
    }
};
