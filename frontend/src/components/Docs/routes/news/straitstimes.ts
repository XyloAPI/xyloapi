import type { DocTopic } from '../../types';

export const straitstimesRoute: DocTopic = {
    id: 'straitstimes',
    title: 'The Straits Times',
    category: 'News',
    method: 'POST',
    path: '/api/news/straitstimes',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita utama dan artikel terbaru dari The Straits Times (straitstimes.com) berdasarkan kategori.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita Straits Times.',
        options: [
          { value: 'singapore', label: 'Singapore' },
          { value: 'asia', label: 'Asia' },
          { value: 'world', label: 'World' },
          { value: 'business', label: 'Business' },
          { value: 'sport', label: 'Sport' },
          { value: 'life', label: 'Life & Style' },
          { value: 'opinion', label: 'Opinion' },
          { value: 'multimedia', label: 'Multimedia' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'singapore'
    }
  };
