import type { DocTopic } from '../../types';

export const splitRoute: DocTopic = {
    id: 'split',
    title: 'Split Image',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/split',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Bagi (split) gambar Anda menjadi beberapa bagian (kolom vertikal dan baris horizontal) secara instan.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diproses.' },
      { name: 'rows', type: 'number', required: false, desc: 'Jumlah baris untuk membagi gambar (1-10). Default adalah 2.' },
      { name: 'cols', type: 'number', required: false, desc: 'Jumlah kolom untuk membagi gambar (1-10). Default adalah 2.' }
    ],
    payloadTemplate: {
      image: '',
      rows: 2,
      cols: 2
    }
  };
