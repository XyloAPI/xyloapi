import type { DocTopic } from '../../types';

export const mediafireRoute: DocTopic = {
    id: 'mediafire',
    title: 'MediaFire Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/mediafire',
    pathTemplate: '/api/downloader/:slug',
    description: 'Hasilkan tautan unduh langsung berkecepatan tinggi dari URL file MediaFire.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'URL file MediaFire.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
