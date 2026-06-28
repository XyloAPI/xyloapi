import type { DocTopic } from '../../types';

export const usatodayRoute: DocTopic = {
    id: 'usatoday',
    title: 'USA Today',
    category: 'News',
    method: 'POST',
    path: '/api/news/usatoday',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita nasional, politik, olahraga, dan hiburan dari USA Today (usatoday.com) dengan memindai daftar artikel real-time secara dinamis.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita USA Today.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'national', label: 'National News' },
          { value: 'politics', label: 'Politics' },
          { value: 'world', label: 'World News' },
          { value: 'sports', label: 'Sports' },
          { value: 'entertainment', label: 'Entertainment' },
          { value: 'business', label: 'Business & Money' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
