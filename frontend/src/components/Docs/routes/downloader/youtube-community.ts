import type { DocTopic } from '../../types';

export const youtube_communityRoute: DocTopic = {
    id: 'youtube-community',
    title: 'YouTube Community Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/youtube-community',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download images from YouTube community posts in high quality.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the YouTube Community Post URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
