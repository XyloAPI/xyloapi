import type { DocTopic } from '../../types';

export const teraboxRoute: DocTopic = {
    id: 'terabox',
    title: 'Terabox Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/terabox',
    pathTemplate: '/api/downloader/:slug',
    description: 'Unduh video dan file secara langsung dari tautan Terabox tanpa batasan dari aplikasi.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'URL file Terabox (contoh: https://1024terabox.com/s/1etUwLqCoOeuWejxFNJF5xA).' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
