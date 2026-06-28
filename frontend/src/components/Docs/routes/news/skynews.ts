import type { DocTopic } from '../../types';

export const skynewsRoute: DocTopic = {
    id: 'skynews',
    title: 'Sky News',
    category: 'News',
    method: 'POST',
    path: '/api/news/skynews',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita terbaru dari Sky News (news.sky.com) berdasarkan kategori. Mengembalikan hingga 20 artikel dengan judul, gambar beresolusi tinggi, dan deskripsi.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita Sky News.',
        options: [
          { value: 'home', label: 'Home' },
          { value: 'uk', label: 'UK' },
          { value: 'world', label: 'World' },
          { value: 'us', label: 'US' },
          { value: 'business', label: 'Business' },
          { value: 'politics', label: 'Politics' },
          { value: 'technology', label: 'Technology' },
          { value: 'entertainment', label: 'Entertainment' },
          { value: 'strange', label: 'Strange News' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'home'
    }
  };
