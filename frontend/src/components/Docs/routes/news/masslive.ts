import type { DocTopic } from '../../types';

export const massliveRoute: DocTopic = {
    id: 'masslive',
    title: 'MassLive',
    category: 'News',
    method: 'POST',
    path: '/api/news/masslive',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita real-time, olahraga, politik, dan bisnis dari MassLive (masslive.com). Mem-parsing feed RSS resmi secara langsung.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita MassLive.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'news', label: 'Local News' },
          { value: 'sports', label: 'Sports' },
          { value: 'politics', label: 'Politics' },
          { value: 'business', label: 'Business' },
          { value: 'entertainment', label: 'Entertainment' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
