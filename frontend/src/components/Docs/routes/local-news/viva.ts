import type { DocTopic } from '../../types';

export const vivaRoute: DocTopic = {
    id: 'viva',
    title: 'VIVA News',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/viva',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita lokal terbaru, olahraga, bisnis, dan gaya hidup dari VIVA News (viva.co.id) di Indonesia.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita VIVA News.',
        options: [
          { value: 'news', label: 'Berita Terbaru (All)' },
          { value: 'nasional', label: 'Nasional' },
          { value: 'internasional', label: 'Internasional' },
          { value: 'metro', label: 'Metro' },
          { value: 'bisnis', label: 'Bisnis' },
          { value: 'bola', label: 'Bola' },
          { value: 'sport', label: 'Sport' },
          { value: 'otomotif', label: 'Otomotif' },
          { value: 'lifestyle', label: 'Lifestyle' },
          { value: 'showbiz', label: 'Showbiz' },
          { value: 'digital', label: 'Digital' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'news'
    }
  };
