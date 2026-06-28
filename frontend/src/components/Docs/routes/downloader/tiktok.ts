import type { DocTopic } from '../../types';

export const tiktokRoute: DocTopic = {
    id: 'tiktok',
    title: 'TikTok Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/tiktok',
    pathTemplate: '/api/downloader/:slug',
    description: 'Unduh video TikTok tanpa watermark, dengan watermark, atau sebagai file audio MP3 berkualitas tinggi.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'URL publik video TikTok.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
