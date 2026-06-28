import type { DocTopic } from '../../types';

export const round_cornersRoute: DocTopic = {
    id: 'round-corners',
    title: 'Round Corners',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/round-corners',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Buat sudut melengkung pada gambar. Sesuaikan radius sudut untuk menghasilkan tepi yang membulat dan halus.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diproses.' },
      { name: 'radius', type: 'number', required: false, desc: "Radius sudut dalam piksel (contoh: 30) atau persentase (contoh: '25%'). Default adalah 30." }
    ],
    payloadTemplate: {
      image: '',
      radius: 30
    }
  };
