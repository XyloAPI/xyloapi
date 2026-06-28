import type { DocTopic } from '../../types';

export const bilibiliSearchRoute: DocTopic = {
    id: 'bilibili-search',
    title: 'Bilibili Search',
    category: 'Search',
    method: 'GET',
    path: '/api/search/bilibili',
    pathTemplate: '/api/search/:slug',
    description: 'Cari video di Bilibili TV berdasarkan kata kunci dan dapatkan hasil pencarian termasuk judul, tautan, durasi, tayangan, dan nama panggilan penulis.',
    parameters: [
      { name: 'query', type: 'text', required: true, desc: 'The search term/keyword.' }
    ],
    payloadTemplate: {
      query: ''
    }
};
