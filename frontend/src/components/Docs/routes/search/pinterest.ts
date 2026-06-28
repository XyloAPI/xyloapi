import type { DocTopic } from '../../types';

export const pinterestSearchRoute: DocTopic = {
    id: 'pinterest-search',
    title: 'Pinterest Search',
    category: 'Search',
    method: 'GET',
    path: '/api/search/pinterest',
    pathTemplate: '/api/search/:slug',
    description: 'Cari pin di Pinterest berdasarkan kata kunci dan dapatkan informasi detail termasuk URL gambar dan kreator.',
    parameters: [
      { name: 'query', type: 'text', required: true, desc: 'The search term/keyword.' },
      { name: 'limit', type: 'number', required: false, desc: 'Maximum number of results to fetch (default is 20).' }
    ],
    payloadTemplate: {
      query: '',
      limit: 20
    }
};
