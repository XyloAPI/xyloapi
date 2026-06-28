import type { DocTopic } from '../../types';

export const forbesRoute: DocTopic = {
    id: 'forbes',
    title: 'Forbes',
    category: 'News',
    method: 'POST',
    path: '/api/news/forbes',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita bisnis global, investasi, teknologi, dan kepemimpinan dari Forbes (forbes.com). Menggabungkan parsing feed RSS resmi dan pencarian fallback Google News.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita Forbes.',
        options: [
          { value: 'top', label: 'Most Popular' },
          { value: 'business', label: 'Business' },
          { value: 'innovation', label: 'Innovation' },
          { value: 'investing', label: 'Investing & Money' },
          { value: 'leadership', label: 'Leadership & Careers' },
          { value: 'lifestyle', label: 'Lifestyle & Travel' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
