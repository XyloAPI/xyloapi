import type { DocTopic } from '../../types';

export const toHantuRoute: DocTopic = {
    id: 'to-hantu',
    title: 'To Hantu (Ghost Effect)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-hantu',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah wajah menjadi hantu menyeramkan dengan kulit pucat.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};
