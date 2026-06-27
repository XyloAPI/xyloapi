import type { DocTopic } from '../../types';

export const cocofunRoute: DocTopic = {
    id: 'cocofun',
    title: 'CocoFun Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/cocofun',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download CocoFun videos in high quality.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'CocoFun share video URL.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
