import type { DocTopic } from '../../types';

export const sfileRoute: DocTopic = {
    id: 'sfile',
    title: 'Sfile.co Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/sfile',
    pathTemplate: '/api/downloader/:slug',
    description: 'Unduh file langsung dari sfile.co (dan sfile.mobi) dengan memotong waktu hitung mundur iklan.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'URL file sfile.co (contoh: https://sfile.co/agNixA1YkHq).' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
