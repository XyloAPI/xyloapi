import type { DocTopic } from '../../types';

export const dwRoute: DocTopic = {
    id: 'dw',
    title: 'DW (Deutsche Welle)',
    category: 'News',
    method: 'POST',
    path: '/api/news/dw',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest news from DW - Deutsche Welle (dw.com) by category. Returns up to 20 articles with title, image, description, and publish date — powered by official DW RSS feeds.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a DW news category.',
        options: [
          { value: 'top', label: 'Top News' },
          { value: 'all', label: 'All News' },
          { value: 'world', label: 'World' },
          { value: 'africa', label: 'Africa' },
          { value: 'science', label: 'Science' },
          { value: 'sports', label: 'Sports' },
          { value: 'environment', label: 'Environment' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
