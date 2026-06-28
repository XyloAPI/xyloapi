import type { DocTopic } from '../../types';

export const toTniRoute: DocTopic = {
    id: 'to-tni',
    title: 'To TNI (Military Uniform)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-tni',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Ubah foto mengenakan seragam loreng TNI di lapangan latihan.',
    parameters: [
        { name: 'image', type: 'file', required: true, desc: 'File gambar atau URL gambar yang ingin diubah.' }
    ],
    payloadTemplate: {
        image: ''
    }
};
