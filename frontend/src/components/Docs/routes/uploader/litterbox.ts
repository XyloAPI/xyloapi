import type { DocTopic } from '../../types';

export const litterboxRoute: DocTopic = {
    id: 'litterbox',
    title: 'Litterbox Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/litterbox',
    pathTemplate: '/api/uploader/:slug',
    description: 'Upload temporary files up to 1GB directly to the Litterbox.catbox.moe platform (expires in 24h).',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Select local image file to upload or enter image URL' }
    ],
    payloadTemplate: {
      image: ''
    }
  };
