import type { DocTopic } from '../../types';

export const forbesRoute: DocTopic = {
    id: 'forbes',
    title: 'Forbes',
    category: 'News',
    method: 'POST',
    path: '/api/news/forbes',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch global business, investing, technology, and leadership news from Forbes (forbes.com). Combines direct high-fidelity parsing of official Forbes RSS feeds (for top, business, and innovation sections) with targeted Google News query fallbacks for secondary sections.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a Forbes news section.',
        options: [
          { value: 'top', label: 'Most Popular' },
          { value: 'business', label: 'Business' },
          { value: 'innovation', label: 'Innovation' },
          { value: 'investing', label: 'Investing & Money' },
          { value: 'leadership', label: 'Leadership & Careers' },
          { value: 'lifestyle', label: 'Lifestyle & Travel' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
