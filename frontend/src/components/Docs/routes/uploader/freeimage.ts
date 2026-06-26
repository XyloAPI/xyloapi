import type { DocTopic } from '../../types';

export const freeimageRoute: DocTopic = {
    id: 'freeimage',
    title: 'FreeImage Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/freeimage',
    pathTemplate: '/api/uploader/:slug',
    description: 'Upload local image files or remote URLs directly to the FreeImage.host hosting platform.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Select local image file to upload or enter image URL' }
    ],
    payloadTemplate: {
      image: ''
    }
  };
