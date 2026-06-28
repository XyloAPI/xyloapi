import type { DocTopic } from '../../types';

export const cbsRoute: DocTopic = {
    id: 'cbs',
    title: 'CBS News',
    category: 'News',
    method: 'POST',
    path: '/api/news/cbs',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita terbaru dari CBS News (cbsnews.com) berdasarkan kategori. Mengembalikan hingga 25 artikel dengan judul, gambar, deskripsi, dan tanggal terbit - didukung oleh feed RSS resmi CBS News.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita CBS News.',
        options: [
          { value: 'main', label: 'Main / Top Stories' },
          { value: 'us', label: 'US' },
          { value: 'world', label: 'World' },
          { value: 'politics', label: 'Politics' },
          { value: 'business', label: 'Business' },
          { value: 'technology', label: 'Technology' },
          { value: 'health', label: 'Health' },
          { value: 'entertainment', label: 'Entertainment' },
          { value: 'science', label: 'Science' },
          { value: 'sports', label: 'Sports' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'main'
    }
  };
