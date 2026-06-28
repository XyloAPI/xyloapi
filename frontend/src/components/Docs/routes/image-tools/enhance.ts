import type { DocTopic } from '../../types';

export const enhanceRoute: DocTopic = {
    id: 'enhance',
    title: 'AI Image Enhancer',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/enhance',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Tingkatkan warna, kontras, dan ketajaman gambar Anda secara otomatis dengan satu klik.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diproses.' }
    ],
    payloadTemplate: {
      image: ''
    }
  };
