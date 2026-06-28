import type { DocTopic } from '../../types';

export const cnbcRoute: DocTopic = {
    id: 'cnbc',
    title: 'CNBC Indonesia',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/cnbc',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita bisnis, pasar, investasi, dan umum terbaru dari CNBC Indonesia (cnbcindonesia.com). Mengembalikan hingga 20 artikel melalui feed RSS resmi.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita CNBC Indonesia.',
        options: [
          { value: 'all', label: 'CNBC Terbaru' },
          { value: 'news', label: 'CNBC News' },
          { value: 'market', label: 'CNBC Market' },
          { value: 'tech', label: 'CNBC Tech' },
          { value: 'syariah', label: 'CNBC Syariah' },
          { value: 'lifestyle', label: 'CNBC Lifestyle' },
          { value: 'entrepreneur', label: 'CNBC Entrepreneur' },
          { value: 'opini', label: 'CNBC Opini' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'all'
    }
  };
