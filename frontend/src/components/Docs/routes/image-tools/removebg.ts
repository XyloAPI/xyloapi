import type { DocTopic } from '../../types';

export const removebgRoute: DocTopic = {
    id: 'removebg',
    title: 'Remove Background',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/removebg',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Hapus latar belakang dari gambar secara instan dan otomatis menggunakan AI.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diproses.' }
    ],
    payloadTemplate: {
      image: ''
    }
  };
