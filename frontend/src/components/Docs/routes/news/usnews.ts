import type { DocTopic } from '../../types';

export const usnewsRoute: DocTopic = {
    id: 'usnews',
    title: 'U.S. News',
    category: 'News',
    method: 'POST',
    path: '/api/news/usnews',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita terbaru dan peringkat dari U.S. News & World Report (usnews.com) menggunakan fallback kueri Google News.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita US News.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'national', label: 'National News' },
          { value: 'politics', label: 'Politics' },
          { value: 'world', label: 'World News' },
          { value: 'business', label: 'Business' },
          { value: 'health', label: 'Health' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
