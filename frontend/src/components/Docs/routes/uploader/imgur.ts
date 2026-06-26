import type { DocTopic } from '../../types';

export const imgurRoute: DocTopic = {
    id: 'imgur',
    title: 'Imgur Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/imgur',
    pathTemplate: '/api/uploader/:slug',
    description: 'Upload local image files or remote URLs directly to the Imgur CDN.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Select local image file to upload or enter image URL' }
    ],
    payloadTemplate: {
      image: ''
    }
  };
