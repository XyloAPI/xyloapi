import type { DocTopic } from '../../types';

export const euronewsRoute: DocTopic = {
    id: 'euronews',
    title: 'Euronews',
    category: 'News',
    method: 'POST',
    path: '/api/news/euronews',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita multi-bahasa se-Eropa dari Euronews (euronews.com). Mengembalikan hingga 20 artikel dengan mem-parsing feed XML resmi mereka secara langsung.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita Euronews.',
        options: [
          { value: 'top', label: 'Latest News' },
          { value: 'news', label: 'News' },
          { value: 'business', label: 'Business' },
          { value: 'sport', label: 'Sport' },
          { value: 'next', label: 'Next (Tech)' },
          { value: 'travel', label: 'Travel' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
