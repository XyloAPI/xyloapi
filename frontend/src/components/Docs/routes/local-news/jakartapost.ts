import type { DocTopic } from '../../types';

export const jakartapostRoute: DocTopic = {
    id: 'jakartapost',
    title: 'The Jakarta Post',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/jakartapost',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita lokal berbahasa Inggris terbaru, bisnis, opini editorial, urusan dunia, budaya, dan olahraga dari The Jakarta Post (thejakartapost.com).',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita Jakarta Post.',
        options: [
          { value: 'indonesia', label: 'Indonesia' },
          { value: 'business', label: 'Business' },
          { value: 'opinion', label: 'Opinion' },
          { value: 'world', label: 'World' },
          { value: 'culture', label: 'Culture' },
          { value: 'sports', label: 'Sports' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'indonesia'
    }
  };
