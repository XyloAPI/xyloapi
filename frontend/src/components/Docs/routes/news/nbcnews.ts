import type { DocTopic } from '../../types';

export const nbcnewsRoute: DocTopic = {
    id: 'nbcnews',
    title: 'NBC News',
    category: 'News',
    method: 'POST',
    path: '/api/news/nbcnews',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest news and headlines from NBC News (nbcnews.com). Returns up to 20 articles with title, link, description, publish date, source, and thumbnail image URL resolved directly from official NBC News RSS feeds.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select an NBC News section.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'us', label: 'U.S. News' },
          { value: 'world', label: 'World News' },
          { value: 'politics', label: 'Politics' },
          { value: 'business', label: 'Business' },
          { value: 'health', label: 'Health' },
          { value: 'tech', label: 'Technology' },
          { value: 'science', label: 'Science' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
