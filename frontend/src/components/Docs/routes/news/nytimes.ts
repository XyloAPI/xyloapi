import type { DocTopic } from '../../types';

export const nytimesRoute: DocTopic = {
    id: 'nytimes',
    title: 'The New York Times',
    category: 'News',
    method: 'POST',
    path: '/api/news/nytimes',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita terbaru dari The New York Times (nytimes.com) berdasarkan kategori. Mengembalikan hingga 25 artikel dengan judul, gambar, deskripsi, penulis, dan tanggal terbit.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita NY Times.',
        options: [
          { value: 'home', label: 'Home Page' },
          { value: 'world', label: 'World' },
          { value: 'us', label: 'US' },
          { value: 'politics', label: 'Politics' },
          { value: 'business', label: 'Business' },
          { value: 'technology', label: 'Technology' },
          { value: 'science', label: 'Science' },
          { value: 'health', label: 'Health' },
          { value: 'arts', label: 'Arts' },
          { value: 'opinion', label: 'Opinion' },
          { value: 'climate', label: 'Climate' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'home'
    }
  };
