import type { DocTopic } from '../../types';

export const bbcRoute: DocTopic = {
    id: 'bbc',
    title: 'BBC News',
    category: 'News',
    method: 'POST',
    path: '/api/news/bbc',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita utama dan artikel terbaru dari BBC News (bbc.com) berdasarkan kategori. Mengembalikan hingga 25 artikel dengan judul, gambar, deskripsi, dan tanggal terbit - didukung oleh feed RSS resmi BBC.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita BBC News.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'world', label: 'World' },
          { value: 'uk', label: 'UK' },
          { value: 'business', label: 'Business' },
          { value: 'politics', label: 'Politics' },
          { value: 'technology', label: 'Technology' },
          { value: 'science', label: 'Science & Environment' },
          { value: 'health', label: 'Health' },
          { value: 'entertainment', label: 'Entertainment & Arts' },
          { value: 'sport', label: 'Sport' },
          { value: 'asia', label: 'Asia' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
