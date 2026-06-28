import type { DocTopic } from '../../types';

export const youtube_communityRoute: DocTopic = {
    id: 'youtube-community',
    title: 'YouTube Community Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/youtube-community',
    pathTemplate: '/api/downloader/:slug',
    description: 'Unduh gambar dari postingan komunitas YouTube dalam kualitas tinggi.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'URL postingan Komunitas YouTube.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
