import type { DocTopic } from '../../types';

export const bbcRoute: DocTopic = {
    id: 'bbc',
    title: 'BBC News',
    category: 'News',
    method: 'POST',
    path: '/api/news/bbc',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest news headlines and articles from BBC News (bbc.com) by category. Returns up to 25 articles with title, image, description, and publish date — powered by official BBC RSS feeds.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a BBC news category.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'world', label: 'World' },
          { value: 'uk', label: 'UK' },
          { value: 'business', label: 'Business' },
          { value: 'politics', label: 'Politics' },
          { value: 'technology', label: 'Technology' },
          { value: 'science', label: 'Science & Environment' },
          { value: 'health', label: 'Health' },
          { value: 'entertainment', label: 'Entertainment & Arts' },
          { value: 'sport', label: 'Sport' },
          { value: 'asia', label: 'Asia' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
