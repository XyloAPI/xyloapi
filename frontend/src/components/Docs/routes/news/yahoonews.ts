import type { DocTopic } from '../../types';

export const yahoonewsRoute: DocTopic = {
    id: 'yahoonews',
    title: 'Yahoo News',
    category: 'News',
    method: 'POST',
    path: '/api/news/yahoonews',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest news and headlines from Yahoo News (yahoo.com/news). Returns up to 20 articles with title, image, description, source, and publish date — resolved dynamically from Yahoo News categories and article pages.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a Yahoo News section.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'us', label: 'U.S. News' },
          { value: 'world', label: 'World News' },
          { value: 'politics', label: 'Politics' },
          { value: 'science', label: 'Science' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
