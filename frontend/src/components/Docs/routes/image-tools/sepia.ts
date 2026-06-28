import type { DocTopic } from '../../types';

export const sepiaRoute: DocTopic = {
    id: 'sepia',
    title: 'Sepia Effect',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/sepia',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Terapkan filter warna sepia bergaya klasik dan vintage pada gambar dengan intensitas yang dapat disesuaikan.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diproses.' },
      { name: 'intensity', type: 'number', required: false, desc: 'Intensitas efek sepia dari 0 hingga 100. Default adalah 80.' }
    ],
    payloadTemplate: {
      image: '',
      intensity: 80
    }
  };
