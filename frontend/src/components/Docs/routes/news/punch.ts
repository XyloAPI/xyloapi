import type { DocTopic } from '../../types';

export const punchRoute: DocTopic = {
    id: 'punch',
    title: 'The Punch',
    category: 'News',
    method: 'POST',
    path: '/api/news/punch',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita terbaru, politik, olahraga, bisnis, dan metro dari The Punch (punchng.com) di Nigeria.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita The Punch.',
        options: [
          { value: 'latest', label: 'Latest News' },
          { value: 'featured', label: 'Featured Stories' },
          { value: 'news', label: 'General News' },
          { value: 'politics', label: 'Politics' },
          { value: 'sports', label: 'Sports' },
          { value: 'business', label: 'Business & Economy' },
          { value: 'metro', label: 'Metro Plus' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'latest'
    }
  };
