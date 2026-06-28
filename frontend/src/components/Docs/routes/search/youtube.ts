import type { DocTopic } from '../../types';

export const youtubeSearchRoute: DocTopic = {
    id: 'youtube-search',
    title: 'YouTube Search',
    category: 'Search',
    method: 'GET',
    path: '/api/search/youtube',
    pathTemplate: '/api/search/:slug',
    description: 'Cari video, daftar putar (playlist), dan saluran di YouTube berdasarkan kata kunci dan dapatkan metadata detail.',
    parameters: [
      { name: 'query', type: 'text', required: true, desc: 'The search term/keyword.' },
      { name: 'limit', type: 'number', required: false, desc: 'Maximum number of results to fetch (default is 20).' }
    ],
    payloadTemplate: {
      query: '',
      limit: 20
    }
};
