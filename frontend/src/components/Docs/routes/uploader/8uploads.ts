import type { DocTopic } from '../../types';

export const n_8uploadsRoute: DocTopic = {
    id: '8uploads',
    title: '8uploads Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/8uploads',
    pathTemplate: '/api/uploader/:slug',
    description: 'Upload local image files or remote URLs directly to the 8upload.com hosting platform.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Select local image file to upload or enter image URL' }
    ],
    payloadTemplate: {
      image: ''
    }
  };
