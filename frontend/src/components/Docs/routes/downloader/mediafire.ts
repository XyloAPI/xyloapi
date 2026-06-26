import type { DocTopic } from '../../types';

export const mediafireRoute: DocTopic = {
    id: 'mediafire',
    title: 'MediaFire Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/mediafire',
    pathTemplate: '/api/downloader/:slug',
    description: 'Generate direct high-speed download links from MediaFire file sharing URLs.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the MediaFire file URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
