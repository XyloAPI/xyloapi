import type { DocTopic } from '../../types';

export const independentRoute: DocTopic = {
    id: 'independent',
    title: 'The Independent',
    category: 'News',
    method: 'POST',
    path: '/api/news/independent',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch general news, politics, business, sport, tech, and travel updates from The Independent (independent.co.uk). Returns up to 20 articles with title, link, description, publish date, source, and media content directly from their official RSS feeds.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a section from The Independent.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'news', label: 'General News' },
          { value: 'uk', label: 'UK News' },
          { value: 'world', label: 'World News' },
          { value: 'politics', label: 'Politics' },
          { value: 'business', label: 'Business & Money' },
          { value: 'sport', label: 'Sport' },
          { value: 'tech', label: 'Tech' },
          { value: 'travel', label: 'Travel' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
