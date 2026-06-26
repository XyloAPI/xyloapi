import type { DocTopic } from '../../types';

export const snackvideoRoute: DocTopic = {
    id: 'snackvideo',
    title: 'SnackVideo Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/snackvideo',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download SnackVideo videos without watermark, with cover thumbnail and audio stream.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the SnackVideo URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
