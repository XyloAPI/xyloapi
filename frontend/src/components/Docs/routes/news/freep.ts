import type { DocTopic } from '../../types';

export const freepRoute: DocTopic = {
    id: 'freep',
    title: 'Detroit Free Press',
    category: 'News',
    method: 'POST',
    path: '/api/news/detroit',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita lokal, olahraga, dan bisnis dari Detroit Free Press (freep.com). Mengembalikan hingga 20 artikel dengan perlindungan dari WAF.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita Detroit Free Press.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'news', label: 'Detroit & Local News' },
          { value: 'sports', label: 'Sports' },
          { value: 'business', label: 'Business & Autos' },
          { value: 'entertainment', label: 'Entertainment & Life' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
