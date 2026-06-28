import type { DocTopic } from '../../types';

export const independentRoute: DocTopic = {
    id: 'independent',
    title: 'The Independent',
    category: 'News',
    method: 'POST',
    path: '/api/news/independent',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita umum, politik, bisnis, olahraga, tekno, dan perjalanan dari The Independent (independent.co.uk). Mengembalikan hingga 20 artikel langsung dari feed RSS resmi.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita The Independent.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'news', label: 'General News' },
          { value: 'uk', label: 'UK News' },
          { value: 'world', label: 'World News' },
          { value: 'politics', label: 'Politics' },
          { value: 'business', label: 'Business & Money' },
          { value: 'sport', label: 'Sport' },
          { value: 'tech', label: 'Tech' },
          { value: 'travel', label: 'Travel' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
