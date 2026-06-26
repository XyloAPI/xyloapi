import type { DocTopic } from '../../types';

export const straitstimesRoute: DocTopic = {
    id: 'straitstimes',
    title: 'The Straits Times',
    category: 'News',
    method: 'POST',
    path: '/api/news/straitstimes',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest news headlines and articles from The Straits Times (straitstimes.com) by category. Returns up to 25 articles with title, link, excerpt, and publish date.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a news category to fetch articles from.',
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
