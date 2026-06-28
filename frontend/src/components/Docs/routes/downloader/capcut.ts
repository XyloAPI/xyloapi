import type { DocTopic } from '../../types';

export const capcutRoute: DocTopic = {
    id: 'capcut',
    title: 'CapCut Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/capcut',
    pathTemplate: '/api/downloader/:slug',
    description: 'Unduh video template CapCut tanpa watermark dengan kualitas tinggi.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'URL video CapCut.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
