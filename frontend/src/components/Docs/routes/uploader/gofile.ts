import type { DocTopic } from '../../types';

export const gofileRoute: DocTopic = {
    id: 'gofile',
    title: 'GoFile Uploader',
    category: 'File Uploaders',
    method: 'POST',
    path: '/api/uploader/gofile',
    pathTemplate: '/api/uploader/:slug',
    description: 'Upload any local file, image, video, or document directly to the GoFile file sharing platform.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Select local file to upload or enter file URL' }
    ],
    payloadTemplate: {
      image: ''
    }
  };
