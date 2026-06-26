import type { DocTopic } from '../../types';

export const npmRoute: DocTopic = {
    id: 'npm',
    title: 'NPM Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/npm',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download tarball packages of Node modules directly from NPM Registry.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the NPM package name or URL (e.g. react or https://www.npmjs.com/package/react)' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
