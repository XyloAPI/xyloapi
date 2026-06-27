import type { DocTopic } from '../../types';

export const scribdRoute: DocTopic = {
    id: 'scribd',
    title: 'Scribd Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/scribd',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download high-quality original document page images directly from Scribd.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Scribd document URL or embed URL (e.g. https://www.scribd.com/document/...).' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
