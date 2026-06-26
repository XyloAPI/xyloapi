import type { DocTopic } from '../../types';

export const uguuRoute: DocTopic = {
    id: 'uguu',
    title: 'Uguu Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/uguu',
    pathTemplate: '/api/uploader/:slug',
    description: 'Upload temporary files up to 100MB directly to the Uguu.se platform (expires in 24h).',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Select local image file to upload or enter image URL' }
    ],
    payloadTemplate: {
      image: ''
    }
  };
