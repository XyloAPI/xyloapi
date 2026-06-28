import type { DocTopic } from '../../types';

export const abcRoute: DocTopic = {
    id: 'abc',
    title: 'ABC News',
    category: 'News',
    method: 'POST',
    path: '/api/news/abc',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita utama terbaru dari ABC News (abcnews.go.com) berdasarkan kategori. Mengembalikan hingga 25 artikel dengan judul, gambar, deskripsi, dan tanggal terbit - didukung oleh feed RSS resmi ABC News.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita ABC News.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'us', label: 'US News' },
          { value: 'politics', label: 'Politics' },
          { value: 'world', label: 'World News' },
          { value: 'business', label: 'Business' },
          { value: 'technology', label: 'Technology' },
          { value: 'health', label: 'Health' },
          { value: 'entertainment', label: 'Entertainment' },
          { value: 'sport', label: 'Sport' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
