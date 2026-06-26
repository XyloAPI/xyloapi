import type { DocTopic } from '../../types';

export const xnxxRoute: DocTopic = {
    id: 'xnxx',
    title: 'XNXX Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/xnxx',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download XNXX videos directly in high/low quality MP4 formats or HLS streams.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the XNXX video URL (e.g. https://www.xnxx.com/video-1d8ujt96/asian_babe_has_some_fun)' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
