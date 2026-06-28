import type { DocTopic } from '../../types';

export const flipRoute: DocTopic = {
    id: 'flip',
    title: 'Flip Image',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/flip',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Balik (flip) gambar Anda secara vertikal atau horizontal secara online.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diproses.' },
      {
        name: 'direction',
        type: 'select',
        required: false,
        desc: 'Arah flip: "horizontal" atau "vertical". Default adalah "horizontal".',
        options: [
          { value: 'horizontal', label: 'Horizontal (Mirror Effect)' },
          { value: 'vertical', label: 'Vertical (Upside Down)' }
        ]
      } as any
    ],
    payloadTemplate: {
      image: '',
      direction: 'horizontal'
    }
  };
