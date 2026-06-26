import type { DocTopic } from '../../types';

export const wmtvRoute: DocTopic = {
    id: 'wmtv',
    title: 'WMTV 15 News',
    category: 'News',
    method: 'POST',
    path: '/api/news/wmtv',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch local, weather, and sports updates from WMTV 15 News (wmtv15news.com). Returns up to 20 articles with title, link, description, source, and publish date — utilizing Google News RSS query fallback to fetch real-time news updates dynamically.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a WMTV news section.',
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
