import type { DocTopic } from '../../types';

export const snackvideoRoute: DocTopic = {
    id: 'snackvideo',
    title: 'SnackVideo Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/snackvideo',
    pathTemplate: '/api/downloader/:slug',
    description: 'Unduh video SnackVideo tanpa watermark, lengkap dengan thumbnail sampul dan audio.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'URL video SnackVideo.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
