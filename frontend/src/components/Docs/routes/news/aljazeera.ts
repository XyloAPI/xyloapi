import type { DocTopic } from '../../types';

export const aljazeeraRoute: DocTopic = {
    id: 'aljazeera',
    title: 'Al Jazeera',
    category: 'News',
    method: 'POST',
    path: '/api/news/aljazeera',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest news articles from Al Jazeera (aljazeera.com) by category. Returns up to 20 articles with title, image, description, and publish date.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select an Al Jazeera news category.',
        options: [
          { value: 'news', label: 'News' },
          { value: 'sport', label: 'Sport' },
          { value: 'economy', label: 'Economy' },
          { value: 'features', label: 'Features' },
          { value: 'opinion', label: 'Opinion' },
          { value: 'video', label: 'Video' },
          { value: 'liveblog', label: 'Live Blog' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'news'
    }
  };
