import type { DocTopic } from '../../types';

export const npmRoute: DocTopic = {
    id: 'npm',
    title: 'NPM Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/npm',
    pathTemplate: '/api/downloader/:slug',
    description: 'Unduh paket tarball dari modul Node secara langsung melalui NPM Registry.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Nama paket atau URL NPM (contoh: react atau https://www.npmjs.com/package/react).' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
