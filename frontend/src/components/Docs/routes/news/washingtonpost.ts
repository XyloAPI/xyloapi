import type { DocTopic } from '../../types';

export const washingtonpostRoute: DocTopic = {
    id: 'washingtonpost',
    title: 'The Washington Post',
    category: 'News',
    method: 'POST',
    path: '/api/news/washingtonpost',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita utama terbaru dari The Washington Post (washingtonpost.com) via Google News. Gambar tidak tersedia karena paywall.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita Washington Post.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'world', label: 'World' },
          { value: 'politics', label: 'Politics' },
          { value: 'us', label: 'US News' },
          { value: 'business', label: 'Business' },
          { value: 'technology', label: 'Technology' },
          { value: 'health', label: 'Health & Science' },
          { value: 'climate', label: 'Climate' },
          { value: 'sport', label: 'Sport' },
          { value: 'entertainment', label: 'Entertainment' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
