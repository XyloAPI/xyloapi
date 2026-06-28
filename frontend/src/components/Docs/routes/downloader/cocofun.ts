import type { DocTopic } from '../../types';

export const cocofunRoute: DocTopic = {
    id: 'cocofun',
    title: 'CocoFun Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/cocofun',
    pathTemplate: '/api/downloader/:slug',
    description: 'Unduh video CocoFun dengan kualitas tinggi.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'URL video CocoFun.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
