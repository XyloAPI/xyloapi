import type { DocTopic } from '../../types';

export const youtubeRoute: DocTopic = {
    id: 'youtube',
    title: 'YouTube Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/youtube',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download YouTube videos in high resuolution and MP3 audios.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the public YouTube video URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
