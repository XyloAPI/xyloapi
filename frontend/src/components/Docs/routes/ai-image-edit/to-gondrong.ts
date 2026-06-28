import type { DocTopic } from '../../types';

export const toGondrongRoute: DocTopic = {
    id: 'to-gondrong',
    title: 'To Gondrong (Long Hair)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-gondrong',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah gaya rambut menjadi gondrong yang keren.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};
