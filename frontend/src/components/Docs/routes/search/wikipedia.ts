import type { DocTopic } from '../../types';

export const wikipediaSearchRoute: DocTopic = {
    id: 'wikipedia-search',
    title: 'Wikipedia Search',
    category: 'Search',
    method: 'GET',
    path: '/api/search/wikipedia',
    pathTemplate: '/api/search/:slug',
    description: 'Cari halaman di Wikipedia berdasarkan kata kunci dan dapatkan informasi detail termasuk judul, kutipan, dan gambar.',
    parameters: [
      { name: 'query', type: 'text', required: true, desc: 'The search term/keyword.' },
      { name: 'lang', type: 'text', required: false, desc: 'Language code of Wikipedia (default is id).' }
    ],
    payloadTemplate: {
      query: '',
      lang: 'id'
    }
};
