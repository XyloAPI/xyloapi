import type { DocTopic } from '../../types';

export const wikimediaSearchRoute: DocTopic = {
    id: 'wikimedia-search',
    title: 'Wikimedia Search',
    category: 'Search',
    method: 'GET',
    path: '/api/search/wikimedia',
    pathTemplate: '/api/search/:slug',
    description: 'Cari media di Wikimedia Commons berdasarkan kata kunci dan dapatkan informasi detail termasuk pratinjau gambar beresolusi tinggi.',
    parameters: [
      { name: 'query', type: 'text', required: true, desc: 'The search term/keyword.' }
    ],
    payloadTemplate: {
      query: ''
    }
};
