import type { DocTopic } from '../../types';

export const nbcnewsRoute: DocTopic = {
    id: 'nbcnews',
    title: 'NBC News',
    category: 'News',
    method: 'POST',
    path: '/api/news/nbcnews',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita utama terbaru dari NBC News (nbcnews.com). Mengembalikan hingga 20 artikel langsung dari feed RSS resmi NBC News.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita NBC News.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'us', label: 'U.S. News' },
          { value: 'world', label: 'World News' },
          { value: 'politics', label: 'Politics' },
          { value: 'business', label: 'Business' },
          { value: 'health', label: 'Health' },
          { value: 'tech', label: 'Technology' },
          { value: 'science', label: 'Science' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
