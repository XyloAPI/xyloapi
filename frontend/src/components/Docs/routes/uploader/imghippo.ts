import type { DocTopic } from '../../types';

export const imghippoRoute: DocTopic = {
    id: 'imghippo',
    title: 'ImgHippo Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/imghippo',
    pathTemplate: '/api/uploader/:slug',
    description: 'Upload local image files or remote URLs directly to the ImgHippo hosting platform.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Select local image file to upload or enter image URL' }
    ],
    payloadTemplate: {
      image: ''
    }
  };
