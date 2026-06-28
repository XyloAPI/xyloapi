import type { DocTopic } from '../../types';

export const nprRoute: DocTopic = {
    id: 'npr',
    title: 'NPR',
    category: 'News',
    method: 'POST',
    path: '/api/news/npr',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita terbaru dari NPR (npr.org) berdasarkan topik. Mengembalikan hingga 20 artikel dengan judul, gambar, deskripsi, dan tanggal terbit.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih topik berita NPR.',
        options: [
          { value: 'news', label: 'News' },
          { value: 'world', label: 'World' },
          { value: 'national', label: 'National' },
          { value: 'politics', label: 'Politics' },
          { value: 'business', label: 'Business' },
          { value: 'technology', label: 'Technology' },
          { value: 'science', label: 'Science' },
          { value: 'health', label: 'Health' },
          { value: 'arts', label: 'Arts' },
          { value: 'books', label: 'Books' },
          { value: 'education', label: 'Education' },
          { value: 'law', label: 'Law' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'news'
    }
  };
