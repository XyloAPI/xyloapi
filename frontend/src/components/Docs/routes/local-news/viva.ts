import type { DocTopic } from '../../types';

export const vivaRoute: DocTopic = {
    id: 'viva',
    title: 'VIVA News',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/viva',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch latest local news, sports, business, and lifestyle updates from VIVA News (viva.co.id) in Indonesia. Returns up to 20 articles with title, link, description, publish date, source, and image content.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a VIVA News category.',
        options: [
          { value: 'news', label: 'Berita Terbaru (All)' },
          { value: 'nasional', label: 'Nasional' },
          { value: 'internasional', label: 'Internasional' },
          { value: 'metro', label: 'Metro' },
          { value: 'bisnis', label: 'Bisnis' },
          { value: 'bola', label: 'Bola' },
          { value: 'sport', label: 'Sport' },
          { value: 'otomotif', label: 'Otomotif' },
          { value: 'lifestyle', label: 'Lifestyle' },
          { value: 'showbiz', label: 'Showbiz' },
          { value: 'digital', label: 'Digital' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'news'
    }
  };
