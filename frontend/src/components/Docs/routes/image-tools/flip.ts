import type { DocTopic } from '../../types';

export const flipRoute: DocTopic = {
    id: 'flip',
    title: 'Flip Image',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/flip',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Flip your images horizontally (mirror effect) or vertically (upside down) instantly. Upload an image file or provide a direct image URL.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Image file or image URL to process.' },
      {
        name: 'direction',
        type: 'select',
        required: false,
        desc: 'Flip direction: "horizontal" or "vertical". Default is "horizontal".',
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
