import type { DocTopic } from '../../types';

export const cnaRoute: DocTopic = {
    id: 'cna',
    title: 'CNA Indonesia',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/cna',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita lokal terbaru, ekonomi, gaya hidup, dan pembaruan regional dari CNA Indonesia (cna.id). Mengembalikan hingga 20 artikel.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita CNA Indonesia.',
        options: [
          { value: 'news', label: 'Berita Utama' },
          { value: 'terbaru', label: 'Terbaru' },
          { value: 'asia', label: 'Asia' },
          { value: 'indonesia', label: 'Indonesia' },
          { value: 'lifestyle', label: 'Lifestyle' },
          { value: 'trending', label: 'Trending' },
          { value: 'pilihan-editor', label: 'Pilihan Editor' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'indonesia'
    }
  };
