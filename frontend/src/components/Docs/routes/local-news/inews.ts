import type { DocTopic } from '../../types';

export const inewsRoute: DocTopic = {
    id: 'inews',
    title: 'iNews',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/inews',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita lokal terbaru, olahraga, bisnis, gaya hidup, dan pembaruan regional dari iNews (inews.id) di Indonesia.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita iNews.',
        options: [
          { value: 'news', label: 'News Utama' },
          { value: 'nasional', label: 'Nasional' },
          { value: 'internasional', label: 'Internasional' },
          { value: 'megapolitan', label: 'Megapolitan' },
          { value: 'finance', label: 'Finance' },
          { value: 'sport', label: 'Sport' },
          { value: 'soccer', label: 'Soccer' },
          { value: 'lifestyle', label: 'Lifestyle' },
          { value: 'travel', label: 'Travel' },
          { value: 'otomotif', label: 'Otomotif' },
          { value: 'techno', label: 'Techno' },
          { value: 'regional', label: 'Regional' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'news'
    }
  };
