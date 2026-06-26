import type { DocTopic } from '../../types';

export const imgbbRoute: DocTopic = {
    id: 'imgbb',
    title: 'ImgBB Uploader',
    category: 'Media Uploaders',
    method: 'POST',
    path: '/api/uploader/imgbb',
    pathTemplate: '/api/uploader/:slug',
    description: 'Upload local image files or remote URLs directly to the ImgBB hosting platform.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Select local image file to upload or enter image URL' }
    ],
    payloadTemplate: {
      image: ''
    }
  };
