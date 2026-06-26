import type { DocTopic } from '../../types';

export const nasanewsRoute: DocTopic = {
    id: 'nasanews',
    title: 'NASA News',
    category: 'News',
    method: 'POST',
    path: '/api/news/nasa',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest science news, press releases, and featured stories directly from NASA (nasa.gov). Integrated directly with the official NASA WordPress REST API, delivering high-resolution images, clean HTML excerpts, and precise publication dates.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a NASA News category.',
        options: [
          { value: 'releases', label: 'News Releases' },
          { value: 'news', label: 'General News' },
          { value: 'featured', label: 'Featured News' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'releases'
    }
  };
