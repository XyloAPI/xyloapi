import type { DocTopic } from '../../types';

export const reutersRoute: DocTopic = {
    id: 'reuters',
    title: 'Reuters',
    category: 'News',
    method: 'POST',
    path: '/api/news/reuters',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita terbaru dari Reuters (reuters.com) berdasarkan kategori. Mengembalikan hingga 20 artikel. Catatan: gambar artikel tidak tersedia karena larangan HTTP 401.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita Reuters.',
        options: [
          { value: 'top', label: 'Top News' },
          { value: 'world', label: 'World' },
          { value: 'business', label: 'Business' },
          { value: 'markets', label: 'Markets' },
          { value: 'technology', label: 'Technology' },
          { value: 'science', label: 'Science' },
          { value: 'sports', label: 'Sports' },
          { value: 'lifestyle', label: 'Lifestyle' },
          { value: 'legal', label: 'Legal' },
          { value: 'health', label: 'Health' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
