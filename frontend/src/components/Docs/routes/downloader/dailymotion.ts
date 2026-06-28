import type { DocTopic } from '../../types';

export const dailymotionRoute: DocTopic = {
    id: 'dailymotion',
    title: 'Dailymotion Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/dailymotion',
    pathTemplate: '/api/downloader/:slug',
    description: 'Unduh video Dailymotion dalam berbagai resolusi (360p hingga 1080p).',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'URL video Dailymotion (contoh: https://www.dailymotion.com/video/xael6ni).' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
