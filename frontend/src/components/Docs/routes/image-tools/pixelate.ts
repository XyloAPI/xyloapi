import type { DocTopic } from '../../types';

export const pixelateRoute: DocTopic = {
    id: 'pixelate',
    title: 'Pixelate Effect',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/pixelate',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Buat efek piksel retro 8-bit pada gambar secara instan dengan menyesuaikan ukuran piksel.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diproses.' },
      { name: 'pixel_size', type: 'number', required: false, desc: 'Ukuran blok piksel dari 2 hingga 100. Default adalah 10.' }
    ],
    payloadTemplate: {
      image: '',
      pixel_size: 10
    }
  };
