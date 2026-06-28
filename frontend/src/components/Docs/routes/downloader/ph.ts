import type { DocTopic } from '../../types';

export const phRoute: DocTopic = {
    id: 'ph',
    title: 'Pornhub Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/ph',
    pathTemplate: '/api/downloader/:slug',
    description: 'Unduh video Pornhub dalam berbagai resolusi (240p hingga 1080p). Mendukung unduhan MP4 langsung dan format stream HLS.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'URL video Pornhub (contoh: https://www.pornhub.com/view_video.php?viewkey=6a281627061fa).' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
