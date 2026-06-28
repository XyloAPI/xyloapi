import type { DocTopic } from '../../types';

export const blurfaceRoute: DocTopic = {
    id: 'blurface',
    title: 'Blur Face Effect',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/blurface',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Deteksi otomatis dan buramkan wajah pada gambar menggunakan AI.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diproses.' },
      { name: 'strength', type: 'number', required: false, desc: 'Intensitas buram dari 1 hingga 2000. Default adalah 500.' }
    ],
    payloadTemplate: {
      image: '',
      strength: 500
    }
  };
