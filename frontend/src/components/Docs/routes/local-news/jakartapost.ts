import type { DocTopic } from '../../types';

export const jakartapostRoute: DocTopic = {
    id: 'jakartapost',
    title: 'The Jakarta Post',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/jakartapost',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch latest English local news, business, opinion editorials, world affairs, culture, and sports updates from The Jakarta Post (thejakartapost.com). Returns up to 20 articles with title, link, description, publish date, source, and image content.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a Jakarta Post category.',
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
