import type { DocTopic } from '../../types';

export const instagramRoute: DocTopic = {
    id: 'instagram',
    title: 'Instagram Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/instagram',
    pathTemplate: '/api/downloader/:slug',
    description: 'Unduh video, reels, foto, dan slide carousel dari Instagram.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'URL publik postingan atau reels Instagram.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
