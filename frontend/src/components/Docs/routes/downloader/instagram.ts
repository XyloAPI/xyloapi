import type { DocTopic } from '../../types';

export const instagramRoute: DocTopic = {
    id: 'instagram',
    title: 'Instagram Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/instagram',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download Instagram videos, reels, photos, and carousel slides.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the public Instagram post/reel URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
