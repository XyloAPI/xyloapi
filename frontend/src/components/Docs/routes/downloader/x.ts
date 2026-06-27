import type { DocTopic } from '../../types';

export const xRoute: DocTopic = {
    id: 'x',
    title: 'Twitter / X Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/x',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download videos, images, and GIFs from Twitter / X posts.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'public Twitter/X post URL.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
