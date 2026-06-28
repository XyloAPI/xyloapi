import type { DocTopic } from '../../types';

export const toKriboRoute: DocTopic = {
    id: 'to-kribo',
    title: 'To Kribo (Afro Hair)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-kribo',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah gaya rambut menjadi kribo besar bergaya klasik.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};
