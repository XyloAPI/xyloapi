import type { DocTopic } from '../../types';

export const megaRoute: DocTopic = {
    id: 'mega',
    title: 'MEGA Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/mega',
    pathTemplate: '/api/downloader/:slug',
    description: 'Unduh dan dekripsi file publik dari MEGA.nz secara langsung untuk streaming dan penyimpanan.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'URL file MEGA.nz.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
