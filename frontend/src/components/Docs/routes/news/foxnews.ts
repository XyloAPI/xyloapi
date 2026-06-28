import type { DocTopic } from '../../types';

export const foxnewsRoute: DocTopic = {
    id: 'foxnews',
    title: 'Fox News',
    category: 'News',
    method: 'POST',
    path: '/api/news/foxnews',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita utama terbaru dari Fox News (foxnews.com) berdasarkan kategori. Mengembalikan hingga 25 artikel dengan judul, gambar, deskripsi, dan tanggal terbit.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita Fox News.',
        options: [
          { value: 'latest', label: 'Latest' },
          { value: 'national', label: 'National' },
          { value: 'world', label: 'World' },
          { value: 'politics', label: 'Politics' },
          { value: 'business', label: 'Business' },
          { value: 'technology', label: 'Technology' },
          { value: 'science', label: 'Science' },
          { value: 'health', label: 'Health' },
          { value: 'entertainment', label: 'Entertainment' },
          { value: 'sports', label: 'Sports' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'latest'
    }
  };
