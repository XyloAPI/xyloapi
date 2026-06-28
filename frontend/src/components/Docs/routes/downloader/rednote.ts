import type { DocTopic } from '../../types';

export const rednoteRoute: DocTopic = {
    id: 'rednote',
    title: 'RedNote Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/rednote',
    pathTemplate: '/api/downloader/:slug',
    description: 'Unduh gambar dan video berkualitas tinggi langsung dari postingan Xiaohongshu (RedNote).',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'URL tautan Xiaohongshu/RedNote (contoh: https://www.xiaohongshu.com/discovery/item/...).' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
