import type { DocTopic } from '../../types';

export const posterizeRoute: DocTopic = {
    id: 'posterize',
    title: 'Posterize Effect',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/posterize',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Kurangi jumlah warna pada gambar untuk menciptakan efek artistik poster jadul.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diproses.' },
      { name: 'color_levels', type: 'number', required: false, desc: 'Jumlah tingkat warna dari 2 hingga 256. Default adalah 8.' }
    ],
    payloadTemplate: {
      image: '',
      color_levels: 8
    }
  };
