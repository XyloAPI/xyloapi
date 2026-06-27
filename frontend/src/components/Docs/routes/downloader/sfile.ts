import type { DocTopic } from '../../types';

export const sfileRoute: DocTopic = {
    id: 'sfile',
    title: 'Sfile.co Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/sfile',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download files directly from sfile.co (and sfile.mobi) bypassing ad countdowns.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'sfile.co file URL (e.g. https://sfile.co/agNixA1YkHq).' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
