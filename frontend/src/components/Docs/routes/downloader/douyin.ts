import type { DocTopic } from '../../types';

export const douyinRoute: DocTopic = {
    id: 'douyin',
    title: 'Douyin Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/douyin',
    pathTemplate: '/api/downloader/:slug',
    description: 'Unduh video dan foto dari Douyin dengan kualitas tinggi tanpa watermark.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'URL video/postingan Douyin.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
