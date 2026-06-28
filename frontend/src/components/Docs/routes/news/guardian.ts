import type { DocTopic } from '../../types';

export const guardianRoute: DocTopic = {
    id: 'guardian',
    title: 'The Guardian',
    category: 'News',
    method: 'POST',
    path: '/api/news/guardian',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita terbaru dari The Guardian (theguardian.com) berdasarkan kategori. Mengembalikan hingga 25 artikel dengan judul, gambar beresolusi tinggi, deskripsi, dan tanggal terbit.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita The Guardian.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'world', label: 'World' },
          { value: 'us', label: 'US News' },
          { value: 'uk', label: 'UK News' },
          { value: 'politics', label: 'Politics' },
          { value: 'business', label: 'Business' },
          { value: 'technology', label: 'Technology' },
          { value: 'science', label: 'Science' },
          { value: 'environment', label: 'Environment' },
          { value: 'sport', label: 'Sport' },
          { value: 'culture', label: 'Culture' },
          { value: 'society', label: 'Society' },
          { value: 'opinion', label: 'Opinion' },
          { value: 'lifestyle', label: 'Life & Style' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'world'
    }
  };
