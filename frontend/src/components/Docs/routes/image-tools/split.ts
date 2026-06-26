import type { DocTopic } from '../../types';

export const splitRoute: DocTopic = {
    id: 'split',
    title: 'Split Image',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/split',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Split your images into multiple parts (horizontal rows and vertical columns grid) instantly. Upload an image file or provide a direct image URL.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Image file or image URL to process.' },
      { name: 'rows', type: 'number', required: false, desc: 'Number of rows to split the image into (1-10). Default is 2.' },
      { name: 'cols', type: 'number', required: false, desc: 'Number of columns to split the image into (1-10). Default is 2.' }
    ],
    payloadTemplate: {
      image: '',
      rows: 2,
      cols: 2
    }
  };
