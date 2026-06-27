import type { DocTopic } from '../../types';

export const youtubeRoute: DocTopic = {
    id: 'youtube',
    title: 'YouTube Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/youtube',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download YouTube videos in high resolution with MP3 audio extraction.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Public YouTube video URL.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
