import type { DocTopic } from '../../types';

export const bilibiliRoute: DocTopic = {
    id: 'bilibili',
    title: 'Bilibili Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/bilibili',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download videos from Bilibili posts and anime episodes.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Bilibili video URL.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
