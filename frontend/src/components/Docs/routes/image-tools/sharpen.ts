import type { DocTopic } from '../../types';

export const sharpenRoute: DocTopic = {
    id: 'sharpen',
    title: 'Sharpen Image',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/sharpen',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Pertajam detail gambar Anda secara online dengan intensitas yang dapat disesuaikan.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diproses.' },
      { name: 'intensity', type: 'number', required: false, desc: 'Intensitas penajaman dari 0 hingga 100. Default adalah 50.' }
    ],
    payloadTemplate: {
      image: '',
      intensity: 50
    }
  };
