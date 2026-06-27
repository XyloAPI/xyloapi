import type { DocTopic } from '../../types';

export const teraboxRoute: DocTopic = {
    id: 'terabox',
    title: 'Terabox Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/terabox',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download videos and files directly from Terabox links bypassing app lock limitations.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Terabox file URL (e.g. https://1024terabox.com/s/1etUwLqCoOeuWejxFNJF5xA).' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
