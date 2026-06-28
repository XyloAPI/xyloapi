import type { DocTopic } from '../../types';

export const toBotakRoute: DocTopic = {
    id: 'to-botak',
    title: 'To Botak (Make Bald)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-botak',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah gaya rambut menjadi botak.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
      image: ''
    }
  };
