import type { DocTopic } from '../../types';

export const pinterestRoute: DocTopic = {
    id: 'pinterest',
    title: 'Pinterest Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/pinterest',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download high-quality images and video streams directly from Pinterest boards and pins.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Pinterest pin share URL (e.g. https://www.pinterest.com/pin/123456/ or short URL https://pin.it/xxxxx).' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
