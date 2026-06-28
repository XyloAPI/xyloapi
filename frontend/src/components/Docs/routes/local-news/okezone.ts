import type { DocTopic } from '../../types';

export const okezoneRoute: DocTopic = {
    id: 'okezone',
    title: 'Okezone',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/okezone',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita umum, tekno, dan olahraga terbaru dari Okezone (okezone.com) di Indonesia melalui sindikasi feed RSS.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita Okezone.',
        options: [
          { value: 'breaking', label: 'Okezone Breaking News' },
          { value: 'news', label: 'Okezone News' },
          { value: 'international', label: 'Okezone Internasional' },
          { value: 'lifestyle', label: 'Okezone Lifestyle' },
          { value: 'techno', label: 'Okezone Techno' },
          { value: 'sports', label: 'Okezone Sports' },
          { value: 'economy', label: 'Okezone Economy' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'breaking'
    }
  };
