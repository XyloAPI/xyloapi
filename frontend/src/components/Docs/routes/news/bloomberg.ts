import type { DocTopic } from '../../types';

export const bloombergRoute: DocTopic = {
    id: 'bloomberg',
    title: 'Bloomberg',
    category: 'News',
    method: 'POST',
    path: '/api/news/bloomberg',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita terbaru dari Bloomberg (bloomberg.com) berdasarkan kategori. Mengembalikan hingga 25 artikel dengan judul, gambar beresolusi tinggi, deskripsi, penulis, dan tanggal terbit - didukung oleh feed RSS resmi Bloomberg.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita Bloomberg.',
        options: [
          { value: 'markets', label: 'Markets' },
          { value: 'technology', label: 'Technology' },
          { value: 'politics', label: 'Politics' },
          { value: 'economics', label: 'Economics' },
          { value: 'industries', label: 'Industries' },
          { value: 'green', label: 'Green' },
          { value: 'bview', label: 'Bloomberg View' },
          { value: 'businessweek', label: 'Businessweek' },
          { value: 'pursuits', label: 'Pursuits' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'markets'
    }
  };
