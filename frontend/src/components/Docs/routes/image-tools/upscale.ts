import type { DocTopic } from '../../types';

export const upscaleRoute: DocTopic = {
    id: 'upscale',
    title: 'Image Upscaler',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/upscale',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Perbesar resolusi (upscale) dan perbaiki gambar berkualitas rendah menggunakan AI Super Resolution.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diproses.' }
    ],
    payloadTemplate: {
      image: ''
    }
  };
