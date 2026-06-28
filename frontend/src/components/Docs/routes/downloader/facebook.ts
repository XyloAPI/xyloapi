import type { DocTopic } from '../../types';

export const facebookRoute: DocTopic = {
    id: 'facebook',
    title: 'Facebook Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/facebook',
    pathTemplate: '/api/downloader/:slug',
    description: 'Unduh video dari postingan Facebook dalam kualitas HD atau SD.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'URL video publik Facebook.' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
