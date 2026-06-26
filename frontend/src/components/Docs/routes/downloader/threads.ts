import type { DocTopic } from '../../types';

export const threadsRoute: DocTopic = {
    id: 'threads',
    title: 'Threads Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/threads',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download videos, images, and carousels from Threads posts.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the public Threads post URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
