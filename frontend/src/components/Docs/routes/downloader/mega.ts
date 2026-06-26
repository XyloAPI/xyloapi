import type { DocTopic } from '../../types';

export const megaRoute: DocTopic = {
    id: 'mega',
    title: 'MEGA Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/mega',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download and decrypt public files hosted on MEGA.nz directly to stream and save.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the MEGA.nz file share URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
