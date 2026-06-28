import type { DocTopic } from '../../types';

export const bilibiliRoute: DocTopic = {
    id: 'bilibili',
    title: 'Bilibili Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/bilibili',
    pathTemplate: '/api/downloader/:slug',
    description: 'Unduh video dan episode anime dari Bilibili.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'URL video Bilibili.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
