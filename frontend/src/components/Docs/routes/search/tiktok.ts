import type { DocTopic } from '../../types';

export const tiktokSearchRoute: DocTopic = {
    id: 'tiktok-search',
    title: 'TikTok Search',
    category: 'Search',
    method: 'GET',
    path: '/api/search/tiktok',
    pathTemplate: '/api/search/:slug',
    description: 'Cari video di TikTok berdasarkan kata kunci dan dapatkan informasi detail termasuk tautan unduhan tanpa tanda air (watermark).',
    parameters: [
      { name: 'query', type: 'text', required: true, desc: 'The search term/keyword.' },
      { name: 'limit', type: 'number', required: false, desc: 'Maximum number of results to fetch (default is 10).' }
    ],
    payloadTemplate: {
      query: '',
      limit: 10
    }
};
