import type { DocTopic } from '../../types';

export const merdekaRoute: DocTopic = {
    id: 'merdeka',
    title: 'Merdeka News',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/merdeka',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita lokal terbaru, politik, ekonomi, selebritas, topik hangat, dan berita regional dari Merdeka News (merdeka.com).',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita Merdeka News.',
        options: [
          { value: 'news', label: 'News' },
          { value: 'politik', label: 'Politik' },
          { value: 'ekonomi', label: 'Ekonomi' },
          { value: 'artis', label: 'Artis' },
          { value: 'trending', label: 'Trending' },
          { value: 'tekno', label: 'Tekno' },
          { value: 'otomotif', label: 'Otomotif' },
          { value: 'dunia', label: 'Dunia' },
          { value: 'lifestyle', label: 'Lifestyle' },
          { value: 'sehat', label: 'Sehat' },
          { value: 'sport', label: 'Sport' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'news'
    }
  };
