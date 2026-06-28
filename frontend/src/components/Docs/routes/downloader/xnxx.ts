import type { DocTopic } from '../../types';

export const xnxxRoute: DocTopic = {
    id: 'xnxx',
    title: 'XNXX Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/xnxx',
    pathTemplate: '/api/downloader/:slug',
    description: 'Unduh video XNXX secara langsung dalam format MP4 kualitas tinggi/rendah atau stream HLS.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'URL video XNXX (contoh: https://www.xnxx.com/video-1d8ujt96/asian_babe_has_some_fun).' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
