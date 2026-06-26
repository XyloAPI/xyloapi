import type { DocTopic } from '../../types';

export const massliveRoute: DocTopic = {
    id: 'masslive',
    title: 'MassLive',
    category: 'News',
    method: 'POST',
    path: '/api/news/masslive',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch real-time news, sports, politics, and business updates from MassLive (masslive.com). Parses official outbound RSS feeds directly, extracting high-resolution images, clean descriptions, and detailed publish dates.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a MassLive news section.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'news', label: 'Local News' },
          { value: 'sports', label: 'Sports' },
          { value: 'politics', label: 'Politics' },
          { value: 'business', label: 'Business' },
          { value: 'entertainment', label: 'Entertainment' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
