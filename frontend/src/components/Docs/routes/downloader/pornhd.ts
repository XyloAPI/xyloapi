import type { DocTopic } from '../../types';

export const pornhdRoute: DocTopic = {
    id: 'pornhd',
    title: 'PornHD / Faphouse Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/pornhd',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download PornHD and Faphouse videos in high quality MP4 format.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'PornHD or Faphouse URL (e.g. https://faphouse.com/videos/shinji-x-asuka-eva-dGEu0b).' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
