import type { DocTopic } from '../../types';

export const toBarefaceRoute: DocTopic = {
    id: 'to-bareface',
    title: 'To Bareface (No Makeup)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-bareface',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah wajah menjadi tanpa riasan atau filter (bareface) dengan kulit alami.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};
