import type { DocTopic } from '../../types';

export const capcutRoute: DocTopic = {
    id: 'capcut',
    title: 'CapCut Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/capcut',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download CapCut video templates without watermark in high quality.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the CapCut video URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
