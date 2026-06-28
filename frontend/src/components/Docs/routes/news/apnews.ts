import type { DocTopic } from '../../types';

export const apnewsRoute: DocTopic = {
    id: 'apnews',
    title: 'AP News',
    category: 'News',
    method: 'POST',
    path: '/api/news/apnews',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita terbaru dari AP News (apnews.com) berdasarkan kategori. Mengembalikan hingga 20 artikel dengan judul, gambar, deskripsi, dan tanggal terbit.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita AP News.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'world', label: 'World News' },
          { value: 'us', label: 'US News' },
          { value: 'politics', label: 'Politics' },
          { value: 'business', label: 'Business' },
          { value: 'technology', label: 'Technology' },
          { value: 'health', label: 'Health' },
          { value: 'entertainment', label: 'Entertainment' },
          { value: 'sports', label: 'Sports' },
          { value: 'science', label: 'Science' },
          { value: 'oddities', label: 'Oddities' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
