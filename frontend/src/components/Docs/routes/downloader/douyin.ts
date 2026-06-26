import type { DocTopic } from '../../types';

export const douyinRoute: DocTopic = {
    id: 'douyin',
    title: 'Douyin Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/douyin',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download Douyin videos and photos in high quality without watermark.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the Douyin video/post URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
