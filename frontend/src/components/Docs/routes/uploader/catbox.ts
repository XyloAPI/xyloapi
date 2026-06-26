import type { DocTopic } from '../../types';

export const catboxRoute: DocTopic = {
    id: 'catbox',
    title: 'Catbox Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/catbox',
    pathTemplate: '/api/uploader/:slug',
    description: 'Upload local image files or remote URLs directly to the Catbox.moe hosting platform.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Select local image file to upload or enter image URL' }
    ],
    payloadTemplate: {
      image: ''
    }
  };
