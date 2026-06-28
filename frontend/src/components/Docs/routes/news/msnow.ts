import type { DocTopic } from '../../types';

export const msnowRoute: DocTopic = {
    id: 'msnow',
    title: 'MS NOW (MSNBC)',
    category: 'News',
    method: 'POST',
    path: '/api/news/msnow',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita terbaru dari MS NOW / MSNBC (ms.now) berdasarkan kategori. Mengembalikan hingga 20 artikel dengan judul, gambar, deskripsi, penulis, dan tanggal terbit.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita MS NOW.',
        options: [
          { value: 'latest', label: 'Latest' },
          { value: 'news', label: 'News' },
          { value: 'politics', label: 'Politics' },
          { value: 'opinion', label: 'Opinion' },
          { value: 'world', label: 'World' },
          { value: 'business', label: 'Business' },
          { value: 'health', label: 'Health' },
          { value: 'culture', label: 'Culture' },
          { value: 'sports', label: 'Sports' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'news'
    }
  };
