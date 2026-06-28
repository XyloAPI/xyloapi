import type { DocTopic } from '../../types';

export const githubRoute: DocTopic = {
    id: 'github',
    title: 'GitHub Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/github',
    pathTemplate: '/api/downloader/:slug',
    description: 'Unduh repositori, rilis, aset rilis, branch, file tunggal, atau folder langsung dari GitHub.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'URL Repositori, Rilis, File, atau Folder GitHub.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
