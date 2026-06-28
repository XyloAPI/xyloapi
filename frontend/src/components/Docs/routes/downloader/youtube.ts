import type { DocTopic } from '../../types';

export const youtubeRoute: DocTopic = {
    id: 'youtube',
    title: 'YouTube Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/youtube',
    pathTemplate: '/api/downloader/:slug',
    description: 'Unduh video YouTube dalam resolusi tinggi dan dengan opsi ekstraksi audio MP3.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'URL publik video YouTube.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
