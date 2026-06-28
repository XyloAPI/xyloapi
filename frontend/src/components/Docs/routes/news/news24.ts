import type { DocTopic } from '../../types';

export const news24Route: DocTopic = {
    id: 'news24',
    title: 'News24',
    category: 'News',
    method: 'POST',
    path: '/api/news/news24',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita terbaru dari News24 (news24.com) di Afrika Selatan. Mengembalikan hingga 20 artikel dari feed RSS real-time mereka.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita News24.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'south-africa', label: 'South Africa' },
          { value: 'world', label: 'World' },
          { value: 'politics', label: 'Politics' },
          { value: 'business', label: 'Business' },
          { value: 'sport', label: 'Sport' },
          { value: 'technology', label: 'Technology' },
          { value: 'health', label: 'Health' },
          { value: 'entertainment', label: 'Entertainment' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
