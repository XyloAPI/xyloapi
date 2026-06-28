import type { DocTopic } from '../../types';

export const githubSearchRoute: DocTopic = {
    id: 'github-search',
    title: 'GitHub Search',
    category: 'Search',
    method: 'GET',
    path: '/api/search/github',
    pathTemplate: '/api/search/:slug',
    description: 'Cari repositori publik di GitHub berdasarkan kata kunci. Diurutkan berdasarkan jumlah bintang secara menurun.',
    parameters: [
      { name: 'query', type: 'text', required: true, desc: 'The repository name or keyword.' }
    ],
    payloadTemplate: {
      query: ''
    }
};
