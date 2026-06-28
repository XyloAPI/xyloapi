import type { DocTopic } from '../../types';

export const wmtvRoute: DocTopic = {
    id: 'wmtv',
    title: 'WMTV 15 News',
    category: 'News',
    method: 'POST',
    path: '/api/news/wmtv',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil pembaruan lokal, cuaca, dan olahraga dari WMTV 15 News (wmtv15news.com) menggunakan fallback kueri Google News.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita WMTV 15 News.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'news', label: 'Local News' },
          { value: 'weather', label: 'Weather' },
          { value: 'sports', label: 'Sports' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
