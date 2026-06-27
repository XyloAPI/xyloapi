import type { DocTopic } from '../../types';

export const rednoteRoute: DocTopic = {
    id: 'rednote',
    title: 'RedNote Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/rednote',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download high-quality images and videos directly from Xiaohongshu (RedNote) posts.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Xiaohongshu/RedNote share URL (e.g. https://www.xiaohongshu.com/discovery/item/...).' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
