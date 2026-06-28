import type { DocTopic } from '../../types';

export const pinterestRoute: DocTopic = {
    id: 'pinterest',
    title: 'Pinterest Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/pinterest',
    pathTemplate: '/api/downloader/:slug',
    description: 'Unduh gambar dan video berkualitas tinggi secara langsung dari pin dan board Pinterest.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'URL pin Pinterest (contoh: https://www.pinterest.com/pin/123456/ atau short URL https://pin.it/xxxxx).' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
