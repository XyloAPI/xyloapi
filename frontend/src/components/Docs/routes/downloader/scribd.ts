import type { DocTopic } from '../../types';

export const scribdRoute: DocTopic = {
    id: 'scribd',
    title: 'Scribd Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/scribd',
    pathTemplate: '/api/downloader/:slug',
    description: 'Unduh gambar halaman dokumen orisinal berkualitas tinggi langsung dari Scribd.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'URL dokumen atau embed Scribd (contoh: https://www.scribd.com/document/...).' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
