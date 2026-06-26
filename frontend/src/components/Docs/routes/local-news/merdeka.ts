import type { DocTopic } from '../../types';

export const merdekaRoute: DocTopic = {
    id: 'merdeka',
    title: 'Merdeka News',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/merdeka',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch latest local news, politics, economy, celebrities, trending topics, and regional updates from Merdeka News (merdeka.com). Returns up to 20 articles with title, link, description, publish date, source, and image content.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a Merdeka News category.',
        options: [
          { value: 'news', label: 'News' },
          { value: 'politik', label: 'Politik' },
          { value: 'ekonomi', label: 'Ekonomi' },
          { value: 'artis', label: 'Artis' },
          { value: 'trending', label: 'Trending' },
          { value: 'tekno', label: 'Tekno' },
          { value: 'otomotif', label: 'Otomotif' },
          { value: 'dunia', label: 'Dunia' },
          { value: 'lifestyle', label: 'Lifestyle' },
          { value: 'sehat', label: 'Sehat' },
          { value: 'sport', label: 'Sport' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'news'
    }
  };
