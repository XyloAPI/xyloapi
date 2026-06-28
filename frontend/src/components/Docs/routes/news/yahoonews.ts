import type { DocTopic } from '../../types';

export const yahoonewsRoute: DocTopic = {
    id: 'yahoonews',
    title: 'Yahoo News',
    category: 'News',
    method: 'POST',
    path: '/api/news/yahoonews',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita utama terbaru dari Yahoo News (yahoo.com/news). Mengembalikan hingga 20 artikel dari kategori berita Yahoo.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita Yahoo News.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'us', label: 'U.S. News' },
          { value: 'world', label: 'World News' },
          { value: 'politics', label: 'Politics' },
          { value: 'science', label: 'Science' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
