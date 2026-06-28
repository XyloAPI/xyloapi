import type { DocTopic } from '../../types';

export const toBlondeRoute: DocTopic = {
    id: 'to-blonde',
    title: 'To Blonde (Make Blonde Hair)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-blonde',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah warna rambut menjadi pirang (blonde).',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};
