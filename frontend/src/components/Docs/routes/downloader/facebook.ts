import type { DocTopic } from '../../types';

export const facebookRoute: DocTopic = {
    id: 'facebook',
    title: 'Facebook Downloader',
    category: 'Downloader',
    method: 'POST',
    path: '/api/downloader/facebook',
    pathTemplate: '/api/downloader/:slug',
    description: 'Download videos from Facebook posts in HD or SD quality.',
    parameters: [
      { name: 'url', type: 'text', required: true, desc: 'Enter the public Facebook video URL' }
    ],
    payloadTemplate: {
      url: ''
    }
  };
