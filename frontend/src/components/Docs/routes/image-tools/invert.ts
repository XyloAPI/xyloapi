import type { DocTopic } from '../../types';

export const invertRoute: DocTopic = {
    id: 'invert',
    title: 'Invert Colors',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/invert',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Balikkan (invert) warna gambar untuk menciptakan efek foto negatif yang mencolok.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diproses.' }
    ],
    payloadTemplate: {
      image: ''
    }
  };
