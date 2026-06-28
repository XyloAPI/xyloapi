import type { DocTopic } from '../../types';

export const pornhdRoute: DocTopic = {
    id: 'pornhd',
    title: 'PornHD / Faphouse Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/pornhd',
    pathTemplate: '/api/downloader/:slug',
    description: 'Unduh video dari PornHD dan Faphouse dalam format MP4 berkualitas tinggi.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'URL video PornHD atau Faphouse (contoh: https://faphouse.com/videos/shinji-x-asuka-eva-dGEu0b).' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
