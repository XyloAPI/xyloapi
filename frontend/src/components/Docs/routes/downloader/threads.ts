import type { DocTopic } from '../../types';

export const threadsRoute: DocTopic = {
    id: 'threads',
    title: 'Threads Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/threads',
    pathTemplate: '/api/downloader/:slug',
    description: 'Unduh video, gambar, dan gambar carousel dari postingan Threads.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'URL publik postingan Threads.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
