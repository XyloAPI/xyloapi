import type { DocTopic } from '../../types';

export const tiktokRoute: DocTopic = {
    id: 'tiktok',
    title: 'TikTok Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/tiktok',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download TikTok videos without watermark, with watermark, or as high-quality MP3 audio files.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'public TikTok video URL.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
