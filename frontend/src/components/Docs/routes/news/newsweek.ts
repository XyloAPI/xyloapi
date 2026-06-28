import type { DocTopic } from '../../types';

export const newsweekRoute: DocTopic = {
    id: 'newsweek',
    title: 'Newsweek',
    category: 'News',
    method: 'POST',
    path: '/api/news/newsweek',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita dan fitur terbaru dari Newsweek (newsweek.com). Mengembalikan hingga 20 artikel yang diselesaikan secara dinamis.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita Newsweek.',
        options: [
          { value: 'us', label: 'U.S. News' },
          { value: 'world', label: 'World' },
          { value: 'opinion', label: 'Opinion' },
          { value: 'business', label: 'Business' },
          { value: 'tech-science', label: 'Tech & Science' },
          { value: 'sports', label: 'Sports' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'us'
    }
  };
