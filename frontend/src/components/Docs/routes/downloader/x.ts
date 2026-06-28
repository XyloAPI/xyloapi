import type { DocTopic } from '../../types';

export const xRoute: DocTopic = {
    id: 'x',
    title: 'Twitter / X Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/x',
    pathTemplate: '/api/downloader/:slug',
    description: 'Unduh video, gambar, dan GIF dari postingan Twitter / X.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'URL publik postingan Twitter / X.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
