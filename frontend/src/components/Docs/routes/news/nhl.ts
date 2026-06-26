import type { DocTopic } from '../../types';

export const nhlRoute: DocTopic = {
    id: 'nhl',
    title: 'NHL News',
    category: 'News',
    method: 'POST',
    path: '/api/news/nhl',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest news and stories from the NHL (nhl.com). Returns up to 20 articles with title, 16:9 image, summary, author, tags, and publish date — powered by the official NHL D3 content API.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select NHL news scope.',
        options: [
          { value: 'nhl', label: 'NHL News (league-wide)' },
          { value: 'all', label: 'All Stories (includes team content)' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'nhl'
    }
  };
