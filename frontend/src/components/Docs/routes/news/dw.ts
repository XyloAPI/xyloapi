import type { DocTopic } from '../../types';

export const dwRoute: DocTopic = {
    id: 'dw',
    title: 'DW (Deutsche Welle)',
    category: 'News',
    method: 'POST',
    path: '/api/news/dw',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita terbaru dari DW - Deutsche Welle (dw.com) berdasarkan kategori. Mengembalikan hingga 20 artikel dengan judul, gambar, deskripsi, dan tanggal terbit - didukung oleh feed RSS resmi DW.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita DW.',
        options: [
          { value: 'top', label: 'Top News' },
          { value: 'all', label: 'All News' },
          { value: 'world', label: 'World' },
          { value: 'africa', label: 'Africa' },
          { value: 'science', label: 'Science' },
          { value: 'sports', label: 'Sports' },
          { value: 'environment', label: 'Environment' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
