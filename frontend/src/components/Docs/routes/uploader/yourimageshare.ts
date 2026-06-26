import type { DocTopic } from '../../types';

export const yourimageshareRoute: DocTopic = {
    id: 'yourimageshare',
    title: 'YourImageShare Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/yourimageshare',
    pathTemplate: '/api/uploader/:slug',
    description: 'Upload local image files or remote URLs directly to YourImageShare platform.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Select local image file to upload or enter image URL' }
    ],
    payloadTemplate: {
      image: ''
    }
  };
