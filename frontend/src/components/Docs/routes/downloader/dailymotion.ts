import type { DocTopic } from '../../types';

export const dailymotionRoute: DocTopic = {
    id: 'dailymotion',
    title: 'Dailymotion Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/dailymotion',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download Dailymotion videos in multiple resolutions (360p up to 1080p).',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the Dailymotion video URL (e.g. https://www.dailymotion.com/video/xael6ni)' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
