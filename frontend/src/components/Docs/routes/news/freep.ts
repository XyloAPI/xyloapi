import type { DocTopic } from '../../types';

export const freepRoute: DocTopic = {
    id: 'freep',
    title: 'Detroit Free Press',
    category: 'News',
    method: 'POST',
    path: '/api/news/detroit',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch local, sports, and business news from the Detroit Free Press (freep.com). Returns up to 20 articles with title, link, description, source, and publish date — utilizing Google News RSS query fallback to bypass Akamai Bot Manager and Cloudflare WAF protections.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a Detroit Free Press section.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'news', label: 'Detroit & Local News' },
          { value: 'sports', label: 'Sports' },
          { value: 'business', label: 'Business & Autos' },
          { value: 'entertainment', label: 'Entertainment & Life' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
